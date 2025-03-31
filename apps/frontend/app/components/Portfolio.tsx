"use client";

import { portfolioData } from "../data";
import Image from "next/image";
import { useState, useEffect } from "react";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(portfolioData);
  const [visibleProjects, setVisibleProjects] = useState(6);


  // Most common skills for filter buttons
  const popularSkills = ["React", "JavaScript", "HTML5", "SCSS", "CSS3"];

  // Filter projects based on selected skill
  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredProjects(portfolioData);
    } else {
      const filtered = portfolioData.filter((project) =>
        project.skillsUsed.includes(activeFilter)
      );
      setFilteredProjects(filtered);
    }
    setVisibleProjects(6); // Reset visible count when filter changes
  }, [activeFilter]);

  const loadMore = () => {
    setVisibleProjects((prev) => Math.min(prev + 6, filteredProjects.length));
  };

  return (
    <section id="portfolio" className="py-20 bg-black/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider font-semibold">
            Recent Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            My Portfolio
          </h2>
          <p className="text-foreground/75 max-w-2xl mx-auto">
            Check out some of my latest projects. Each project represents a
            unique challenge I&apos;ve tackled using various technologies.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === "All"
                ? "bg-sky-500 text-white"
                : "bg-sky-500/10 text-sky-500 hover:bg-sky-500/20"
            }`}
            onClick={() => setActiveFilter("All")}
          >
            All Projects
          </button>

          {popularSkills.map((skill) => (
            <button
              key={skill}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === skill
                  ? "bg-sky-500 text-white"
                  : "bg-sky-500/10 text-sky-500 hover:bg-sky-500/20"
              }`}
              onClick={() => setActiveFilter(skill)}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.slice(0, visibleProjects).map((project, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl overflow-hidden shadow-xl hover:shadow-sky-500/10 transition-all hover:-translate-y-1 hover:bg-white/10 group"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity" />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.skillsUsed.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-500"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skillsUsed.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-sky-500/5 text-sky-500/80">
                      +{project.skillsUsed.length - 3}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-foreground/70 mb-4 line-clamp-3">
                  {project.detail}
                </p>
                <a
                  href={project.redirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sky-500 hover:text-sky-400 transition-colors"
                >
                  View Project
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Load More button */}
        {visibleProjects < filteredProjects.length && (
          <div className="text-center mt-10">
            <button
              onClick={loadMore}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Load More Projects
            </button>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/70">
              No projects found with the selected filter. Try another category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
