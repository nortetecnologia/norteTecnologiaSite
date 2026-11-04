export default function AdminRelatoriosPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Relatórios</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Indicadores de desempenho e métricas da loja.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd600]/10 text-[#ffd600] text-xs font-medium border border-[#ffd600]/20">
          Em desenvolvimento
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Produtos mais visualizados",
          "Categorias mais acessadas",
          "Termos mais pesquisados",
          "Cliques para o WhatsApp",
          "Vitrines com mais interações",
          "Produtos adicionados ao carrinho",
        ].map((metric) => (
          <div key={metric} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="h-8 w-24 bg-[#2a2a2a] rounded animate-pulse mb-3" />
            <p className="text-[#6b7280] text-sm">{metric}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-6 text-center">
        <p className="text-[#4b5563] text-sm">
          Os relatórios serão habilitados conforme os eventos do sistema forem registrados.
        </p>
      </div>
    </div>
  );
}
