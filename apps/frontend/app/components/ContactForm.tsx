"use client";

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "");
  }, []);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !form.current) return;

    setIsSubmitting(true);
    setError("");

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        form.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
        }
      );

      // Form successfully submitted
      setSubmitted(true);
      form.current.reset();
    } catch (error) {
      setError("Failed to send message. Please try again later.");
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-line bg-paper p-6 outline-none"
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-on-accent"
        >
          <FiCheck />
        </span>
        <p className="display mt-4 text-3xl">Message sent.</p>
        <p className="mt-2 text-muted">
          Thanks for getting in touch. I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn btn-ghost mt-6"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={form}
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Your name
          </label>
          <input
            type="text"
            id="name"
            name="user_name"
            autoComplete="name"
            className="field"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Your email
          </label>
          <input
            type="email"
            id="email"
            name="user_email"
            autoComplete="email"
            className="field"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="field"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="field resize-y"
          required
        ></textarea>
      </div>

      <div aria-live="assertive">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-accent/40 px-4 py-3 text-sm text-accent"
          >
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Sending…
          </>
        ) : (
          <>
            Send message
            <FiArrowRight aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
