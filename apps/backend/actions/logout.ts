import { signOut } from "../auth";

export async function logout() {
  "use server";
  await signOut({ redirectTo: "/admin/login" });
  return null;
}
