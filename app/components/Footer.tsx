import Link from "next/link";
import { socialLinks } from "../data";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground/[0.03] border-t border-foreground/10 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Ayush<span className="text-sky-500">.</span>
            </Link>
            <p className="mt-2 text-sm text-foreground/60">
              © {currentYear} Ayush Shah. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-foreground/5 hover:bg-sky-500/10 flex items-center justify-center text-foreground/70 hover:text-sky-500 transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-foreground/5 flex flex-col items-center">
          <nav className="flex flex-wrap justify-center gap-6 text-sm mb-4">
            <Link href="#hero" className="hover:text-sky-500 transition-colors">
              Home
            </Link>
            <Link
              href="#about"
              className="hover:text-sky-500 transition-colors"
            >
              About
            </Link>
            <Link
              href="#experience"
              className="hover:text-sky-500 transition-colors"
            >
              Experience
            </Link>
            <Link
              href="#portfolio"
              className="hover:text-sky-500 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="#skills"
              className="hover:text-sky-500 transition-colors"
            >
              Skills
            </Link>
            <Link
              href="#contact"
              className="hover:text-sky-500 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <p className="text-xs text-foreground/50">
            Designed & Built with ❤️ using Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
