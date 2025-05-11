import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/Framer";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export const metadata: Metadata = {
  title: "Digital Marketplace | Buy & Sell Real Products",
  description:
    "A powerful, minimal platform to browse, sell, and manage physical products with role-based dashboards for buyers, sellers, and admins.",
  metadataBase: new URL(process.env.WEBSITE_URL!),
  keywords: [
    "digital marketplace",
    "buy products online",
    "sell real products",
    "ecommerce platform",
    "buyer seller admin dashboard",
    "shopping cart",
    "product upload",
    "physical goods",
    "secure checkout",
  ],
  authors: [{ name: "Digital Marketplace Team", url: process.env.WEBSITE_URL }],
  creator: "Digital Marketplace Team",
  openGraph: {
    title: "Digital Marketplace | Buy & Sell Real Products",
    description:
      "Seamlessly browse, upload, and manage real products in a modern, minimal marketplace for buyers, sellers, and admins.",
    url: process.env.WEBSITE_URL,
    siteName: "Digital Marketplace",
    images: [
      { url: "/og-dark.png", width: 1200, height: 630, alt: "Preview Dark", type: "image/png" },
      { url: "/og-light.png", width: 1200, height: 630, alt: "Preview Light", type: "image/png" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketplace | Buy & Sell Real Products",
    description:
      "Role-based dashboards, cart functionality, secure checkout, and product uploads. Built for modern commerce.",
    creator: "@amirrexa",
    images: ["/og-dark.png", "/og-light.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-dark.ico", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-light.ico", media: "(prefers-color-scheme: light)" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground relative">
      <ThemeToggleButton />

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 px-6 py-24 max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center md:text-left max-w-xl"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Buy & Sell Real Products <span className="text-primary">with Confidence</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Role-based dashboards for buyers, sellers, and admins. Manage your marketplace with ease.
          </p>
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
            <Link href="/register"><Button size="lg">Get Started</Button></Link>
            <Link href="/login"><Button variant="outline" size="lg">Login</Button></Link>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-md w-full"
        >
          <Image
            src="/hero.png"
            alt="Marketplace preview"
            width={500}
            height={400}
            className="w-full h-auto object-contain rounded-lg"
            priority
          />
        </MotionDiv>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 sm:grid-cols-3 px-6 py-16 bg-muted text-muted-foreground">
        {[
          {
            title: "👥 Role-Based Access",
            desc: "Buyers browse, Sellers manage, Admins control — all with tailored dashboards.",
          },
          {
            title: "🛒 Seamless Cart & Orders",
            desc: "Add to cart, manage quantities, and place orders smoothly.",
          },
          {
            title: "📦 Real Product Uploads",
            desc: "Sellers can upload, preview, and edit products with image support.",
          },
        ].map((feature, i) => (
          <MotionDiv
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm">{feature.desc}</p>
          </MotionDiv>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-sm text-muted-foreground text-center py-6 border-t">
        © {new Date().getFullYear()} Digital Marketplace. All rights reserved.
      </footer>
    </main>
  );
}
