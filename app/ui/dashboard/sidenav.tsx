"use client";

import { useState } from "react";
import Link from "next/link";
import NavLinks from "./nav-links";
import AppLogo from "../app-logo";
import {
  PowerIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-md bg-gray-100 shadow-md"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          px-3 py-4 flex flex-col bg-gray-200
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex h-20 md:h-40 items-center justify-center mb-4"
        >
          <AppLogo showText={false} size={250} />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col overflow-hidden">
          {/* Links */}
          <div className="flex flex-col gap-2">
            <NavLinks onLinkClick={handleLinkClick} />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sign out */}
          <button
            type="button"
            onClick={() => {
              signOut({ callbackUrl: "/login" });
              setIsOpen(false);
            }}
            className="flex h-12 items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
          >
            <PowerIcon className="w-6" />
            <span className="hidden md:block">Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}
    </>
  );
}
