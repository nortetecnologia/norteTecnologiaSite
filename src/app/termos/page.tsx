import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getStoreSettings } from "@/lib/store-settings";

export const metadata: Metadata = {
  title: "Termos de Uso | Norte Tecnologia",
  description: "Termos e condições de uso do site da Norte Tecnologia.",
};

export default async function TermosPage() {
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
              <span className="text-white">Termos de Uso</span>
            </nav>
          </div>
        </div>

        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-content">
            <div className="max-w-3xl space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white lg:text-3xl mb-2">Termos de Uso</h1>
                <p className="text-sm text-gray-500">Última atualização: {updated}</p>
              </div>

              <div className="rounded-xl border border-brand-yellow/20 bg-brand-yellow/5 px-5 py-4 text-sm text-gray-300 leading-relaxed">
                Ao acessar e utilizar o site da <strong className="text-white">{storeName}</strong>, você concorda com os termos e condições descritos a seguir. Leia com atenção antes de continuar.
              </div>

              <Term heading="1. Aceitação dos termos">
                <p>
                  O uso deste site implica a aceitação integral destes Termos de Uso. Caso não concorde com alguma das condições, pedimos que não utilize o site.
                </p>
              </Term>

              <Term heading="2. Sobre o site">
                <p>
                  O site da <strong className="text-white">{storeName}</strong> é uma plataforma de apresentação de produtos e serviços de informática, onde os clientes podem consultar o catálogo, adicionar itens ao carrinho e encaminhar pedidos ou solicitações de serviço diretamente pelo WhatsApp.
                </p>
                <p className="mt-2">
                  <strong className="text-white">Importante:</strong> o site não realiza processamento de pagamentos online. O fechamento da compra, a confirmação do pedido e o pagamento são feitos diretamente com a equipe da {storeName} pelo WhatsApp ou presencialmente na loja.
                </p>
              </Term>

              <Term heading="3. Uso permitido">
                <p>O usuário se compromete a utilizar o site exclusivamente para fins lícitos e de acordo com estes termos. É vedado:</p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-500">
                  <li>Usar o site para fins ilícitos ou que causem danos à {storeName} ou a terceiros.</li>
                  <li>Tentar acessar áreas restritas sem autorização.</li>
                  <li>Realizar ações que prejudiquem o funcionamento da plataforma (ataques, sobrecarga, injeção de código etc.).</li>
                  <li>Publicar conteúdo ofensivo, difamatório ou falso nas avaliações e feedbacks.</li>
                  <li>Reproduzir, copiar ou redistribuir conteúdo do site sem autorização prévia.</li>
                </ul>
              </Term>

              <Term heading="4. Produtos e preços">
                <p>
                  A {storeName} se empenha em manter as informações de produtos, preços e disponibilidade atualizadas, mas não garante a ausência de erros ou variações. Preços e disponibilidade de estoque podem mudar sem aviso prévio.
                </p>
                <p className="mt-2">
                  Eventuais divergências de preço entre o site e a loja física serão resolvidas diretamente com a equipe da {storeName}.
                </p>
              </Term>

              <Term heading="5. Pedidos e serviços">
                <p>
                  A adição de produtos ao carrinho e o envio do pedido via WhatsApp <strong className="text-white">não configuram contrato de compra e venda</strong>. O pedido somente é confirmado após o contato com a equipe da {storeName} e a confirmação da disponibilidade e do pagamento.
                </p>
                <p className="mt-2">
                  Da mesma forma, a solicitação de serviço pelo site é apenas o início do atendimento. A execução do serviço depende de análise técnica e acordo prévio com a {storeName}.
                </p>
              </Term>

              <Term heading="6. Avaliações e feedbacks">
                <p>
                  O usuário que enviar uma avaliação ou feedback declara que o conteúdo é verdadeiro, leal e de sua autoria. A {storeName} reserva-se o direito de remover conteúdo que viole estes termos, seja ofensivo, difamatório ou contrário à lei, sem necessidade de aviso prévio.
                </p>
              </Term>

              <Term heading="7. Propriedade intelectual">
                <p>
                  Todo o conteúdo do site — incluindo textos, imagens, logotipo, layout e código — é propriedade da {storeName} ou de seus licenciantes. É proibida a reprodução, distribuição ou utilização para fins comerciais sem autorização expressa.
                </p>
              </Term>

              <Term heading="8. Limitação de responsabilidade">
                <p>A {storeName} não se responsabiliza por:</p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-500">
                  <li>Danos decorrentes do uso indevido do site pelo usuário.</li>
                  <li>Indisponibilidade temporária do site por manutenção ou problemas técnicos.</li>
                  <li>Conteúdo de sites de terceiros linkados a partir deste site.</li>
                  <li>Erros tipográficos ou de informação que sejam prontamente corrigidos ao serem identificados.</li>
                </ul>
              </Term>

              <Term heading="9. Privacidade">
                <p>
                  O tratamento de dados pessoais é regido pela nossa{" "}
                  <Link href="/privacidade" className="text-brand-yellow hover:underline">Política de Privacidade</Link>, em conformidade com a LGPD. Recomendamos a leitura antes de utilizar os formulários do site.
                </p>
              </Term>

              <Term heading="10. Alterações nos termos">
                <p>
                  A {storeName} pode alterar estes Termos de Uso a qualquer momento. A versão mais atual estará sempre disponível nesta página, com a data de última atualização indicada no topo. O uso continuado do site após eventuais alterações implica a aceitação dos novos termos.
                </p>
              </Term>

              <Term heading="11. Lei aplicável e foro">
                <p>
                  Estes termos são regidos pelas leis da República Federativa do Brasil. Para dirimir eventuais conflitos, fica eleito o foro da comarca de{" "}
                  {settings.city ? <strong className="text-gray-300">{settings.city} — {settings.state_abbr}</strong> : <strong className="text-gray-300">Rorainópolis — RR</strong>}, com renúncia a qualquer outro, por mais privilegiado que seja.
                </p>
              </Term>

              <Term heading="12. Contato">
                <p>
                  Em caso de dúvidas sobre estes Termos de Uso, entre em contato:
                </p>
                <ul className="list-none space-y-1 mt-2 text-gray-400">
                  {address && <li>📍 {address}</li>}
                  {email && <li>✉ <a href={`mailto:${email}`} className="text-brand-yellow hover:underline">{email}</a></li>}
                </ul>
              </Term>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Term({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">{heading}</h2>
      <div className="text-sm text-gray-400 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
