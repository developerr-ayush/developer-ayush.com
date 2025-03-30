"use client";

import { motion } from "framer-motion";
import { experienceData, educationData } from "../data";

const ExperienceItem = ({
  item,
  index,
  isLast = false,
}: {
  item: any;
  index: number;
  isLast?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative pl-8 pb-8"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-3 top-7 h-full w-0.5 bg-sky-200 dark:bg-sky-900/30"></div>
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-sky-500 bg-background flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-sky-500"></div>
      </div>

      <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 shadow-sm">
        <h3 className="text-xl font-bold">{item.position}</h3>
        <div className="flex items-center gap-2 mt-1 mb-4">
          <span className="text-sky-500 font-medium">{item.from}</span>
          <span className="text-xs text-foreground/50">•</span>
          <span className="text-sm text-foreground/60">{item.date}</span>
        </div>
        <p className="text-foreground/70">{item.para}</p>

        {item.details && item.details.length > 0 && (
          <ul className="mt-4 space-y-2">
            {item.details.map((detail: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="text-sky-500 mr-2">•</span>
                <span className="text-sm text-foreground/70">{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24 bg-foreground/[0.02]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Experience & <span className="text-sky-500">Education</span>
          </h2>
          <div className="mt-4 h-1 w-16 bg-sky-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2 text-sky-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                />
              </svg>
              Work Experience
            </h3>
            <div className="space-y-0">
              {experienceData.map((item, index) => (
                <ExperienceItem
                  key={item.id}
                  item={item}
                  index={index}
                  isLast={index === experienceData.length - 1}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2 text-sky-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                />
              </svg>
              Education
            </h3>
            <div className="space-y-0">
              {educationData.map((item, index) => (
                <ExperienceItem
                  key={item.id}
                  item={item}
                  index={index}
                  isLast={index === educationData.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
