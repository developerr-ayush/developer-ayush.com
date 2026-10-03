import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import BlogSection from "./components/BlogSection";
import JsonLd from "./components/JsonLd";
import { getBlogPosts } from "./blogData";
import {
  experienceData,
  personalInfo,
  projects,
  SITE_URL,
  skillGroups,
  socialLinks,
} from "./data";
import profileImage from "./assets/img/personal/ayush-shah.png";

export default async function Home() {
  const blogData = await getBlogPosts(1);
  const blogPosts = blogData.data || [];

  const currentJob = experienceData[0];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: SITE_URL,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: personalInfo.name,
      url: SITE_URL,
      image: `${SITE_URL}${profileImage.src}`,
      description: personalInfo.tagline,
      jobTitle: personalInfo.title,
      email: `mailto:${personalInfo.email}`,
      worksFor: currentJob
        ? { "@type": "Organization", name: currentJob.company }
        : undefined,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      knowsAbout: skillGroups
        .filter((g) => g.title !== "Tools")
        .flatMap((g) => g.items),
      sameAs: socialLinks.map((link) => link.url),
      owns: projects
        .filter((p) => p.github || p.live)
        .slice(0, 3)
        .map((p) => ({
          "@type": "SoftwareSourceCode",
          name: p.title,
          description: p.description,
          codeRepository: p.github,
          url: p.live ?? p.github,
        })),
    },
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <Hero />
      <Portfolio />
      <Experience />
      <Skills />
      <About />
      <BlogSection posts={blogPosts} />
      <Contact />
    </>
  );
}
