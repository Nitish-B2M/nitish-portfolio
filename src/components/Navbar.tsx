"use client";

import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  
  // Handle mounting state
  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // Only run scroll effect on client and for home page
  useLayoutEffect(() => {
    if (!isMounted || pathname !== '/') return;

    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => item.href.substring(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted, pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  // Don't render anything until mounted
  if (!isMounted) return null;

  // Show different navigation for admin pages
  if (pathname?.startsWith('/admin')) {
    return (
      <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-primary-900/60 border-b border-primary-800 text-primary-100">
        <div className="flex items-center justify-between max-w-7xl px-6 py-4 mx-auto">
          <Link href="/admin" className="text-2xl font-extrabold text-primary-100">
            Admin
          </Link>
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-semibold rounded-full border-2 border-primary-400 text-primary-200 hover:bg-primary-400 hover:text-primary-950 transition"
          >
            Sign Out
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed inset-x-0 top-2 lg:top-4 z-50 max-w-7xl lg:mx-auto mx-2 rounded-3xl backdrop-blur-md ${activeSection === "home" ? "bg-primary-200/60" : "bg-primary-300/60"} border-b border-primary-800 text-white ${isOpen ? "rounded-b-none border border-b-0 border-primary-600" : ""}`}>
      <div className="flex items-center justify-between px-6 py-3 mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary-900">
          N
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a 
                href={item.href} 
                className={`transition-all duration-300 hover:text-primary-900 ${
                  activeSection === item.href.substring(1) ? "text-primary-900" : ""
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:inline-block px-4 py-2 text-sm font-semibold rounded-full border-2 border-primary-100 text-primary-900 hover:bg-primary-400 hover:text-primary-900 transition-all duration-300"
        >
          Contact Us
        </a>

        {/* Mobile hamburger */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-xl text-primary-900 hover:text-primary-900" 
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 bg-primary-900/95 md:hidden rounded-br-3xl rounded-bl-3xl ${isOpen ? "rounded-b-none border border-t-0 border-primary-200" : ""}`}>
            <ul className="flex flex-col p-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 transition hover:text-primary-200 ${
                      activeSection === item.href.substring(1) ? "text-primary-200" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 mt-2 text-center border-2 border-primary-200 rounded-full hover:bg-primary-400 hover:text-primary-200 transition"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
} 