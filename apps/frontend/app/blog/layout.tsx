// Metadata lives on each blog page (list + post) so it can be page-specific.
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
