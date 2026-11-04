import { createClient } from "@/lib/supabase/server";

const quickLinks = [
  { href: "/admin/produtos", label: "Produtos", description: "Gerencie o catálogo de produtos" },
  { href: "/admin/categorias", label: "Categorias", description: "Organize as categorias" },
  { href: "/admin/vitrines", label: "Vitrines", description: "Configure as vitrines da loja" },
  { href: "/admin/configuracoes", label: "Configurações", description: "Ajuste as configurações do site" },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.email?.split("@")[0] ?? "Admin";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">
          Olá, {firstName}
        </h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Bem-vindo ao painel administrativo da Norte Tecnologia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#ffd600]/40 hover:bg-[#1f1f1f] transition-all group"
          >
            <h2 className="text-white font-medium text-base group-hover:text-[#ffd600] transition-colors">
              {link.label}
            </h2>
            <p className="text-[#6b7280] text-sm mt-1">{link.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
