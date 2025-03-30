"use client";

import { motion } from "framer-motion";
import { portfolioData } from "../data";
import Image from "next/image";
import { useState } from "react";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", name: "All" },
    { id: "React", name: "React" },
    { id: "HTML5", name: "HTML/CSS" },
    { id: "JavaScript", name: "JavaScript" },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? portfolioData
      : portfolioData.filter((project) =>
          project.skillsUsed.includes(activeFilter)
        );

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-foreground/[0.02]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            My <span className="text-sky-500">Portfolio</span>
          </h2>
          <div className="mt-4 h-1 w-16 bg-sky-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="flex justify-center mb-10 space-x-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all m-1 ${
                activeFilter === filter.id
                  ? "bg-sky-500 text-white"
                  : "bg-foreground/5 hover:bg-foreground/10"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-foreground/5 rounded-lg group overflow-hidden border border-foreground/10 hover:shadow-lg transition-all group"
            >
              <div className="aspect-video relative overflow-hidden">
                {/* <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div> */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top group-hover:object-bottom transition-all duration-[5s]  group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="mt-2 text-foreground/70 line-clamp-3">
                  {project.detail}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.skillsUsed.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-500"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skillsUsed.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-foreground/10 text-foreground/70">
                      +{project.skillsUsed.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <a
                    href={project.redirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-sm bg-sky-500 text-white hover:bg-sky-600 transition-colors inline-flex items-center"
                  >
                    View Project
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
