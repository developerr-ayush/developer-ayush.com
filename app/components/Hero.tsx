"use client";

import { motion } from "framer-motion";
import { personalInfo } from "../data";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
} from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";

export default function Hero() {
  return (
    <section className="min-h-screen pt-28 pb-16 md:pt-32 md:pb-20 flex items-center">
      <div className="container px-4 mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg md:text-xl font-medium text-primary mb-4">
              Hello, I'm
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient">
              {personalInfo.name}
            </h1>
            <h3 className="text-xl md:text-2xl font-medium mb-6">
              {personalInfo.title}
            </h3>
            <p className="text-foreground/80 text-base md:text-lg max-w-xl mb-8">
              {personalInfo.summary}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full hover:border-primary transition-colors"
              >
                <FaGithub className="text-lg" />
                <span>GitHub</span>
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full hover:border-primary transition-colors"
              >
                <FaLinkedin className="text-lg" />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full hover:border-primary transition-colors"
              >
                <FaEnvelope className="text-lg" />
                <span>Email</span>
              </a>
              <a
                href={`tel:${personalInfo.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full hover:border-primary transition-colors"
              >
                <FaPhoneAlt className="text-lg" />
                <span>Call</span>
              </a>
            </div>

            <div className="flex gap-4">
              <a
                href="#projects"
                className="px-6 py-3 bg-gradient text-white rounded-full text-base font-medium hover:opacity-90 transition-opacity"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-surface border border-border text-foreground rounded-full text-base font-medium hover:border-primary transition-colors"
              >
                Contact Me
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 p-2 backdrop-blur-sm">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-9xl text-gradient font-bold">
                  AS
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-12 h-12 bg-surface rounded-full flex items-center justify-center border border-border animate-float">
                <FaReact className="text-3xl text-primary" />
              </div>

              <div
                className="absolute -bottom-2 -left-4 w-10 h-10 bg-surface rounded-full flex items-center justify-center border border-border animate-float"
                style={{ animationDelay: "1s" }}
              >
                <SiNextdotjs className="text-2xl text-foreground" />
              </div>

              <div
                className="absolute top-1/4 -right-6 w-14 h-14 bg-surface rounded-full flex items-center justify-center border border-border animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <SiTailwindcss className="text-3xl text-[#38b2ac]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
