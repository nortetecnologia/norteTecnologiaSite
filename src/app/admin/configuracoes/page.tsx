export default function AdminConfiguracoesPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Configurações</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Ajuste as configurações gerais da loja.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd600]/10 text-[#ffd600] text-xs font-medium border border-[#ffd600]/20">
          Em desenvolvimento
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Informações da Loja",
            description: "Nome, endereço, horário de funcionamento e dados institucionais.",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            ),
          },
          {
            title: "WhatsApp e Contato",
            description: "Número oficial do WhatsApp e demais canais de atendimento.",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            ),
          },
          {
            title: "Formas de Pagamento",
            description: "Modalidades de pagamento disponíveis para os clientes.",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            ),
          },
          {
            title: "Entrega e Retirada",
            description: "Modalidades de entrega, retirada e informações logísticas.",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            ),
          },
        ].map((item) => (
          <div key={item.title} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 opacity-60">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <h2 className="text-white font-medium text-sm mb-1">{item.title}</h2>
                <p className="text-[#6b7280] text-xs">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[#4b5563] text-xs text-center mt-6">
        As configurações serão habilitadas após a configuração do banco de dados.
      </p>
    </div>
  );
}
