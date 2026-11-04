import { createClient } from "@/lib/supabase/server";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Sem usuário = página de login. Renderiza só o conteúdo, sem a shell admin.
    // O middleware já redireciona rotas protegidas para /admin/login quando necessário.
    if (!user) {
      return <>{children}</>;
    }

    return <AdminLayoutClient userEmail={user.email}>{children}</AdminLayoutClient>;
  } catch {
    // Se o Supabase falhar, renderiza o conteúdo sem a shell (fail-safe).
    return <>{children}</>;
  }
}
