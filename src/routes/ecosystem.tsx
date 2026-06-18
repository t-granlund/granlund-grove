import { createFileRoute, redirect } from "@tanstack/react-router";

// The ecosystem now lives inside /work. Redirect the old standalone route to the
// in-page section so existing bookmarks and external links keep working.
export const Route = createFileRoute("/ecosystem")({
  beforeLoad: () => {
    throw redirect({ to: "/work", hash: "ecosystem" });
  },
});
