import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/70 backdrop-blur-lg text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
        >
          JobSearch
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/jobs">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              Browse Jobs
            </Button>
          </Link>
          <Link href="/liked">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              Liked Jobs
            </Button>
          </Link>
          <Link href="/auth/login">
            {" "}
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/create-profile">
            {" "}
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
