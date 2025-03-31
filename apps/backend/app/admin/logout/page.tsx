"use server";
import { redirect } from "next/navigation";
import { logout } from "../../../actions/logout";

export default async function page() {
  await logout();
  redirect("/admin/login");
}
