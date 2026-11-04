"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  type ProductActionResult,
} from "./actions";

export interface ProductData {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  sku: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  subcategory_id: string | null;
  is_active: boolean;
  primary_image_url: string | null;
  category_name: string | null;
  subcategory_name: string | null;
}

export interface CategoryOption {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

type ModalState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "edit"; product: ProductData }
  | { kind: "delete"; id: string; name: string; error?: string };

interface Props {
  products: ProductData[];
  categories: CategoryOption[];
}

const inputCls =
  "w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors";

const labelCls = "block text-xs font-medium text-[#9ca3af] mb-1";

function PlaceholderIcon() {
  return (
    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4b5563"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

export function ProdutosClient({ products, categories }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formSubcategoryId, setFormSubcategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const subcategoryOptions =
    categories.find((c) => c.id === formCategoryId)?.subcategories ?? [];

  function openCreate() {
    setFormCategoryId("");
    setFormSubcategoryId("");
    setIsActive(true);
    setFormError(null);
    setModal({ kind: "create" });
  }

  function openEdit(product: ProductData) {
    setFormCategoryId(product.category_id ?? "");
    setFormSubcategoryId(product.subcategory_id ?? "");
    setIsActive(product.is_active);
    setFormError(null);
    setModal({ kind: "edit", product });
  }

  function runFormAction(fn: () => Promise<ProductActionResult>) {
    setFormError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.error) {
        setFormError(result.error);
        return;
      }
      setModal({ kind: "none" });
      router.refresh();
    });
  }

  function runDeleteAction(id: string, name: string, fn: () => Promise<ProductActionResult>) {
    startTransition(async () => {
      const result = await fn();
      if (result.error) {
        setModal({ kind: "delete", id, name, error: result.error });
        return;
      }
      setModal({ kind: "none" });
      router.refresh();
    });
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (modal.kind === "create") {
      runFormAction(() => createProduct(formData));
    } else if (modal.kind === "edit") {
      runFormAction(() => updateProduct(modal.product.id, formData));
    }
  }

  function handleToggleActive(product: ProductData) {
    startTransition(async () => {
      await toggleProductActive(product.id, !product.is_active);
      router.refresh();
    });
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.brand?.toLowerCase().includes(q) ?? false) ||
      (p.sku?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold">Produtos</h1>
          <p className="text-[#6b7280] text-sm mt-0.5">
            {products.length} produto{products.length !== 1 ? "s" : ""} cadastrado
            {products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#ffd600] text-[#0a0a0a] text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#e6c000] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Produto
        </button>
      </div>

      {/* Busca */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nome, marca ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
          />
        </div>
      </div>

      {/* Lista de produtos */}
      {filtered.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-12 text-center">
          <div className="mx-auto w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          {search ? (
            <>
              <h2 className="text-white font-medium mb-1">Nenhum resultado para {'"'}{search}{'"'}</h2>
              <p className="text-[#6b7280] text-sm">Tente outro termo de busca.</p>
            </>
          ) : (
            <>
              <h2 className="text-white font-medium mb-1">Nenhum produto cadastrado</h2>
              <p className="text-[#6b7280] text-sm max-w-xs mx-auto">
                Clique em{" "}
                <button type="button" onClick={openCreate} className="text-[#ffd600] hover:underline">
                  Novo Produto
                </button>{" "}
                para começar.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <ul className="divide-y divide-[#2a2a2a]">
            {filtered.map((product) => (
              <li key={product.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#2a2a2a]/40 transition-colors group">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {product.primary_image_url ? (
                    <div className="w-10 h-10 rounded overflow-hidden bg-[#2a2a2a]">
                      <Image
                        src={product.primary_image_url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <PlaceholderIcon />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium truncate">{product.name}</span>
                    {product.sku && (
                      <span className="text-[10px] font-mono bg-[#2a2a2a] text-[#9ca3af] px-1.5 py-0.5 rounded">
                        {product.sku}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6b7280] flex-wrap">
                    {product.brand && <span>{product.brand}</span>}
                    {product.brand && product.category_name && <span>·</span>}
                    {product.category_name && (
                      <span>
                        {product.category_name}
                        {product.subcategory_name ? ` › ${product.subcategory_name}` : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price + Stock */}
                <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-sm">
                  <span className="text-[#ffd600] font-medium tabular-nums">{formatCurrency(product.price)}</span>
                  <span className={`tabular-nums ${product.stock === 0 ? "text-red-400" : "text-[#9ca3af]"}`}>
                    {product.stock} un.
                  </span>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(product)}
                    disabled={isPending}
                    title={product.is_active ? "Desativar produto" : "Ativar produto"}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      product.is_active
                        ? "bg-green-900/30 text-green-400 border-green-800/40 hover:bg-green-900/50"
                        : "bg-[#2a2a2a] text-[#6b7280] border-[#3a3a3a] hover:bg-[#3a3a3a]"
                    }`}
                  >
                    {product.is_active ? "Ativo" : "Inativo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="p-1.5 text-[#6b7280] hover:text-[#ffd600] transition-colors"
                    title="Editar produto"
                    aria-label={`Editar ${product.name}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ kind: "delete", id: product.id, name: product.name })}
                    className="p-1.5 text-[#6b7280] hover:text-red-400 transition-colors"
                    title="Excluir produto"
                    aria-label={`Excluir ${product.name}`}
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

      {/* Modal de criação / edição */}
      {(modal.kind === "create" || modal.kind === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            key={JSON.stringify({ kind: modal.kind, id: modal.kind === "edit" ? modal.product.id : null })}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-white font-semibold">
                {modal.kind === "create" ? "Novo Produto" : "Editar Produto"}
              </h2>
              <button
                type="button"
                onClick={() => setModal({ kind: "none" })}
                className="p-1 text-[#6b7280] hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              )}

              {/* Nome, Marca, SKU */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="prod-name" className={labelCls}>
                    Nome <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="prod-name"
                    name="name"
                    type="text"
                    required
                    defaultValue={modal.kind === "edit" ? modal.product.name : ""}
                    placeholder="Ex: Mouse Gamer RGB"
                    className={inputCls}
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="prod-brand" className={labelCls}>Marca</label>
                  <input
                    id="prod-brand"
                    name="brand"
                    type="text"
                    defaultValue={modal.kind === "edit" ? (modal.product.brand ?? "") : ""}
                    placeholder="Ex: Logitech"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="prod-sku" className={labelCls}>SKU</label>
                  <input
                    id="prod-sku"
                    name="sku"
                    type="text"
                    defaultValue={modal.kind === "edit" ? (modal.product.sku ?? "") : ""}
                    placeholder="Ex: MG-001"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Preço e Estoque */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="prod-price" className={labelCls}>
                    Preço (R$) <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="prod-price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={modal.kind === "edit" ? modal.product.price : ""}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="prod-stock" className={labelCls}>
                    Estoque <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="prod-stock"
                    name="stock"
                    type="number"
                    required
                    min="0"
                    step="1"
                    defaultValue={modal.kind === "edit" ? modal.product.stock : ""}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Categoria e Subcategoria */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="prod-category" className={labelCls}>Categoria</label>
                  <select
                    id="prod-category"
                    name="category_id"
                    value={formCategoryId}
                    onChange={(e) => {
                      setFormCategoryId(e.target.value);
                      setFormSubcategoryId("");
                    }}
                    className={inputCls}
                  >
                    <option value="">— Nenhuma —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="prod-subcategory" className={labelCls}>Subcategoria</label>
                  <select
                    id="prod-subcategory"
                    name="subcategory_id"
                    value={formSubcategoryId}
                    onChange={(e) => setFormSubcategoryId(e.target.value)}
                    disabled={subcategoryOptions.length === 0}
                    className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">— Nenhuma —</option>
                    {subcategoryOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="prod-description" className={labelCls}>Descrição</label>
                <textarea
                  id="prod-description"
                  name="description"
                  rows={3}
                  defaultValue={modal.kind === "edit" ? (modal.product.description ?? "") : ""}
                  placeholder="Descrição comercial do produto..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Imagem */}
              <div>
                <label htmlFor="prod-image" className={labelCls}>URL da Imagem Principal</label>
                <input
                  id="prod-image"
                  name="image_url"
                  type="url"
                  defaultValue={modal.kind === "edit" ? (modal.product.primary_image_url ?? "") : ""}
                  placeholder="https://..."
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-[#6b7280]">
                  Upload via Cloudinary disponível em breve. Por enquanto, informe a URL da imagem.
                </p>
              </div>

              {/* Status (apenas edição) */}
              {modal.kind === "edit" && (
                <div>
                  <span className={labelCls}>Status</span>
                  <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    onClick={() => setIsActive((v) => !v)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      isActive
                        ? "bg-green-900/30 text-green-400 border-green-800/40"
                        : "bg-[#2a2a2a] text-[#9ca3af] border-[#3a3a3a]"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400" : "bg-[#4b5563]"}`} aria-hidden="true" />
                    {isActive ? "Ativo" : "Inativo"}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setModal({ kind: "none" })}
                  className="px-4 py-2 text-sm text-[#9ca3af] hover:text-white border border-[#2a2a2a] rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#ffd600] text-[#0a0a0a] text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#e6c000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? "Salvando…"
                    : modal.kind === "create"
                    ? "Criar Produto"
                    : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de exclusão */}
      {modal.kind === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl p-6">
            <h2 className="text-white font-semibold mb-2">Excluir produto</h2>
            <p className="text-[#9ca3af] text-sm mb-1">
              Tem certeza que deseja excluir{" "}
              <span className="text-white font-medium">{'"'}{modal.name}{'"'}</span>?
            </p>
            <p className="text-[#6b7280] text-xs mb-5">
              Esta ação não pode ser desfeita. As imagens associadas também serão removidas.
            </p>
            {modal.error && (
              <div className="mb-4 rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">
                {modal.error}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal({ kind: "none" })}
                className="px-4 py-2 text-sm text-[#9ca3af] hover:text-white border border-[#2a2a2a] rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  runDeleteAction(modal.id, modal.name, () =>
                    deleteProduct(modal.id)
                  )
                }
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
