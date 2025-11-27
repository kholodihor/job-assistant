import type { Metadata } from "next";
import { NotFoundPage } from "@/components/not-found";

export const metadata: Metadata = {
  title: "404 page",
  description: "404 page",
};

export default function NotFound() {
  return <NotFoundPage />;
}
