import { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import {
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
  FaGlobe,
  FaGithub,
} from "react-icons/fa6";

const description = "Connect with Ayush Shah on various social media platforms.";

export const metadata: Metadata = {
  title: "Social Media Links",
  description,
  alternates: { canonical: "/social-media" },
  openGraph: {
    type: "profile",
    url: "/social-media",
    title: "Ayush Shah — Social Media Links",
    description,
  },
};

const socialLinks = [
  {
    platform: "YouTube (Main)",
    handle: "Ayush Shah",
    href: "https://youtube.com/ayushshah",
    icon: FaYoutube,
  },
  {
    platform: "YouTube (Tech)",
    handle: "@developerrayush",
    href: "https://youtube.com/@developerrayush",
    icon: FaYoutube,
  },
  {
    platform: "Twitter (X)",
    handle: "@developerrayush",
    href: "https://x.com/developerrayush",
    icon: FaXTwitter,
  },
  {
    platform: "LinkedIn",
    handle: "linkedin.com/in/developerr-ayush",
    href: "https://linkedin.com/in/developerr-ayush",
    icon: FaLinkedin,
  },
  {
    platform: "Portfolio",
    handle: "developer-ayush.com",
    href: "https://developer-ayush.com",
    icon: FaGlobe,
  },
  {
    platform: "GitHub",
    handle: "github.com/developerr-ayush",
    href: "https://github.com/developerr-ayush",
    icon: FaGithub,
  },
];

export default function SocialMediaPage() {
  return (
    <div className="container-x max-w-3xl pb-24 pt-12 sm:pt-16">
      <Link
        href="/"
        className="link-underline inline-flex items-center gap-2 text-sm"
      >
        <FiArrowLeft aria-hidden="true" /> Back to home
      </Link>

      <h1 className="display mt-10 text-6xl sm:text-7xl">
        Ayush Shah, <em className="text-accent">elsewhere</em>
      </h1>
      <p className="mt-4 text-lg text-muted">
        Connect with me across various platforms.
      </p>

      <ul className="mt-12 border-t border-line">
        {socialLinks.map((link) => (
          <li key={link.platform} className="border-b border-line">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-20 items-center gap-5 py-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent">
                <link.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="display block text-3xl">{link.platform}</span>
                <span className="font-mono text-xs text-muted">{link.handle}</span>
              </span>
              <FiArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
