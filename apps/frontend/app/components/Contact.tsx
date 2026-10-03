import { personalInfo, socialLinks } from "../data";
import ContactForm from "./ContactForm";
import SectionHeader from "./SectionHeader";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="container-x py-20 lg:py-28"
    >
      <SectionHeader index="06" label="Contact" id="contact-title">
        Have a project or a <em>role</em> in mind?
      </SectionHeader>

      <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <p className="text-lg leading-relaxed text-muted">
            Email is quickest. The form goes to the same inbox.
          </p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="link-underline display break-all text-3xl sm:text-4xl"
                >
                  {personalInfo.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Based in</dt>
              <dd className="mt-1">{personalInfo.location} · IST (UTC+5:30)</dd>
            </div>
            <div>
              <dt className="eyebrow">Elsewhere</dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                      >
                        <social.icon aria-hidden="true" />
                        {social.name}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="display text-3xl">Send a message</h3>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
