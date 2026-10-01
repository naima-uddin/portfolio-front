import { redirect } from "next/navigation";

// The login form now lives at /naimaslogin — keep the old path working.
export default function AdminLoginRedirect() {
  redirect("/naimaslogin");
}
