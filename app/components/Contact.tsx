"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { personalInfo, socialLinks } from "../data";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Simulating form submission - in real app you would submit to a backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-sky-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider font-semibold">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Contact Me
          </h2>
          <p className="text-foreground/75 max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg h-fit">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500/10 text-sky-500 mr-4">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-foreground/70">Mumbai, India</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500/10 text-sky-500 mr-4">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-foreground/70 hover:text-sky-500 transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500/10 text-sky-500 mr-4">
                  <FaPhone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone</h4>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-foreground/70 hover:text-sky-500 transition-colors"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
            </div>

            <h4 className="font-medium mb-4">Connect with me</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground/10 hover:bg-foreground/15 p-3 rounded-full transition-all transform hover:-translate-y-1 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-sky-500 group-hover:text-sky-400" />
                </a>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 rounded-xl overflow-hidden h-[200px] bg-foreground/5 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-foreground/40 text-sm">
                  Map will be displayed here
                </span>
              </div>
              {/* You can replace with an actual map if you have the implementation */}
              {/* <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995597222!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1662285219930!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe> */}
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

            {submitted ? (
              <div className="p-6 bg-sky-500/10 rounded-xl border border-sky-500/20 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-sky-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                <p className="text-foreground/70 mb-4">
                  Thank you for contacting me. I'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2 rounded-full transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
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
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                {error && (
                  <div className="text-red-500 text-sm py-2 px-4 bg-red-500/10 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white font-medium px-6 py-3 rounded-full transition-colors flex items-center justify-center w-full md:w-auto disabled:cursor-not-allowed"
                  disabled={isSubmitting}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
