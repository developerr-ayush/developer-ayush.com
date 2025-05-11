import { Metadata } from "next";
import Link from "next/link";
import {
  FaYoutube,
  FaXTwitter,
  FaLinkedin,
  FaGlobe,
  FaGithub,
} from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Ayush Shah – Social Media Links",
  description: "Connect with Ayush Shah on various social media platforms",
};

interface SocialLinkProps {
  icon: React.ReactNode;
  platform: string;
  handle: string;
  href: string;
}

function SocialLink({ icon, platform, handle, href }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-lg">{platform}</h3>
        <p className="text-foreground/75">{handle}</p>
      </div>
      <div className="group">
        <span className="px-3 py-1 rounded-full text-sm bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
          Visit
        </span>
      </div>
    </a>
  );
}

export default function SocialMediaPage() {
  const socialLinks = [
    {
      platform: "YouTube (Main)",
      handle: "Ayush Shah",
      href: "https://youtube.com/ayushshah",
      icon: <FaYoutube className="w-6 h-6" />,
    },
    {
      platform: "YouTube (Tech)",
      handle: "@developerrayush",
      href: "https://youtube.com/@developerrayush",
      icon: <FaYoutube className="w-6 h-6" />,
    },
    {
      platform: "Twitter (X)",
      handle: "@developerrayush",
      href: "https://x.com/developerrayush",
      icon: <FaXTwitter className="w-6 h-6" />,
    },
    {
      platform: "LinkedIn",
      handle: "linkedin.com/in/developerr-ayush",
      href: "https://linkedin.com/in/developerr-ayush",
      icon: <FaLinkedin className="w-6 h-6" />,
    },
    {
      platform: "Portfolio",
      handle: "developer-ayush.com",
      href: "https://developer-ayush.com",
      icon: <FaGlobe className="w-6 h-6" />,
    },
    {
      platform: "GitHub",
      handle: "github.com/developerr-ayush",
      href: "https://github.com/developerr-ayush",
      icon: <FaGithub className="w-6 h-6" />,
    },
  ];

  return (
    <main className="min-h-screen py-16 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-sky-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block mb-8 text-sky-500 hover:text-sky-400"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent">
              Ayush Shah
            </span>{" "}
            – Social & Web Links
          </h1>
          <p className="text-foreground/75 max-w-2xl mx-auto">
            Connect with me across various platforms
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg space-y-4">
          {socialLinks.map((link) => (
            <SocialLink
              key={link.platform}
              icon={link.icon}
              platform={link.platform}
              handle={link.handle}
              href={link.href}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
