import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-serif text-[2rem] leading-tight">Nothing here</h1>
      <p className="mt-2 text-sm text-muted">That record doesn&apos;t exist, or it was deleted.</p>
      <Link href="/admin" className="btn btn-primary mt-6">
        Back to dashboard
      </Link>
    </div>
  );
}
