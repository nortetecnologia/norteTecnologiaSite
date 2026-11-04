export default function AdminVitrinesPage() {
  const vitrineSlots = [
    {
      slug: "vitrine_principal",
      title: "Vitrine Principal",
      displayType: "Carrossel",
      description: "Exibida no topo da página inicial. Destaca os produtos em evidência.",
    },
    {
      slug: "vitrine_2",
      title: "Vitrine 2",
      displayType: "Grade",
      description: "Segunda seção da página inicial. Exibe produtos em grade.",
    },
    {
      slug: "vitrine_3",
      title: "Vitrine 3",
      displayType: "Grade",
      description: "Terceira seção da página inicial. Exibe produtos em grade.",
    },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Vitrines</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Configure as vitrines exibidas na página inicial da loja.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd600]/10 text-[#ffd600] text-xs font-medium border border-[#ffd600]/20">
          Em desenvolvimento
        </span>
      </div>

      <div className="space-y-4">
        {vitrineSlots.map((vitrine, index) => (
          <div
            key={vitrine.slug}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#6b7280] text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-medium text-sm">{vitrine.title}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-[#2a2a2a] text-[#9ca3af]">
                    {vitrine.displayType}
                  </span>
                </div>
                <p className="text-[#6b7280] text-xs">{vitrine.description}</p>
              </div>
            </div>
            <div className="text-[#4b5563] text-xs flex-shrink-0">
              Aguardando banco de dados
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-6 text-center">
        <p className="text-[#4b5563] text-sm">
          O gerenciamento completo das vitrines (adicionar produtos, definir ordem e ativar/desativar)
          será habilitado após a configuração do banco de dados no Supabase.
        </p>
      </div>
    </div>
  );
}
