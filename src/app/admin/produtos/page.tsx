export default function AdminProdutosPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Produtos</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Gerencie o catálogo de produtos e serviços.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd600]/10 text-[#ffd600] text-xs font-medium border border-[#ffd600]/20">
          Em desenvolvimento
        </span>
      </div>

      <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-12 text-center">
        <div className="mx-auto w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h2 className="text-white font-medium mb-2">Nenhum produto cadastrado</h2>
        <p className="text-[#6b7280] text-sm max-w-sm mx-auto">
          O gerenciamento de produtos será habilitado após a configuração do banco de dados.
        </p>
      </div>
    </div>
  );
}
