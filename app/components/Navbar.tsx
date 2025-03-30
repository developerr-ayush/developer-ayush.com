"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { personalInfo } from "../data";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/80 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gradient">
          Ayush Shah
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="#experience"
            className="text-foreground hover:text-primary transition-colors"
          >
            Experience
          </Link>
          <Link
            href="#projects"
            className="text-foreground hover:text-primary transition-colors"
          >
            Projects
          </Link>
          <Link
            href="#services"
            className="text-foreground hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Social Links */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary text-xl transition-colors"
            aria-label="GitHub Profile"
          >
            <FaGithub />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary text-xl transition-colors"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin />
          </a>
          <a
            href="#contact"
            className="px-4 py-2 bg-gradient text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Contact Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-current transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-current transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-current transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 pt-20 pb-6 px-4 bg-surface/95 backdrop-blur-md z-40 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-4 text-center">
          <Link
            href="#about"
            className="py-3 text-foreground hover:text-primary transition-colors text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="#experience"
            className="py-3 text-foreground hover:text-primary transition-colors text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Experience
          </Link>
          <Link
            href="#projects"
            className="py-3 text-foreground hover:text-primary transition-colors text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>
          <Link
            href="#services"
            className="py-3 text-foreground hover:text-primary transition-colors text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="py-3 text-foreground hover:text-primary transition-colors text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>

          <div className="flex justify-center gap-6 mt-6">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary text-2xl transition-colors"
              aria-label="GitHub Profile"
            >
              <FaGithub />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary text-2xl transition-colors"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin />
            </a>
          </div>

          <a
            href="#contact"
            className="mt-6 px-6 py-3 bg-gradient text-white rounded-full text-base font-medium mx-auto hover:opacity-90 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Me
          </a>
        </nav>
      </div>
    </header>
  );
}
