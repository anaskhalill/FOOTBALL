"use client";

import { useEffect } from "react";

// Signals that the initial React tree has finished hydrating. Language
// restoration waits for this so a saved locale can never change translated
// text while a Suspense boundary is still hydrating against English SSR HTML.
export default function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.appHydrated = "true";
  }, []);
  return null;
}
