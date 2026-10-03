type SectionHeaderProps = {
  index: string;
  label: string;
  id: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
};

/** Numbered editorial section heading: "01 — Work" + large serif title. */
export default function SectionHeader({
  index,
  label,
  id,
  children,
  aside,
}: SectionHeaderProps) {
  return (
    <div className="grid gap-4 border-t border-line pt-6 md:grid-cols-12 md:gap-6">
      <p className="eyebrow md:col-span-3 md:pt-3">
        <span className="text-accent">{index}</span> — {label}
      </p>
      <div className="flex flex-col gap-4 md:col-span-9 md:flex-row md:items-end md:justify-between">
        <h2
          id={id}
          className="display text-[2.75rem] sm:text-6xl lg:text-7xl [&_em]:text-accent"
        >
          {children}
        </h2>
        {aside}
      </div>
    </div>
  );
}
