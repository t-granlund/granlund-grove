export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load — Spruce Grove</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 "Inter", system-ui, -apple-system, sans-serif; background: oklch(0.18 0.012 150); color: oklch(0.94 0.012 90); display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-family: "Fraunces", Georgia, serif; font-size: 1.5rem; font-weight: 300; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
      .cedar { color: oklch(0.78 0.12 55); font-style: normal; }
      p { color: oklch(0.72 0.012 90); margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 9999px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: linear-gradient(135deg, oklch(0.78 0.10 65), oklch(0.62 0.13 50)); color: oklch(0.16 0.012 150); border: none; }
      .secondary { background: oklch(0.22 0.014 155 / 0.5); color: oklch(0.94 0.012 90); border-color: oklch(0.40 0.02 150 / 0.4); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't <em class="cedar">load</em></h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Back to the grove</a>
      </div>
    </div>
  </body>
</html>`;
}
