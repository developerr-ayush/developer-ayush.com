"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { personalInfo, socialLinks } from "../data";

const Hero = () => {
  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <div className="flex items-center space-x-2">
              <div className="h-px w-12 bg-sky-500"></div>
              <span className="text-sm font-medium">
                Welcome to my portfolio
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Hi, I'm{" "}
              <span className="text-sky-500">
                {personalInfo.name.split(" ")[0]}
              </span>
              <br />
              {personalInfo.title}
            </h1>

            <p className="text-lg text-foreground/70 max-w-md">
              A passionate developer specializing in creating exceptional
              digital experiences with modern web technologies.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="#contact"
                className="px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
              >
                Contact Me
              </Link>
              <Link
                href="#portfolio"
                className="px-6 py-3 rounded-full border border-foreground/20 font-medium hover:bg-foreground/5 transition-colors"
              >
                View Projects
              </Link>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-sky-500 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md aspect-square"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative bg-foreground/5 border border-foreground/10 rounded-full overflow-hidden w-full h-full flex items-center justify-center">
              {/* Profile image will be added here */}
              <div className="text-6xl font-bold text-sky-500/40">AS</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-sm text-foreground/60 mb-2">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1 bg-sky-500 rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
