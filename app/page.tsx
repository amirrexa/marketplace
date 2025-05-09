import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketplace | Buy & Sell with Ease",
  description:
    "A minimal yet powerful platform to browse, sell, and manage real physical products. Built for buyers, sellers, and admins.",
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
            A platform built for modern sellers and buyers. Role-based dashboard, order management, and fast uploads.
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
            src="/hero.png" // 🖼 Replace with your own image later
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
