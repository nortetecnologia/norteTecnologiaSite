import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getStoreSettings } from "@/lib/store-settings";

export const metadata: Metadata = {
  title: "Política de Privacidade | Norte Tecnologia",
  description: "Política de privacidade e proteção de dados pessoais da Norte Tecnologia, em conformidade com a LGPD.",
};

export default async function PrivacidadePage() {
  const settings = await getStoreSettings();
  const storeName = settings.store_name || "Norte Tecnologia";
  const email = settings.email;
  const address = [settings.address, settings.city, settings.state_abbr].filter(Boolean).join(", ");
  const updated = "07 de novembro de 2026";

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-brand-gray-mid bg-brand-gray-dark px-4 py-3 lg:px-8">
          <div className="mx-auto max-w-content">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">Início</Link>
              <span>/</span>
              <span className="text-white">Política de Privacidade</span>
            </nav>
          </div>
        </div>

        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <div className="max-w-3xl space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white lg:text-3xl mb-2">Política de Privacidade</h1>
                <p className="text-sm text-gray-500">Última atualização: {updated}</p>
              </div>

              <div className="rounded-xl border border-brand-yellow/20 bg-brand-yellow/5 px-5 py-4 text-sm text-gray-300 leading-relaxed">
                Esta política descreve como a <strong className="text-white">{storeName}</strong> coleta, utiliza, armazena e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).
              </div>

              <Policy heading="1. Quem somos">
                <p>
                  <strong className="text-white">{storeName}</strong> é uma empresa especializada em produtos e serviços de informática, localizada em{" "}
                  {address ? <span>{address}</span> : <span>Rorainópolis — RR</span>}.
                  {email && (
                    <> Para entrar em contato conosco: <a href={`mailto:${email}`} className="text-brand-yellow hover:underline">{email}</a>.</>
                  )}
                </p>
              </Policy>

              <Policy heading="2. Dados que coletamos">
                <p>Coletamos dados pessoais somente quando necessário e nas seguintes situações:</p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                  <li><strong className="text-gray-300">Formulário de feedback:</strong> nome (opcional), e-mail (opcional) e mensagem.</li>
                  <li><strong className="text-gray-300">Avaliações de produtos:</strong> nome (opcional) e comentário.</li>
                  <li><strong className="text-gray-300">Finalização de pedido via WhatsApp:</strong> nome, telefone, endereço de entrega (quando aplicável) e itens do pedido — informados voluntariamente pelo cliente.</li>
                  <li><strong className="text-gray-300">Dados de navegação:</strong> registros técnicos como endereço IP, tipo de dispositivo e páginas acessadas, coletados automaticamente para fins de segurança e melhoria do serviço.</li>
                </ul>
              </Policy>

              <Policy heading="3. Finalidade do tratamento">
                <p>Os dados coletados são utilizados exclusivamente para:</p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                  <li>Responder a contatos e feedbacks enviados pelo cliente.</li>
                  <li>Exibir avaliações de produtos no site.</li>
                  <li>Processar e encaminhar pedidos de produtos ou solicitações de serviços.</li>
                  <li>Manter a segurança e o funcionamento da plataforma.</li>
                  <li>Cumprir obrigações legais e regulatórias.</li>
                </ul>
              </Policy>

              <Policy heading="4. Base legal">
                <p>O tratamento de dados pessoais pela {storeName} é fundamentado nas seguintes bases legais previstas na LGPD:</p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                  <li><strong className="text-gray-300">Consentimento (Art. 7º, I):</strong> para o envio de feedback e avaliações, quando o titular expressamente autoriza o tratamento.</li>
                  <li><strong className="text-gray-300">Execução de contrato (Art. 7º, V):</strong> quando os dados são necessários para processar um pedido ou solicitação de serviço.</li>
                  <li><strong className="text-gray-300">Legítimo interesse (Art. 7º, IX):</strong> para dados de navegação utilizados na segurança e melhoria do site.</li>
                </ul>
              </Policy>

              <Policy heading="5. Compartilhamento de dados">
                <p>
                  A {storeName} <strong className="text-white">não vende, aluga ou compartilha</strong> seus dados pessoais com terceiros para fins comerciais ou publicitários.
                </p>
                <p className="mt-2">
                  Os dados podem ser compartilhados apenas nas seguintes situações:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                  <li>Prestadores de serviços tecnológicos necessários ao funcionamento da plataforma (ex.: hospedagem e banco de dados), sempre sob obrigação de confidencialidade.</li>
                  <li>Autoridades competentes, quando exigido por lei ou ordem judicial.</li>
                </ul>
              </Policy>

              <Policy heading="6. Retenção dos dados">
                <p>
                  Os dados pessoais são armazenados pelo período necessário ao cumprimento das finalidades descritas nesta política ou pelo prazo mínimo exigido por lei.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                  <li><strong className="text-gray-300">Feedbacks e avaliações:</strong> até 2 (dois) anos após o envio, podendo ser excluídos antes mediante solicitação do titular.</li>
                  <li><strong className="text-gray-300">Dados de pedidos:</strong> pelo prazo previsto na legislação fiscal e comercial aplicável.</li>
                  <li><strong className="text-gray-300">Dados de navegação:</strong> conforme a política dos serviços de hospedagem utilizados, geralmente por até 90 dias.</li>
                </ul>
              </Policy>

              <Policy heading="7. Seus direitos (LGPD — Art. 18)">
                <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
                  <li>Confirmar a existência de tratamento de seus dados.</li>
                  <li>Acessar os dados que possuímos sobre você.</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                  <li>Solicitar a portabilidade dos dados.</li>
                  <li>Revogar o consentimento a qualquer momento, sem prejuízo ao tratamento já realizado.</li>
                  <li>Apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</li>
                </ul>
                {email && (
                  <p className="mt-3">
                    Para exercer seus direitos, entre em contato pelo e-mail{" "}
                    <a href={`mailto:${email}`} className="text-brand-yellow hover:underline">{email}</a>.
                  </p>
                )}
              </Policy>

              <Policy heading="8. Cookies e tecnologias similares">
                <p>
                  O site utiliza cookies essenciais para o funcionamento da sessão de autenticação e do carrinho de compras. Esses cookies são estritamente necessários e não requerem consentimento.
                </p>
                <p className="mt-2">
                  O mapa incorporado ao site (Google Maps) pode definir cookies de terceiros conforme a política de privacidade do Google. Recomendamos a leitura da política do Google em <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">policies.google.com/privacy</a>.
                </p>
              </Policy>

              <Policy heading="9. Segurança">
                <p>
                  Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, perda, alteração ou divulgação indevida, incluindo criptografia de dados em trânsito (HTTPS) e controle de acesso administrativo.
                </p>
              </Policy>

              <Policy heading="10. Alterações nesta política">
                <p>
                  Esta política pode ser atualizada periodicamente. A data da última atualização estará sempre indicada no topo desta página. Recomendamos que você a revise periodicamente.
                </p>
              </Policy>

              <Policy heading="11. Contato">
                <p>
                  Em caso de dúvidas sobre esta política ou sobre o tratamento dos seus dados pessoais, entre em contato com a {storeName}:
                </p>
                <ul className="list-none space-y-1 mt-2 text-gray-400">
                  {address && <li>📍 {address}</li>}
                  {email && <li>✉ <a href={`mailto:${email}`} className="text-brand-yellow hover:underline">{email}</a></li>}
                </ul>
              </Policy>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Policy({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">{heading}</h2>
      <div className="text-sm text-gray-400 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
