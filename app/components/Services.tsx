"use client";

import { motion } from "framer-motion";
import { servicesData } from "../data";
import {
  FaCode,
  FaRocket,
  FaPalette,
  FaPaintBrush,
  FaMoon,
  FaMobile,
} from "react-icons/fa";

const Services = () => {
  // Icons for services
  const serviceIcons = [
    FaCode, // Website Creation
    FaRocket, // Optimization
    FaPalette, // Component-Based Approach
    FaPaintBrush, // Color Theming
    FaMoon, // Dark Mode
    FaMobile, // Responsive Designs
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-sky-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider font-semibold">
            What I Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            My Services
          </h2>
          <p className="text-foreground/75 max-w-2xl mx-auto">
            I provide a range of services to help you build and optimize your
            web presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesData.map((service, index) => {
            const ServiceIcon = serviceIcons[index];

            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg transform transition-all hover:-translate-y-2 hover:shadow-sky-500/10 overflow-hidden relative z-10"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>

                {/* Icon with gradient circle */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-purple-500/20 rounded-full blur-lg transform scale-75 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500/20 to-sky-500/5 relative z-10">
                    <ServiceIcon className="w-7 h-7 text-sky-500" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-sky-500 transition-colors">
                  {service.heading}
                </h3>

                <p className="text-foreground/70">{service.paragraph}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
