import { notFound } from "next/navigation";

// Unknown localized paths render [locale]/not-found.tsx
export default function CatchAllPage() {
  notFound();
}
