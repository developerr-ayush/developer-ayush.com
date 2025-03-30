import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { personalInfo } from "../data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 bg-background border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-gradient mb-2 inline-block"
            >
              Ayush Shah
            </Link>
            <p className="text-foreground/70 text-sm">
              UI/UX &amp; Front-End Developer crafting modern web experiences
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
            <nav className="flex gap-6">
              <Link
                href="#about"
                className="text-foreground/80 hover:text-primary transition-colors text-sm"
              >
                About
              </Link>
              <Link
                href="#experience"
                className="text-foreground/80 hover:text-primary transition-colors text-sm"
              >
                Experience
              </Link>
              <Link
                href="#projects"
                className="text-foreground/80 hover:text-primary transition-colors text-sm"
              >
                Projects
              </Link>
              <Link
                href="#contact"
                className="text-foreground/80 hover:text-primary transition-colors text-sm"
              >
                Contact
              </Link>
            </nav>

            <div className="flex gap-4">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors text-lg"
                aria-label="GitHub Profile"
              >
                <FaGithub />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors text-lg"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 mt-8 pt-8 text-center text-foreground/60 text-sm">
          <p>&copy; {currentYear} Ayush Shah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
