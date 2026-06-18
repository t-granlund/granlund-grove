// Lightweight RAG engine — client-side, zero external dependencies.
// Keyword-based retrieval + template response generation.

import { knowledgeBase, topicSynonyms, type KnowledgeChunk } from "./knowledge";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

// Tokenize a query into normalized keywords
// Short but meaningful domain acronyms that should survive the length filter
// (otherwise "AI", "ML", "BI", "QA", "CI/CD" queries lose their core keyword).
const KEEP_SHORT = new Set(["ai", "ml", "bi", "qa", "ux", "ci", "cd", "pe", "llm", "rag"]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => (t.length > 2 || KEEP_SHORT.has(t)) && !STOPWORDS.has(t));
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "had",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "its",
  "may",
  "new",
  "now",
  "old",
  "see",
  "two",
  "who",
  "boy",
  "did",
  "she",
  "use",
  "her",
  "way",
  "many",
  "oil",
  "sit",
  "set",
  "run",
  "eat",
  "far",
  "sea",
  "eye",
  "ago",
  "off",
  "too",
  "any",
  "say",
  "man",
  "try",
  "ask",
  "end",
  "why",
  "let",
  "put",
  "say",
  "she",
  "too",
  "try",
  "way",
  "own",
  "say",
  "too",
  "old",
  "tell",
  "very",
  "when",
  "come",
  "could",
  "would",
  "should",
  "what",
  "where",
  "which",
  "their",
  "there",
  "then",
  "than",
  "them",
  "these",
  "those",
  "this",
  "that",
  "with",
  "have",
  "from",
  "they",
  "know",
  "want",
  "been",
  "good",
  "much",
  "some",
  "time",
  "work",
  "well",
  "just",
  "like",
  "over",
  "also",
  "back",
  "only",
  "think",
  "look",
  "more",
  "here",
  "does",
  "didn",
  "don",
  "isn",
  "wasn",
  "won",
  "about",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "again",
  "further",
  "once",
  "most",
  "other",
  "each",
  "few",
  "more",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "can",
  "will",
  "just",
  "should",
  "now",
  "do",
  "does",
  "did",
  "has",
  "had",
  "have",
  "having",
  "was",
  "were",
  "be",
  "been",
  "being",
  "am",
  "is",
  "are",
  "was",
  "were",
  "being",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "may",
  "might",
  "must",
  "can",
  "could",
  "need",
  "dare",
  "ought",
  "used",
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "whose",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "may",
  "might",
  "must",
  "can",
  "could",
  "need",
  "dare",
  "ought",
  "used",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
]);

// Score how well a query matches a chunk
function scoreChunk(queryTokens: string[], chunk: KnowledgeChunk): number {
  let score = 0;

  // Direct keyword matches in chunk text — word-boundary only, so short tokens
  // like "ai"/"ml" don't false-match inside "email"/"available"/"fabric".
  const chunkText = chunk.text.toLowerCase();
  for (const token of queryTokens) {
    const regex = new RegExp(`\\b${token}\\b`, "g");
    const matches = chunkText.match(regex);
    if (matches) score += 2 + matches.length * 1.5;
  }

  // Topic / synonym matches
  for (const topic of chunk.topics) {
    const topicLower = topic.toLowerCase();
    for (const token of queryTokens) {
      if (topicLower.includes(token) || token.includes(topicLower)) {
        score += 4;
      }
      // Check synonym map
      const syns = topicSynonyms[topic] || [];
      for (const syn of syns) {
        if (syn.toLowerCase().includes(token) || token.includes(syn.toLowerCase())) {
          score += 3;
        }
      }
    }
  }

  // Priority boost
  score *= 0.5 + chunk.priority / 10;

  return score;
}

export function retrieve(query: string, topK = 3): RetrievalResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = knowledgeBase.map((chunk) => ({
    chunk,
    score: scoreChunk(tokens, chunk),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((r) => r.score > 2).slice(0, topK);
}

// Generate a natural-sounding response from retrieved chunks
export function generateResponse(query: string, results: RetrievalResult[]): string {
  if (results.length === 0) {
    return fallbackResponse(query);
  }

  const top = results[0];
  const score = top.score;
  const text = top.chunk.text;

  // Very high confidence → direct answer
  if (score > 15) {
    return directAnswer(text, top.chunk.source);
  }

  // Medium confidence → contextual answer
  if (score > 8) {
    return contextualAnswer(text, top.chunk.source, results.slice(1));
  }

  // Low confidence → partial answer + contact CTA
  return tentativeAnswer(text, top.chunk.source);
}

function directAnswer(text: string, source: string): string {
  const intros = ["", "Here's the short version: ", "From what I know: ", ""];
  const intro = intros[Math.floor(Math.random() * intros.length)];
  return `${intro}${text}`;
}

function contextualAnswer(text: string, source: string, otherResults: RetrievalResult[]): string {
  let response = text;

  if (otherResults.length > 0 && otherResults[0].score > 6) {
    const extra = otherResults[0].chunk.text;
    // If it's a different source, add as context
    if (otherResults[0].chunk.source !== source) {
      response += ` Also: ${extra}`;
    }
  }

  return response;
}

function tentativeAnswer(text: string, source: string): string {
  return `${text}\n\nIf you'd like to go deeper on this, Tyler's happy to talk directly. You can reach him at hello@tylergranlund.com or use the contact form on this site.`;
}

function fallbackResponse(_query: string): string {
  const fallbacks = [
    "I don't have a specific answer for that in my knowledge base, but Tyler would be glad to talk about it. Reach him at hello@tylergranlund.com or use the contact form.",
    "That's a great question — I don't have the details on that one. Tyler's the best person to ask. Email him at hello@tylergranlund.com or send a message through the contact page.",
    "Hmm, I don't have that in my notes. Tyler handles questions like this all the time though. Drop him a line at hello@tylergranlund.com or use the contact form below.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// Pre-built suggested questions
export const suggestedQuestions = [
  "Is Tyler available for hire?",
  "What is Tyler's background?",
  "Tell me about Control Tower",
  "What skills does Tyler have?",
  "How can I contact Tyler?",
  "What is Code Puppy?",
  "Tell me about his last role",
  "What is the TenantFleet ecosystem?",
];

// Simple greeting detection
export function isGreeting(query: string): boolean {
  const q = query.toLowerCase().trim();
  const greetings = [
    "hi",
    "hello",
    "hey",
    "howdy",
    "good morning",
    "good afternoon",
    "good evening",
    "what's up",
    "yo",
  ];
  return greetings.some((g) => q === g || q.startsWith(g + " "));
}

export function greetingResponse(): string {
  const greetings = [
    "Hey there! Tyler is currently looking for his next opportunity. I know all about his background, skills, projects, and experience. What would you like to know? If you want to reach him directly, hello@tylergranlund.com is the fastest way.",
    "Hi! Tyler is available for full-time roles, consulting, and collaborations. Ask me about his work at Apple, School of Rock, Outdoor Cap, North 40, or Head to Toe Brands — or his skills in AI, cloud, identity, and systems engineering. For direct contact: hello@tylergranlund.com.",
    "Hello! Tyler is actively looking for his next role. I can answer questions about his career history, technical skills, projects, and availability. Reach him directly at hello@tylergranlund.com for opportunities or questions.",
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// Export for use in UI
export function processQuery(query: string): { response: string; sources: string[] } {
  const trimmed = query.trim();
  if (!trimmed) {
    return { response: "What would you like to know?", sources: [] };
  }

  if (isGreeting(trimmed)) {
    return { response: greetingResponse(), sources: [] };
  }

  const results = retrieve(trimmed);
  const response = generateResponse(trimmed, results);
  const sources = results.map((r) => r.chunk.source).filter((s, i, a) => a.indexOf(s) === i);

  return { response, sources };
}
