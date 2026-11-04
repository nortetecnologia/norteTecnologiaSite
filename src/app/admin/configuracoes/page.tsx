import { getStoreSettings } from "@/lib/store-settings";
import { ConfiguracoesForm } from "./ConfiguracoesForm";

export default async function AdminConfiguracoesPage() {
  const settings = await getStoreSettings();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">Configurações</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Ajuste as informações gerais da loja.
        </p>
      </div>

      <ConfiguracoesForm initialData={settings} />
    </div>
  );
}
