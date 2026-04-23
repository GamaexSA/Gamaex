// Redirect automático a /dashboard si está autenticado, o a /login si no
import { redirect } from "next/navigation";

export default function AdminRoot() {
  redirect("/login");
}
