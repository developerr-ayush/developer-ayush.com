import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";
import BlogSection from "./components/BlogSection";
import { getBlogPosts } from "./blogData";
import { personalInfo, socialLinks } from "./data";
import Script from "next/script";

export default async function Home() {
  const blogData = await getBlogPosts(1);
  const blogPosts = blogData.data || [];

  // Prepare structured data for JSON-LD
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: personalInfo.name,
      alternateName: "UI/UX Developer",
      description:
        "UI/UX & Frontend Developer specializing in creating responsive, user-friendly web experiences with modern technologies.",
      image: "/android-chrome-512x512.png",
      sameAs: socialLinks.map((link) => link.url),
      jobTitle: "UI/UX & Frontend Developer",
      worksFor: {
        "@type": "Organization",
        name: "Freelance",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "India",
      },
      email: personalInfo.email,
      telephone: personalInfo.phone,
      url: "https://developer-ayush.com",
    },
  };

  return (
    <main>
      {/* JSON-LD structured data */}
      {/* <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      /> */}

      <Hero />
      <About />
      <Experience />
      <Skills />
      <Portfolio />
      <Services />
      <BlogSection posts={blogPosts} />
      <Contact />
    </main>
  );
}
