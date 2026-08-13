import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";

/**
 * Public marketing/auth shell — ARCHITECTURE.md §3 `(public)/layout.tsx`.
 * Header is rendered in the root layout. This layer adds the footer.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
