import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/siteContentService";

// Cached static HTML; revalidated on-demand when the admin saves, hourly otherwise.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact — Naima Uddin",
  description:
    "Get in touch to discuss your project or just say hi — open to freelance and interesting projects.",
};

export default async function Contact() {
  const content = await getSiteContent();

  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <ContactSection standalone config={content.profile} />
      <Footer config={content.profile} />
    </main>
  );
}
