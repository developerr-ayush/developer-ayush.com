import Link from "next/link";

type ErrorStateProps = {
  eyebrow: string;
  title: React.ReactNode;
  message: string;
  action?: React.ReactNode;
  backHref: string;
  backLabel: string;
  headingLevel?: "h1" | "h2";
};

/** Shared layout for 404 and error boundaries. */
export default function ErrorState({
  eyebrow,
  title,
  message,
  action,
  backHref,
  backLabel,
  headingLevel = "h1",
}: ErrorStateProps) {
  const Heading = headingLevel;
  return (
    <div className="container-x flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow">
        <span className="text-accent">{eyebrow}</span>
      </p>
      <Heading className="display mt-4 max-w-3xl text-6xl sm:text-7xl [&_em]:text-accent">
        {title}
      </Heading>
      <p className="mt-6 max-w-xl text-lg text-muted">{message}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        {action}
        <Link href={backHref} className="btn btn-ghost">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
