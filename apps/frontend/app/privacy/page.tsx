import { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const description =
  "Privacy policy for developer-ayush.com and Ayush Shah's personal tools, including Studio Publisher.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    url: "/privacy",
    title: "Ayush Shah — Privacy Policy",
    description,
  },
};

const sections = [
  {
    title: "Who this covers",
    body: (
      <>
        This policy covers developer-ayush.com and Studio Publisher, a personal
        tool that runs on my own computer and uploads videos I make to my own
        YouTube channels, Instagram accounts and Facebook Pages.
      </>
    ),
  },
  {
    title: "What Studio Publisher accesses",
    body: (
      <>
        With my permission, Studio Publisher uses the YouTube Data API and the
        Meta Graph API to upload videos, set titles, descriptions and
        visibility, and read basic channel and account details (name and ID).
        It only acts on accounts I own or manage.
      </>
    ),
  },
  {
    title: "How data is stored",
    body: (
      <>
        Access tokens and an upload log are stored only on my own computer.
        Nothing is sent to any server of mine, sold or shared with third
        parties. Data goes only to Google (YouTube) and Meta (Instagram,
        Facebook), the services it uploads to.
      </>
    ),
  },
  {
    title: "Google API Services",
    body: (
      <>
        Studio Publisher&apos;s use of information received from Google APIs
        adheres to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          className="link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. It also uses YouTube API
        Services, so the{" "}
        <a
          href="https://policies.google.com/privacy"
          className="link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Privacy Policy
        </a>{" "}
        applies.
      </>
    ),
  },
  {
    title: "Revoking access",
    body: (
      <>
        Access can be removed at any time from{" "}
        <a
          href="https://myaccount.google.com/permissions"
          className="link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google account permissions
        </a>{" "}
        or Facebook Settings → Business integrations. Deleting the local token
        files also removes access.
      </>
    ),
  },
  {
    title: "Website",
    body: (
      <>
        developer-ayush.com may use basic analytics to count visits. The
        contact form sends your message to me by email and is used only to
        reply to you.
      </>
    ),
  },
  {
    title: "Contact",
    body: (
      <>
        Questions:{" "}
        <a href="mailto:developerr.ayush@gmail.com" className="link-underline">
          developerr.ayush@gmail.com
        </a>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-x max-w-3xl pb-24 pt-12 sm:pt-16">
      <Link
        href="/"
        className="link-underline inline-flex items-center gap-2 text-sm"
      >
        <FiArrowLeft aria-hidden="true" /> Back to home
      </Link>

      <h1 className="display mt-10 text-6xl sm:text-7xl">
        Privacy <em className="text-accent">policy</em>
      </h1>
      <p className="mt-4 font-mono text-xs text-muted">
        Last updated 21 October 2026
      </p>

      <div className="mt-12 border-t border-line">
        {sections.map((s) => (
          <section key={s.title} className="border-b border-line py-8">
            <h2 className="display text-3xl">{s.title}</h2>
            <p className="mt-3 text-lg text-muted">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
