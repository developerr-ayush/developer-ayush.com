import type { StaticImageData } from "next/image";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Project screenshots
import typefaceHubImage from "./assets/img/work/typeface-hub.jpg";
import financeCalcImage from "./assets/img/work/financecalc.jpg";
import tradebattleImage from "./assets/img/work/tradebattle.jpeg";
import schoolvrImage from "./assets/img/work/schoolvr.jpeg";
import aonixv2Image from "./assets/img/work/aonixv2.jpeg";
import datavivImage from "./assets/img/work/dataviv.jpg";

export const SITE_URL = "https://developer-ayush.com";

// Personal info
export const personalInfo = {
  name: "Ayush Shah",
  title: "Frontend Engineer",
  role: "Frontend Engineer · Associate Manager",
  tagline:
    "I build fast, accessible React and Next.js products for platforms that reach millions of people.",
  location: "Mumbai, India",
  phone: "+91 90498 77048",
  email: "developerr.ayush@gmail.com",
  github: "https://github.com/developerr-ayush",
  website: SITE_URL,
  linkedin: "https://linkedin.com/in/developerr-ayush",
  resumePdf: "/resume.pdf",
  resumeDocx: "/Ayush_Shah_Resume.docx",
};

export const stats = [
  { value: "5", label: "years shipping production frontends" },
  { value: "50+", label: "production web apps shipped" },
  { value: "10M+", label: "users on platforms I build for" },
  { value: "40+", label: "pages taken to 90+ accessibility scores" },
];

// Experience
export type Experience = {
  company: string;
  position: string;
  period: string;
  start: string;
  location: string;
  summary: string;
  highlights: string[];
};

export const experienceData: Experience[] = [
  {
    company: "Sportz Interactive",
    position: "Frontend Engineer · Associate Manager",
    period: "Nov 2022 — Present",
    start: "2022",
    location: "Mumbai, India",
    summary:
      "I lead frontend delivery for sports platforms that reach 10M+ users, including WPL, ISL and Gujarat Titans.",
    highlights: [
      "Led 7 major projects from concept to launch, owning timelines and client communication, with zero missed launches.",
      "Shipped 50+ production web apps in React, Next.js and Nuxt, and cut page load time by 40%.",
      "Took 40+ pages to 90+ WCAG accessibility scores; some high-traffic pages reach 100 in Lighthouse accessibility.",
      "Designed and built a secure authentication system for 51,000+ users.",
      "Own architecture and delivery for a server-driven UI platform (admin, renderer, CMS and OIDC layers) that lets apps ship new screens without app-store releases. Frontend in TypeScript, Zustand and TanStack Query with Jest coverage; I also work on its Fastify and PostgreSQL backend.",
      "Brought AI-assisted workflows (Copilot, Cursor) to the team, cutting development cycle time by 60%. I mentor a team of 5 developers.",
      "Won 2nd place at an internal hackathon with a cricket-themed Snake & Ladder game built in 2 days.",
    ],
  },
  {
    company: "DataViv Technologies",
    position: "Frontend Developer",
    period: "Jul 2021 — Oct 2022",
    start: "2021",
    location: "Mumbai, India",
    summary:
      "Started as an intern and grew into building client-facing web apps end to end.",
    highlights: [
      "Built 20+ client-facing web applications with secure API integrations and cross-device support.",
      "Designed a real-time analytics dashboard with Chart.js, connected to backend services for live data.",
      "Worked with backend engineers on 50+ projects to reduce API latency and improve SEO and accessibility.",
    ],
  },
];

// Education & certifications
export const educationData = [
  {
    title: "Bachelor of Computer Applications",
    school: "Amity University (Distance Learning)",
    period: "2023 — 2025",
  },
  {
    title: "Full Stack Web Development",
    school: "Apna College",
    period: "2022",
  },
  {
    title: "JavaScript Mastery",
    school: "Certification",
    period: "2021",
  },
];

// Skills
export const skillGroups = [
  {
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Node.js"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Nuxt", "Tailwind CSS", "GSAP", "Framer Motion"],
  },
  {
    title: "State & testing",
    items: ["Zustand", "TanStack Query", "Jest"],
  },
  {
    title: "Backend & data",
    items: [
      "Express",
      "Fastify",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "AWS",
    ],
  },
  {
    title: "Tools",
    items: ["Git", "Figma", "Postman", "VS Code", "GitHub Copilot", "Cursor"],
  },
  {
    title: "Focus",
    items: [
      "Performance",
      "Accessibility (WCAG)",
      "Full-stack ownership",
      "API integration",
      "Mentoring",
    ],
  },
];

// Selected work
export type Project = {
  slug: string;
  title: string;
  kind: string;
  year?: string;
  description: string;
  highlights?: string[];
  stack: string[];
  image?: StaticImageData;
  imageAlt?: string;
  live?: string;
  github?: string;
};

export const projects: Project[] = [
  {
    slug: "typeface-hub",
    title: "Typeface Hub",
    kind: "Font management & delivery platform",
    year: "2026",
    description:
      "Add a font once and every site, app and editor gets optimised files, generated CSS and only the weights each page needs. Upload or pick a font, and the platform validates, converts, subsets and catalogues it, then a Google-style CSS API serves exactly what each page renders.",
    highlights: [
      "Pipeline converts TTF / OTF to WOFF2 + WOFF, splits unicode-range subsets and builds metric-matched fallback faces to reduce layout shift.",
      "Free web font converter: test variable axes live, limit or pin them, and download a ready-made kit. No account needed.",
      "Fontello-style icon font generator with 11,000+ icons from 16 open-source sets, plus your own SVGs.",
      "Versioned families with draft, publish and rollback, roles, API keys and an audit log.",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "Vercel Blob",
      "HarfBuzz",
    ],
    image: typefaceHubImage,
    imageAlt:
      "Typeface Hub landing page: “Add a font once. Ship only what each page renders.” next to a code sample of its CSS API",
    github: "https://github.com/developerr-ayush/Typeface-Hub",
  },
  {
    slug: "developer-ayush-cms",
    title: "developer-ayush.com + CMS",
    kind: "Portfolio, blog & headless CMS",
    year: "2024",
    description:
      "This site and the admin app behind it, in one Turborepo. The CMS has an Editor.js writing experience, Auth.js login with roles, Cloudinary image uploads and AI-assisted drafting, and it serves the blog API this site reads.",
    stack: [
      "Next.js 15",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Auth.js",
      "Tailwind CSS",
      "Turborepo",
    ],
    live: `${SITE_URL}/blog`,
    github: "https://github.com/developerr-ayush/developer-ayush.com",
  },
  {
    slug: "financecalc",
    title: "FinanceCalc",
    kind: "Financial calculator suite",
    year: "2025",
    description:
      "SIP, step-up SIP, income tax (new regime) and inflation calculators with interactive charts, in a mobile-first dark UI. The SIP tools show growth as a chart or a year-by-year table.",
    stack: ["React", "Vite", "Tailwind CSS v4", "Chart.js", "React Router"],
    image: financeCalcImage,
    imageAlt:
      "FinanceCalc SIP calculator: input form on the left, investment growth chart on the right",
    github: "https://github.com/developerr-ayush/financial-calculators",
  },
  {
    slug: "tradebattle",
    title: "TradeBattle",
    kind: "Stock-market game website",
    description:
      "Marketing site for a game where players predict stock-market trends. Built in React with scroll-driven GSAP animations and a responsive layout.",
    stack: ["React", "GSAP", "SCSS"],
    image: tradebattleImage,
    imageAlt:
      "TradeBattle homepage with the headline “More than a battle, it’s a learning” between a bull and a bear",
    live: "https://tradebattle.win/",
  },
  {
    slug: "school-vr",
    title: "School VR",
    kind: "VR education website",
    description:
      "Website for a VR learning product, built in React with dynamic pages, small animations throughout and an EmailJS contact form.",
    stack: ["React", "SCSS", "EmailJS"],
    image: schoolvrImage,
    imageAlt: "School VR homepage with a gold VR headset logo",
    live: "https://schoolvr.netlify.app/",
  },
  {
    slug: "aonix",
    title: "Aonix",
    kind: "Product website",
    description:
      "Responsive React site built from reusable components, with carousel-based product animations driven by JSON data and an EmailJS contact form.",
    stack: ["React", "Swiper", "Context API", "SCSS", "EmailJS"],
    image: aonixv2Image,
    imageAlt: "Aonix homepage with the headline “Innovation for everyone”",
    live: "https://aonix-website.netlify.app/",
  },
  {
    slug: "dataviv",
    title: "DataViv Technologies",
    kind: "Company website",
    description:
      "Company website I designed and built, from the colour system to the animations used throughout the layout.",
    stack: ["HTML", "SCSS", "Bootstrap", "jQuery"],
    image: datavivImage,
    imageAlt:
      "DataViv Technologies homepage with the headline “Cutting edge automation for your business”",
    live: "https://dataviv-technologies.web.app/",
  },
];

// Earlier experiments and practice builds
export const archive: {
  title: string;
  note: string;
  live?: string;
  github?: string;
}[] = [
  {
    title: "Netflix landing page",
    note: "React clone focused on the video section",
    live: "https://ayush-web-notflix.netlify.app/",
    github: "https://github.com/developerr-ayush/netflix-clone",
  },
  {
    title: "Slack landing page",
    note: "React clone with a debounced, detailed navbar",
    live: "https://slack-clone-bg-ayush.netlify.app/",
    github: "https://github.com/developerr-ayush/slack-clone",
  },
  {
    title: "Greeting Globe",
    note: "Freelance team project; most of the UI logic",
    live: "https://greetingglobe-web.web.app/",
  },
  {
    title: "Data Web",
    note: "Layout replica with sticky navigation",
    live: "https://developerr-ayush.github.io/dataweb/",
    github: "https://github.com/developerr-ayush/dataweb",
  },
  {
    title: "Finexo",
    note: "Layout study in CSS animation",
    live: "https://developerr-ayush.github.io/finexo/",
    github: "https://github.com/developerr-ayush/finexo",
  },
  {
    title: "Cuvee",
    note: "Interview assignment, home page clone",
    live: "https://developerr-ayush.github.io/cuvee/",
    github: "https://github.com/developerr-ayush/cuvee",
  },
  {
    title: "Wanderon",
    note: "Interview assignment, loop-driven layout",
    live: "https://developerr-ayush.github.io/wanderon/",
    github: "https://github.com/developerr-ayush/wanderon",
  },
  {
    title: "Wireframe",
    note: "Interview assignment with Owl Carousel",
    live: "https://developerr-ayush.github.io/wireframe/",
    github: "https://github.com/developerr-ayush/wireframe",
  },
  {
    title: "Yoga",
    note: "Pure-CSS animated leaves",
    live: "https://developerr-ayush.github.io/yoga/",
    github: "https://github.com/developerr-ayush/yoga",
  },
  {
    title: "Aonix v1",
    note: "First version of the Aonix site",
    live: "https://aonix-project.netlify.app/",
  },
];

// Social media links
export const socialLinks: { name: string; handle: string; url: string; icon: IconType }[] = [
  {
    name: "GitHub",
    handle: "developerr-ayush",
    url: "https://github.com/developerr-ayush",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    handle: "in/developerr-ayush",
    url: "https://linkedin.com/in/developerr-ayush",
    icon: FaLinkedin,
  },
  {
    name: "X (Twitter)",
    handle: "@developerrayush",
    url: "https://x.com/developerrayush",
    icon: FaXTwitter,
  },
  {
    name: "YouTube",
    handle: "Ayush Shah",
    url: "https://youtube.com/ayushshah",
    icon: FaYoutube,
  },
];
