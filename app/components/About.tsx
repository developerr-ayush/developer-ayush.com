"use client";

import { motion } from "framer-motion";
import { skills, techStack } from "../data";

export default function About() {
  return (
    <section id="about" className="py-20 bg-surface">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-16 h-1 bg-gradient mx-auto mb-6"></div>
          <p className="text-foreground/80">
            I'm a passionate UI/UX and Front-End Developer with expertise in
            building modern web applications. I specialize in creating
            responsive, accessible, and visually appealing websites that deliver
            exceptional user experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">My Skills</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-3">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background rounded-full text-sm border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background rounded-full text-sm border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Tools & Libraries</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-background rounded-full text-sm border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Other Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {[...skills.languages, ...skills.accessibility].map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-background rounded-full text-sm border border-border"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6">Tech Stack</h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-border"
                  >
                    <Icon
                      className="text-4xl mb-2"
                      style={{ color: tech.color }}
                    />
                    <span className="text-sm text-center">{tech.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
