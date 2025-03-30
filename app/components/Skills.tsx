"use client";

import { motion } from "framer-motion";
import { skillsData } from "../data";

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-b from-transparent to-foreground/5 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute left-0 top-0 w-full h-1/2 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider font-semibold">
            My Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Technical Expertise
          </h2>
          <p className="text-foreground/75 max-w-2xl mx-auto">
            I've worked with a variety of technologies and frameworks to create
            responsive and modern web applications.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {skillsData.map((skill, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-foreground/5 to-foreground/10 mb-4 group-hover:from-sky-500/20 group-hover:to-sky-500/10 transition-all">
                <skill.icon
                  className="w-8 h-8"
                  style={{ color: skill.color }}
                />
              </div>
              <h3 className="font-medium text-center group-hover:text-sky-500 transition-colors">
                {skill.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Technical proficiency chart */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div>
            <h3 className="text-xl font-bold mb-6">Frontend Development</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">HTML5 & CSS3</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">JavaScript & TypeScript</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">React & Next.js</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">SCSS & Tailwind</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Backend Development</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Node.js</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
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
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">MongoDB</span>
                  <span>80%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Git & DevOps</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
