"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    // Reset active section when path changes
    if (pathname === "/") {
      setActiveSection("home");
    }

    const handleScroll = () => {
      // Update scrolled state for header styling
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Only handle section detection on homepage
      if (pathname !== "/") return;

      // Define all sections we want to track
      const sections = [
        "home",
        "about",
        "skills",
        "portfolio",
        "blog",
        "contact",
      ];

      // Use IntersectionObserver-like logic for better section detection
      // Find which section occupies most of the viewport
      let maxVisibleSection = null;
      let maxVisibleHeight = 0;

      // Special case for hero section (at the top)
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

        // If this section has more visible area than previous max, update
        if (visibleHeight > maxVisibleHeight && visibleHeight > 0) {
          maxVisibleHeight = visibleHeight;
          maxVisibleSection = sectionId;
        }
      }

      if (maxVisibleSection) {
        setActiveSection(maxVisibleSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Also call once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const closeMobileMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", path: "/", hash: "#home" },
    { name: "About", path: "/#about", hash: "#about" },
    { name: "Skills", path: "/#skills", hash: "#skills" },
    { name: "Portfolio", path: "/#portfolio", hash: "#portfolio" },
    { name: "Blog", path: "/blog", hash: null },
    { name: "Contact", path: "/#contact", hash: "#contact" },
  ];

  const isActive = (hash: string | null, path: string) => {
    // Case 1: For exact paths like /blog
    if (path === "/blog" && pathname === "/blog") {
      return true;
    }

    // Case 2: For blog subdirectories
    if (path === "/blog" && pathname.startsWith("/blog/")) {
      return true;
    }

    // Case 3: For homepage without hash (only for Home link)
    if (path === "/" && hash === "#home" && pathname === "/") {
      return activeSection === "home";
    }

    // Case 4: For hash links on homepage
    if (hash && pathname === "/") {
      return activeSection === hash.slice(1);
    }

    // Not active in any case
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-lg"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center relative z-40">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-white">Ayush</span>
          <span className="text-sky-500">Shah</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                isActive(link.hash, link.path)
                  ? "bg-sky-500 text-white font-medium"
                  : "text-foreground/80 hover:text-white hover:bg-foreground/10"
              }`}
              onClick={closeMobileMenu}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <span
              className={`absolute h-0.5 w-7 bg-current transform transition-transform duration-300 ${
                isOpen ? "rotate-45 top-2" : "rotate-0 top-0"
              }`}
            />
            <span
              className={`absolute h-0.5 w-7 bg-current top-2 transition-opacity duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-0.5 w-7 bg-current transform transition-transform duration-300 ${
                isOpen ? "-rotate-45 top-2" : "rotate-0 top-4"
              }`}
            />
          </div>
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 w-full h-screen z-10 bg-background backdrop-blur-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col pt-20`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-2 ">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`py-4 px-4 text-lg rounded-lg transition-all flex items-center ${
                isActive(link.hash, link.path)
                  ? "bg-sky-500/20 text-sky-500 font-medium border-l-4 border-sky-500"
                  : "text-foreground/80 hover:bg-foreground/5 border-l-4 border-transparent"
              }`}
              onClick={closeMobileMenu}
            >
              {link.name}
            </Link>
          ))}

          <div className="py-4 mt-4 border-t border-foreground/10">
            <Link
              href="/#contact"
              className="block w-full py-3 rounded-full text-center bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
              onClick={closeMobileMenu}
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
