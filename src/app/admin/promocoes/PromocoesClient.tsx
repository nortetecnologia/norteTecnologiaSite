"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionActive,
  type PromoActionResult,
} from "./actions";
import { uploadPromoImage } from "./uploadAction";

export interface PromotionData {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  discount_percent: number | null;
  cover_image_url: string | null;
  is_active: boolean;
  position: number;
  product_count: number;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

type ModalState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "edit"; promo: PromotionData; linkedIds: string[] }
  | { kind: "delete"; id: string; title: string; error?: string };

interface Props {
  promotions: PromotionData[];
  products: ProductOption[];
}

const inputCls =
  "w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors";
const labelCls = "block text-xs font-medium text-[#9ca3af] mb-1";

const activeCount = (promos: PromotionData[]) => promos.filter((p) => p.is_active).length;

export function PromocoesClient({ promotions, products }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isActive, setIsActive] = useState(true);

  function openCreate() {
    setCoverImageUrl("");
    setUploadState("idle");
    setUploadError(null);
    setSelectedProductIds([]);
    setProductSearch("");
    setIsActive(true);
    setFormError(null);
    setModal({ kind: "create" });
  }

  function openEdit(promo: PromotionData, linkedIds: string[]) {
    setCoverImageUrl(promo.cover_image_url ?? "");
    setUploadState("idle");
    setUploadError(null);
    setSelectedProductIds(linkedIds);
    setProductSearch("");
    setIsActive(promo.is_active);
    setFormError(null);
    setModal({ kind: "edit", promo, linkedIds });
  }

  function runAction(fn: () => Promise<PromoActionResult>) {
    setFormError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.error) { setFormError(result.error); return; }
      setModal({ kind: "none" });
      router.refresh();
    });
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("cover_image_url", coverImageUrl);
    fd.set("is_active", isActive ? "true" : "false");
    fd.set("product_ids", selectedProductIds.join(","));

    if (modal.kind === "create") {
      runAction(() => createPromotion(fd));
    } else if (modal.kind === "edit") {
      runAction(() => updatePromotion(modal.promo.id, fd));
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadState("uploading");
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadPromoImage(fd);
    if (result.error) {
      setUploadState("error");
      setUploadError(result.error);
    } else {
      setUploadState("idle");
      setCoverImageUrl(result.url!);
    }
    e.target.value = "";
  }

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleToggleActive(promo: PromotionData) {
    startTransition(async () => {
      const result = await togglePromotionActive(promo.id, !promo.is_active);
      if (result.error) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const activeCnt = activeCount(promotions);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Promoções</h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            {activeCnt}/4 promoções ativas · {promotions.length} total
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={activeCnt >= 4}
          title={activeCnt >= 4 ? "Limite de 4 promoções ativas atingido" : ""}
          className="inline-flex items-center gap-2 bg-[#ffd600] text-[#0a0a0a] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#e6c000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nova Promoção
        </button>
      </div>

      {/* Aviso de limite */}
      {activeCnt >= 4 && (
        <div className="mb-4 rounded-lg bg-yellow-900/20 border border-yellow-800/40 px-4 py-3 text-sm text-yellow-400">
          Limite de 4 promoções ativas atingido. Desative uma para criar outra.
        </div>
      )}

      {/* Lista */}
      {promotions.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-12 text-center">
          <div className="mx-auto w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <h2 className="text-white font-medium mb-1">Nenhuma promoção cadastrada</h2>
          <p className="text-[#6b7280] text-sm">
            Clique em{" "}
            <button type="button" onClick={openCreate} className="text-[#ffd600] hover:underline">
              Nova Promoção
            </button>{" "}
            para começar.
          </p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <ul className="divide-y divide-[#2a2a2a]">
            {promotions.map((promo) => (
              <li key={promo.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#2a2a2a]/40 transition-colors">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-14 h-10 rounded overflow-hidden bg-[#2a2a2a]">
                  {promo.cover_image_url ? (
                    <Image
                      src={promo.cover_image_url}
                      alt={promo.title}
                      width={56}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium truncate">{promo.title}</span>
                    {promo.discount_percent && (
                      <span className="text-[10px] font-semibold bg-red-900/30 text-red-400 border border-red-800/40 px-1.5 py-0.5 rounded-full">
                        -{promo.discount_percent}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6b7280]">
                    {promo.subtitle && <span className="truncate">{promo.subtitle}</span>}
                    <span>{promo.product_count} produto{promo.product_count !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(promo)}
                    disabled={isPending}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      promo.is_active
                        ? "bg-green-900/30 text-green-400 border-green-800/40 hover:bg-green-900/50"
                        : "bg-[#2a2a2a] text-[#6b7280] border-[#3a3a3a] hover:bg-[#3a3a3a]"
                    }`}
                  >
                    {promo.is_active ? "Ativa" : "Inativa"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(promo, [])}
                    className="p-1.5 text-[#6b7280] hover:text-[#ffd600] transition-colors"
                    title="Editar promoção"
                    aria-label={`Editar ${promo.title}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ kind: "delete", id: promo.id, title: promo.title })}
                    className="p-1.5 text-[#6b7280] hover:text-red-400 transition-colors"
                    title="Excluir promoção"
                    aria-label={`Excluir ${promo.title}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal criar/editar */}
      {(modal.kind === "create" || modal.kind === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-white font-semibold">
                {modal.kind === "create" ? "Nova Promoção" : "Editar Promoção"}
              </h2>
              <button type="button" onClick={() => setModal({ kind: "none" })} className="p-1 text-[#6b7280] hover:text-white transition-colors" aria-label="Fechar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">{formError}</div>
              )}

              {/* Título */}
              <div>
                <label htmlFor="promo-title" className={labelCls}>Título <span className="text-red-400">*</span></label>
                <input
                  id="promo-title"
                  name="title"
                  type="text"
                  required
                  defaultValue={modal.kind === "edit" ? modal.promo.title : ""}
                  placeholder="Ex: Promoção de Notebooks"
                  className={inputCls}
                  autoFocus
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label htmlFor="promo-subtitle" className={labelCls}>Subtítulo <span className="text-[#4b5563] font-normal">(opcional)</span></label>
                <input
                  id="promo-subtitle"
                  name="subtitle"
                  type="text"
                  defaultValue={modal.kind === "edit" ? (modal.promo.subtitle ?? "") : ""}
                  placeholder="Ex: Aproveite os melhores preços"
                  className={inputCls}
                />
              </div>

              {/* Desconto */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="promo-discount" className={labelCls}>Desconto % <span className="text-[#4b5563] font-normal">(opcional)</span></label>
                  <input
                    id="promo-discount"
                    name="discount_percent"
                    type="number"
                    min="1"
                    max="99"
                    defaultValue={modal.kind === "edit" ? (modal.promo.discount_percent ?? "") : ""}
                    placeholder="Ex: 30"
                    className={inputCls}
                  />
                </div>
                {/* Status */}
                <div>
                  <span className={labelCls}>Status</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    onClick={() => setIsActive((v) => !v)}
                    className={`mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      isActive
                        ? "bg-green-900/30 text-green-400 border-green-800/40"
                        : "bg-[#2a2a2a] text-[#9ca3af] border-[#3a3a3a]"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400" : "bg-[#4b5563]"}`} aria-hidden="true" />
                    {isActive ? "Ativa" : "Inativa"}
                  </button>
                  {isActive && activeCnt >= 4 && modal.kind === "create" && (
                    <p className="mt-1 text-[11px] text-yellow-400">Limite de 4 ativas atingido</p>
                  )}
                </div>
              </div>

              {/* Imagem capa */}
              <div>
                <span className={labelCls}>Imagem Capa</span>
                {/* Preview */}
                <div className="mb-2 relative w-full max-w-xs aspect-video overflow-hidden rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
                  {coverImageUrl ? (
                    <>
                      <Image src={coverImageUrl} alt="Preview capa" fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => { setCoverImageUrl(""); setUploadError(null); }}
                        className="absolute right-2 top-2 rounded-md border border-[#3a3a3a] bg-[#1a1a1a]/90 px-2 py-1 text-[11px] text-[#9ca3af] backdrop-blur-sm transition-colors hover:border-red-800/40 hover:text-red-400"
                      >
                        Remover
                      </button>
                      {/* Prévia do overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-10 w-10 text-[#2a2a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Upload */}
                <label className={`flex items-center gap-2 cursor-pointer w-full bg-[#0a0a0a] border border-dashed border-[#3a3a3a] rounded-lg px-3 py-2.5 text-sm transition-colors hover:border-[#ffd600]/50 ${uploadState === "uploading" ? "opacity-60 pointer-events-none" : ""}`}>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" disabled={uploadState === "uploading"} />
                  {uploadState === "uploading" ? (
                    <>
                      <svg className="animate-spin flex-shrink-0 text-[#ffd600]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                        <path d="M12 3a9 9 0 019 9" />
                      </svg>
                      <span className="text-[#9ca3af]">Enviando para o Cloudinary…</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[#9ca3af]" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span className="text-[#9ca3af]">{coverImageUrl ? "Substituir arquivo" : "Enviar imagem do PC"}</span>
                      <span className="ml-auto text-[11px] text-[#4b5563]">JPEG · PNG · WebP · máx. 10 MB</span>
                    </>
                  )}
                </label>
                {uploadError && <p className="mt-1 text-xs text-red-400">{uploadError}</p>}
                <input
                  type="url"
                  placeholder="Ou cole a URL da imagem capa..."
                  value={coverImageUrl}
                  onChange={(e) => { setCoverImageUrl(e.target.value); setUploadError(null); }}
                  className={`${inputCls} mt-2`}
                />
              </div>

              {/* Produtos vinculados */}
              <div>
                <span className={labelCls}>
                  Produtos da promoção <span className="text-[#4b5563] font-normal">({selectedProductIds.length} selecionado{selectedProductIds.length !== 1 ? "s" : ""})</span>
                </span>
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className={`${inputCls} mb-2`}
                />
                <div className="max-h-48 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]">
                  {filteredProducts.length === 0 ? (
                    <p className="px-3 py-4 text-xs text-[#4b5563] text-center">Nenhum produto encontrado</p>
                  ) : (
                    filteredProducts.map((p) => (
                      <label key={p.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(p.id)}
                          onChange={() => toggleProduct(p.id)}
                          className="accent-[#ffd600] w-4 h-4 flex-shrink-0"
                        />
                        <span className="text-sm text-white truncate flex-1">{p.name}</span>
                        <span className="text-xs text-[#4b5563] flex-shrink-0">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.price)}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-[#2a2a2a]">
                <button type="button" onClick={() => setModal({ kind: "none" })} className="px-4 py-2 text-sm text-[#9ca3af] hover:text-white border border-[#2a2a2a] rounded-lg transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploadState === "uploading"}
                  className="bg-[#ffd600] text-[#0a0a0a] text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#e6c000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Salvando…" : uploadState === "uploading" ? "Aguarde o upload…" : modal.kind === "create" ? "Criar Promoção" : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal excluir */}
      {modal.kind === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl p-6">
            <h2 className="text-white font-semibold mb-2">Excluir promoção</h2>
            <p className="text-[#9ca3af] text-sm mb-5">
              Tem certeza que deseja excluir{" "}
              <span className="text-white font-medium">{'"'}{modal.title}{'"'}</span>?
            </p>
            {modal.error && (
              <div className="mb-4 rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">{modal.error}</div>
            )}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setModal({ kind: "none" })} className="px-4 py-2 text-sm text-[#9ca3af] hover:text-white border border-[#2a2a2a] rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await deletePromotion(modal.kind === "delete" ? modal.id : "");
                    if (result.error) {
                      setModal((m) => m.kind === "delete" ? { ...m, error: result.error } : m);
                      return;
                    }
                    setModal({ kind: "none" });
                    router.refresh();
                  });
                }}
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
