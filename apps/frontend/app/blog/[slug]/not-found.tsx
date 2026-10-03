import ErrorState from "../../components/ErrorState";

export default function BlogNotFound() {
  return (
    <ErrorState
      eyebrow="404 — Post not found"
      title={
        <>
          This post has <em>moved</em> or never existed
        </>
      }
      message="Sorry, the blog post you are looking for doesn't exist or may have been moved."
      backHref="/blog"
      backLabel="Back to blog"
    />
  );
}
