"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { portfolioWorks } from "../data";

export default function Projects() {
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <section id="projects" className="py-20 bg-surface">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-16 h-1 bg-gradient mx-auto mb-6"></div>
          <p className="text-foreground/80">
            A collection of my recent work and notable projects. Click on any
            project to learn more.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioWorks.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg card-hover bg-background"
              onClick={() => setActiveProject(project.id)}
            >
              <div className="aspect-video overflow-hidden">
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  {/* This could be replaced with actual images when available */}
                  <span className="text-4xl font-bold text-gradient">
                    {project.title.substring(0, 2)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs py-1 px-2 bg-surface rounded-full border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs py-1 px-2 bg-surface rounded-full border border-border">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <p className="text-foreground/70 text-sm line-clamp-2 mb-4">
                  {project.description}
                </p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium text-sm inline-flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Project
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
            </motion.div>
          ))}
        </div>

        {/* Project Modal */}
        {activeProject && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const project = portfolioWorks.find(
                  (p) => p.id === activeProject
                );
                if (!project) return null;

                return (
                  <div>
                    <div className="aspect-video overflow-hidden">
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-6xl font-bold text-gradient">
                          {project.title.substring(0, 2)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold">{project.title}</h3>
                        <button
                          onClick={() => setActiveProject(null)}
                          className="p-1 text-foreground/60 hover:text-foreground transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-sm py-1 px-3 bg-surface rounded-full border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <p className="text-foreground/80 mb-6">
                        {project.description}
                      </p>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient text-white rounded-full font-medium"
                      >
                        Visit Project
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
