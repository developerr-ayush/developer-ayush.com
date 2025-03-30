"use client";

import { motion } from "framer-motion";
import { experience } from "../data";

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Work Experience
          </h2>
          <div className="w-16 h-1 bg-gradient mx-auto mb-6"></div>
          <p className="text-foreground/80">
            My professional journey in web development and UI/UX design
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {experience.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 mb-12 last:mb-0"
            >
              {/* Timeline dot and line */}
              <div className="absolute left-0 top-0 h-full">
                <div className="w-4 h-4 rounded-full bg-gradient absolute top-1.5 left-0 z-10"></div>
                {index !== experience.length - 1 && (
                  <div className="w-0.5 h-full bg-border/60 absolute top-6 left-[7px]"></div>
                )}
              </div>

              <div className="bg-surface border border-border rounded-lg p-6 card-hover">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{job.position}</h3>
                  <span className="text-primary text-sm font-medium mt-1 sm:mt-0">
                    {job.period}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="font-medium">{job.company}</span>
                  <span className="w-1 h-1 bg-foreground/40 rounded-full"></span>
                  <span className="text-foreground/70">{job.location}</span>
                </div>

                <ul className="space-y-2 text-foreground/80">
                  {job.responsibilities.map((responsibility, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary min-w-[24px]">•</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
