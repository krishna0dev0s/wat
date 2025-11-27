"use client";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Code,
  DollarSign,
  FileText,
  GraduationCapIcon,
  LayoutDashboard,
  PenBox,
  StarsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButtonWrapper } from "./user-button-wrapper";
import { HeaderAuth } from "./header-auth";

const Header = () => {
  return (
    <header
      className="border-b sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        color: "var(--card-foreground)",
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/image.png"
            alt="Logo"
            width={120}
            height={40}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation & Auth */}
        <HeaderAuth />
      </nav>
    </header>
  );
};

export default Header;