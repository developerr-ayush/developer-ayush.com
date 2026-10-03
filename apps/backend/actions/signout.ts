"use server";

import { signOut } from "../auth";

/** Ends the session and sends the user back to /login. */
export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
