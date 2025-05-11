import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketplace | Buy & Sell Real Products",
  description:
    "A powerful, minimal platform to browse, sell, and manage physical products with role-based dashboards for buyers, sellers, and admins.",
  metadataBase: new URL(`${process.env.WEBSITE_URL}`),
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
  authors: [
    { name: "Digital Marketplace Team", url: `${process.env.WEBSITE_URL}` },
  ],
  creator: "Digital Marketplace Team",
  openGraph: {
    title: "Digital Marketplace | Buy & Sell Real Products",
    description:
      "Seamlessly browse, upload, and manage real products in a modern, minimal marketplace for buyers, sellers, and admins.",
    url: `${process.env.WEBSITE_URL}`,
    siteName: "Digital Marketplace",
    images: [
      {
        url: "/og-dark.png", // 🌙 for dark mode
        width: 1200,
        height: 630,
        alt: "Digital Marketplace Preview (Dark)",
        type: "image/png",
      },
      {
        url: "/og-light.png", // ☀️ for light mode
        width: 1200,
        height: 630,
        alt: "Digital Marketplace Preview (Light)",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketplace | Buy & Sell Real Products",
    description:
      "Role-based dashboards, cart functionality, secure checkout, and product uploads. Built for modern commerce.",
    creator: "@amirrexa", // 🐦 Replace if applicable
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
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-12 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Buy & Sell Real Products with Confidence
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            A platform built for modern sellers and buyers. Role-based dashboard,
            order management, and fast uploads.
          </p>
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-md w-full">
          <Image
            src="/hero.png" // ✅ Replace this with a high-quality SEO-optimized image
            alt="Marketplace preview"
            width={500}
            height={400}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 sm:grid-cols-3 px-6 py-16 bg-muted text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">👥 Role-Based Access</h3>
          <p className="mt-2 text-sm">
            Buyers browse, Sellers manage, Admins control — all with tailored dashboards.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">🛒 Seamless Cart & Orders</h3>
          <p className="mt-2 text-sm">
            Add to cart, manage quantities, and place orders smoothly.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">📦 Real Product Uploads</h3>
          <p className="mt-2 text-sm">
            Sellers can upload, preview, and edit products with image support.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-muted-foreground text-center py-6 border-t">
        © {new Date().getFullYear()} Digital Marketplace. All rights reserved.
      </footer>
    </main>
  );
}
