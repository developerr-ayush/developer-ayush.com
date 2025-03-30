"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "../data";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaLinkedin,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitResult({
        success: true,
        message: "Thank you for your message! I'll get back to you soon.",
      });

      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitResult(null);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 bg-surface">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-16 h-1 bg-gradient mx-auto mb-6"></div>
          <p className="text-foreground/80">
            Have a project in mind or just want to say hello? Feel free to reach
            out!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-background p-6 rounded-lg border border-border"
          >
            <h3 className="text-xl font-bold mb-6">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground/60 mb-1">
                    Email
                  </h4>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FaPhoneAlt className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground/60 mb-1">
                    Phone
                  </h4>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FaGlobe className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground/60 mb-1">
                    Website
                  </h4>
                  <a
                    href={personalInfo.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {personalInfo.portfolio.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 bg-background p-6 rounded-lg border border-border"
          >
            <h3 className="text-xl font-bold mb-6">Send A Message</h3>

            {submitResult && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  submitResult.success
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitResult.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient text-white rounded-full font-medium inline-flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
