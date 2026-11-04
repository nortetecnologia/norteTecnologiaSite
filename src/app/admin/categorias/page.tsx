export default function AdminCategoriasPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Categorias</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Organize as categorias e subcategorias dos produtos.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd600]/10 text-[#ffd600] text-xs font-medium border border-[#ffd600]/20">
          Em desenvolvimento
        </span>
      </div>

      <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-12 text-center">
        <div className="mx-auto w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </div>
        <h2 className="text-white font-medium mb-2">Nenhuma categoria cadastrada</h2>
        <p className="text-[#6b7280] text-sm max-w-sm mx-auto">
          O gerenciamento de categorias será habilitado após a configuração do banco de dados.
        </p>
      </div>
    </div>
  );
}
