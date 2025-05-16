
'use client';
// src/components/layout/GenkitClientProvider.tsx

// This is an empty provider for now.
// Genkit flows defined with `defineFlow` and exported from server files
// can be directly imported and called in Client Components.
// The `genkitNextHandler` in `src/app/(api)/genkit/[...path]/route.ts`
// handles the API endpoint creation.

// If specific client-side Genkit setup or context were needed, it would go here.
// For now, just a pass-through for children.
export function GenkitClientProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
