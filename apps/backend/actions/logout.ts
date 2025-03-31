import { redirect } from "next/navigation";
import { auth } from "../auth";

export async function logout() {
  "use server";

  // Get the user's session
  const session = await auth();

  if (session) {
    // Invalidate the session on the server
    await fetch("/api/auth/signout", { method: "POST" });
  }

  // Redirect to login page
  redirect("/admin/login");
}
