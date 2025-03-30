"use client";

import { motion } from "framer-motion";
import { services } from "../data";

export default function Services() {
  return (
    <section id="services" className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Services</h2>
          <div className="w-16 h-1 bg-gradient mx-auto mb-6"></div>
          <p className="text-foreground/80">
            Specialized services that I offer to help businesses create
            exceptional web experiences
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface border border-border rounded-lg p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-4">{service.title}</h3>

              <p className="text-foreground/70">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
