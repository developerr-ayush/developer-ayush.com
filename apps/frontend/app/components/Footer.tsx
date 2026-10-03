import Link from "next/link";
import { personalInfo, socialLinks } from "../data";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container-x grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="display text-4xl sm:text-5xl">
            Let&apos;s build something <em className="text-accent">fast</em>.
          </p>
          <a
            href={`mailto:${personalInfo.email}`}
            className="link-underline mt-4 inline-block text-lg"
          >
            {personalInfo.email}
          </a>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-3">Site</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="link-underline" href="/#portfolio">Work</Link></li>
            <li><Link className="link-underline" href="/#experience">Experience</Link></li>
            <li><Link className="link-underline" href="/blog">Blog</Link></li>
            <li><Link className="link-underline" href="/gallery">Gallery</Link></li>
            <li><Link className="link-underline" href="/social-media">Links</Link></li>
            <li>
              <a className="link-underline" href={personalInfo.resumePdf}>
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow mb-3">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-2"
                >
                  <social.icon aria-hidden="true" className="h-4 w-4" />
                  {social.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x">
        <div className="flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {currentYear} {personalInfo.name}. Mumbai, India.</p>
          <p>Built with Next.js and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
