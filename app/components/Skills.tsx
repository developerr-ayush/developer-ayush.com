"use client";

import { motion } from "framer-motion";
import { skillsData } from "../data";

const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            My <span className="text-sky-500">Skills</span>
          </h2>
          <div className="mt-4 h-1 w-16 bg-sky-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {skillsData.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all hover:border-sky-200 dark:hover:border-sky-900/50"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ color: skill.color || "#718096" }}
              >
                <skill.icon className="w-8 h-8" />
              </div>
              <h3 className="font-medium text-center">{skill.title}</h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-foreground/5 rounded-lg p-6 md:p-8 border border-foreground/10"
          >
            <h3 className="text-xl font-bold mb-4">Frontend Development</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">HTML & CSS</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">JavaScript</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">React</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Next.js</span>
                  <span>80%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-foreground/5 rounded-lg p-6 md:p-8 border border-foreground/10"
          >
            <h3 className="text-xl font-bold mb-4">Backend Development</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Node.js</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Express</span>
                  <span>70%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">MongoDB</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">SQL & Prisma</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
