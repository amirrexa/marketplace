import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen gap-4">
      <h1 className="text-2xl font-bold">Digital Products Marketplace</h1>
      <div className="flex items-center gap-4">
        <Link href={'/register'}><Button>Register</Button></Link>
        <Link href={'/login'}><Button>Login</Button></Link>
      </div>
    </main>
  );
}
