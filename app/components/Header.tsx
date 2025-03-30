"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { personalInfo } from "../data";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = [
        "home",
        "about",
        "skills",
        "portfolio",
        "blog",
        "contact",
      ];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", path: "/", hash: "#home" },
    { name: "About", path: "/#about", hash: "#about" },
    { name: "Skills", path: "/#skills", hash: "#skills" },
    { name: "Portfolio", path: "/#portfolio", hash: "#portfolio" },
    { name: "Blog", path: "/blog", hash: null },
    { name: "Contact", path: "/#contact", hash: "#contact" },
  ];

  const isActive = (hash, path) => {
    if (hash) {
      return activeSection === hash.slice(1);
    } else {
      return pathname === path || (path !== "/" && pathname.startsWith(path));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-lg"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
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
          <div className="relative w-7 h-5">
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
        className={`fixed inset-0 z-40 bg-background backdrop-blur-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col pt-20`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-2">
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
