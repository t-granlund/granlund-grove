import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of children when a descendant throws during render. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Minimal React error boundary.
 *
 * React's <Suspense> only catches *pending* promises, not thrown errors — so a
 * transient asset failure inside a heavy subtree (e.g. the WebGL globe's
 * texture loader) would otherwise crash the whole page. Wrap such subtrees in
 * this boundary with a graceful static fallback so one decorative dependency
 * can never take down the route.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught a render error:", error);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
