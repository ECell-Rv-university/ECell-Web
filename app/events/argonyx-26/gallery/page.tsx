import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Argonyx '26 Gallery | ECell RV University",
  description:
    "Photo gallery from Argonyx '26 — the 24-hour national hackathon at RV University, Bengaluru. Explore moments from inauguration, coding sessions, mentor sessions, judging rounds, and more.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
