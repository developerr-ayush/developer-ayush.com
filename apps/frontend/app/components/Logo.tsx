import {
  LOGO_INK_PATH,
  LOGO_RED,
  LOGO_RED_PATH,
  LOGO_VIEWBOX,
} from "../../lib/logo";

/** The <AS> mark. Decorative by default; label the surrounding link. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path fill="currentColor" d={LOGO_INK_PATH} />
      <path fill={LOGO_RED} d={LOGO_RED_PATH} />
    </svg>
  );
}
