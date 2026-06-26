import type { Metadata } from "next";
import NotFoundContent from "./NotFoundContent";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return <NotFoundContent />;
}
