import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";
import BlogSection from "./components/BlogSection";
import { getBlogPosts } from "./blogData";

export default async function Home() {
  const blogPosts = await getBlogPosts();

  return (
    <main>
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
