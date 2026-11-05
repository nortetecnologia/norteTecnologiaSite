"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import {
  updateVitrineTitle,
  toggleVitrineActive,
  addProductToVitrine,
  removeProductFromVitrine,
  moveVitrineProduct,
  setVitrineContentType,
  addCategoryToVitrine,
  removeCategoryFromVitrine,
  moveCategoryInVitrine,
} from "./actions";

export interface VitrineProduct {
  vitrine_product_id: string;
  product_id: string;
  product_name: string;
  position: number;
  price: number;
  stock: number;
  primary_image_url: string | null;
}

export interface VitrineCategory {
  vitrine_category_id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  position: number;
}

export interface VitrineData {
  id: string;
  slug: string;
  title: string;
  display_type: "carousel" | "grid" | "row";
  is_active: boolean;
  position: number;
  content_type: "products" | "categories";
  products: VitrineProduct[];
  vitrine_categories: VitrineCategory[];
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  stock: number;
  primary_image_url: string | null;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

type ModalState =
  | { kind: "none" }
  | { kind: "editTitle"; vitrineId: string; currentTitle: string }
  | { kind: "addProduct"; vitrineId: string; existingProductIds: string[] }
  | { kind: "addCategory"; vitrineId: string; existingCategoryIds: string[] };

interface Props {
  vitrines: VitrineData[];
  products: ProductOption[];
  categories: CategoryOption[];
}

const DISPLAY_TYPE_LABEL: Record<string, string> = {
  carousel: "Carrossel",
  grid: "Grade",
  row: "Linha",
};

export function VitrinasClient({ vitrines, products, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [titleInput, setTitleInput] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  function openEditTitle(vitrineId: string, currentTitle: string) {
    setTitleInput(currentTitle);
    setModalError(null);
    setModal({ kind: "editTitle", vitrineId, currentTitle });
  }

  function openAddProduct(vitrineId: string, existingProductIds: string[]) {
    setItemSearch("");
    setModalError(null);
    setModal({ kind: "addProduct", vitrineId, existingProductIds });
  }

  function openAddCategory(vitrineId: string, existingCategoryIds: string[]) {
    setItemSearch("");
    setModalError(null);
    setModal({ kind: "addCategory", vitrineId, existingCategoryIds });
  }

  function closeModal() {
    setModal({ kind: "none" });
    setModalError(null);
  }

  function handleSaveTitle() {
    if (modal.kind !== "editTitle") return;
    setModalError(null);
    startTransition(async () => {
      const result = await updateVitrineTitle(modal.vitrineId, titleInput);
      if (result.error) {
        setModalError(result.error);
      } else {
        closeModal();
        router.refresh();
      }
    });
  }

  function handleToggleActive(vitrineId: string, current: boolean) {
    startTransition(async () => {
      await toggleVitrineActive(vitrineId, !current);
      router.refresh();
    });
  }

  function handleSetContentType(vitrineId: string, type: "products" | "categories") {
    startTransition(async () => {
      await setVitrineContentType(vitrineId, type);
      router.refresh();
    });
  }

  function handleAddProduct(productId: string) {
    if (modal.kind !== "addProduct") return;
    const { vitrineId } = modal;
    startTransition(async () => {
      const result = await addProductToVitrine(vitrineId, productId);
      if (result.error) {
        setModalError(result.error);
      } else {
        closeModal();
        router.refresh();
      }
    });
  }

  function handleRemoveProduct(vitrineProductId: string) {
    startTransition(async () => {
      await removeProductFromVitrine(vitrineProductId);
      router.refresh();
    });
  }

  function handleMoveProduct(vitrineId: string, vitrineProductId: string, direction: "up" | "down") {
    startTransition(async () => {
      await moveVitrineProduct(vitrineId, vitrineProductId, direction);
      router.refresh();
    });
  }

  function handleAddCategory(categoryId: string) {
    if (modal.kind !== "addCategory") return;
    const { vitrineId } = modal;
    startTransition(async () => {
      const result = await addCategoryToVitrine(vitrineId, categoryId);
      if (result.error) {
        setModalError(result.error);
      } else {
        closeModal();
        router.refresh();
      }
    });
  }

  function handleRemoveCategory(vitrineCategoryId: string) {
    startTransition(async () => {
      await removeCategoryFromVitrine(vitrineCategoryId);
      router.refresh();
    });
  }

  function handleMoveCategory(vitrineId: string, vitrineCategoryId: string, direction: "up" | "down") {
    startTransition(async () => {
      await moveCategoryInVitrine(vitrineId, vitrineCategoryId, direction);
      router.refresh();
    });
  }

  const availableProducts =
    modal.kind === "addProduct"
      ? products.filter(
          (p) =>
            !modal.existingProductIds.includes(p.id) &&
            (itemSearch.trim() === "" ||
              p.name.toLowerCase().includes(itemSearch.toLowerCase()))
        )
      : [];

  const availableCategories =
    modal.kind === "addCategory"
      ? categories.filter(
          (c) =>
            !modal.existingCategoryIds.includes(c.id) &&
            (itemSearch.trim() === "" ||
              c.name.toLowerCase().includes(itemSearch.toLowerCase()))
        )
      : [];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">Vitrines</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Configure os itens exibidos em cada vitrine. A vitrine &quot;Destaques do Header&quot; alimenta a barra de acesso rápido no topo do site.
        </p>
      </div>

      <div className="space-y-6">
        {vitrines.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-10 text-center">
            <p className="text-[#4b5563] text-sm">
              Nenhuma vitrine encontrada. Aplique a migration 001 no Supabase SQL Editor.
            </p>
          </div>
        ) : (
          vitrines.map((vitrine) => (
            <VitrineCard
              key={vitrine.id}
              vitrine={vitrine}
              isPending={isPending}
              onEditTitle={openEditTitle}
              onToggleActive={handleToggleActive}
              onSetContentType={handleSetContentType}
              onAddProduct={openAddProduct}
              onRemoveProduct={handleRemoveProduct}
              onMoveProduct={handleMoveProduct}
              onAddCategory={openAddCategory}
              onRemoveCategory={handleRemoveCategory}
              onMoveCategory={handleMoveCategory}
            />
          ))
        )}
      </div>

      {/* Modal editar título */}
      {modal.kind === "editTitle" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white font-semibold mb-4">Editar título da vitrine</h2>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              placeholder="Título da vitrine"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] mb-4"
              autoFocus
            />
            {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 rounded-lg border border-[#2a2a2a] text-[#9ca3af] text-sm hover:bg-[#2a2a2a] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTitle}
                disabled={isPending || !titleInput.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-[#ffd600] text-black text-sm font-medium hover:bg-[#e6c000] transition-colors disabled:opacity-50"
              >
                {isPending ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal adicionar produto */}
      {modal.kind === "addProduct" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-lg p-6 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Adicionar produto</h2>
              <button onClick={closeModal} className="text-[#6b7280] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Buscar produto…"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] mb-3"
              autoFocus
            />
            {modalError && <p className="text-red-400 text-xs mb-2">{modalError}</p>}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {availableProducts.length === 0 ? (
                <p className="text-[#4b5563] text-sm text-center py-8">
                  {itemSearch ? "Nenhum produto encontrado." : "Todos os produtos já estão nesta vitrine ou não há produtos cadastrados."}
                </p>
              ) : (
                availableProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleAddProduct(p.id)}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#ffd600] hover:bg-[#1a1a1a] transition-colors text-left disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] overflow-hidden flex-shrink-0">
                      {p.primary_image_url ? (
                        <Image src={p.primary_image_url} alt={p.name} width={40} height={40} unoptimized className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#4b5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[#6b7280] text-xs">{formatCurrency(p.price)} · estoque: {p.stock}</p>
                    </div>
                    <svg className="w-4 h-4 text-[#ffd600] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal adicionar categoria */}
      {modal.kind === "addCategory" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-lg p-6 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Adicionar categoria</h2>
              <button onClick={closeModal} className="text-[#6b7280] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Buscar categoria…"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] mb-3"
              autoFocus
            />
            {modalError && <p className="text-red-400 text-xs mb-2">{modalError}</p>}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {availableCategories.length === 0 ? (
                <p className="text-[#4b5563] text-sm text-center py-8">
                  {itemSearch ? "Nenhuma categoria encontrada." : "Todas as categorias já estão nesta vitrine ou não há categorias cadastradas."}
                </p>
              ) : (
                availableCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAddCategory(c.id)}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#ffd600] hover:bg-[#1a1a1a] transition-colors text-left disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#ffd600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{c.name}</p>
                      <p className="text-[#6b7280] text-xs">/{c.slug}</p>
                    </div>
                    <svg className="w-4 h-4 text-[#ffd600] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface VitrineCardProps {
  vitrine: VitrineData;
  isPending: boolean;
  onEditTitle: (id: string, title: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
  onSetContentType: (id: string, type: "products" | "categories") => void;
  onAddProduct: (id: string, existingIds: string[]) => void;
  onRemoveProduct: (vitrineProductId: string) => void;
  onMoveProduct: (vitrineId: string, vitrineProductId: string, direction: "up" | "down") => void;
  onAddCategory: (id: string, existingIds: string[]) => void;
  onRemoveCategory: (vitrineCategoryId: string) => void;
  onMoveCategory: (vitrineId: string, vitrineCategoryId: string, direction: "up" | "down") => void;
}

function VitrineCard({
  vitrine,
  isPending,
  onEditTitle,
  onToggleActive,
  onSetContentType,
  onAddProduct,
  onRemoveProduct,
  onMoveProduct,
  onAddCategory,
  onRemoveCategory,
  onMoveCategory,
}: VitrineCardProps) {
  const isHeader = vitrine.slug === "vitrine_header";
  const existingProductIds = vitrine.products.map((p) => p.product_id);
  const existingCategoryIds = vitrine.vitrine_categories.map((c) => c.category_id);

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2a2a2a]">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {isHeader && (
            <span className="text-sm" aria-label="Vitrine especial do header">⭐</span>
          )}
          <h2 className="text-white font-semibold text-sm truncate">{vitrine.title}</h2>
          <span className="px-2 py-0.5 rounded text-xs bg-[#2a2a2a] text-[#9ca3af] flex-shrink-0">
            {DISPLAY_TYPE_LABEL[vitrine.display_type] ?? vitrine.display_type}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggleActive(vitrine.id, vitrine.is_active)}
            disabled={isPending}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors disabled:opacity-50 ${
              vitrine.is_active
                ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                : "bg-[#2a2a2a] text-[#6b7280] border-[#3a3a3a] hover:bg-[#3a3a3a]"
            }`}
          >
            {vitrine.is_active ? "Ativa" : "Inativa"}
          </button>
          <button
            onClick={() => onEditTitle(vitrine.id, vitrine.title)}
            className="p-1.5 rounded text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors"
            title="Editar título"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toggle content_type */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <span className="text-xs text-[#6b7280]">Tipo de conteúdo:</span>
        <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
          <button
            onClick={() => vitrine.content_type !== "products" && onSetContentType(vitrine.id, "products")}
            disabled={isPending}
            className={`px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              vitrine.content_type === "products"
                ? "bg-[#ffd600] text-black"
                : "text-[#9ca3af] hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => vitrine.content_type !== "categories" && onSetContentType(vitrine.id, "categories")}
            disabled={isPending}
            className={`px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              vitrine.content_type === "categories"
                ? "bg-[#ffd600] text-black"
                : "text-[#9ca3af] hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            Categorias
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-5 pb-5">
        {vitrine.content_type === "products" ? (
          <>
            {vitrine.products.length === 0 ? (
              <p className="text-[#4b5563] text-sm text-center py-4">Nenhum produto nesta vitrine.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {vitrine.products.map((vp, index) => (
                  <div key={vp.vitrine_product_id} className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] overflow-hidden flex-shrink-0">
                      {vp.primary_image_url ? (
                        <Image src={vp.primary_image_url} alt={vp.product_name} width={40} height={40} unoptimized className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#4b5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{vp.product_name}</p>
                      <p className="text-[#6b7280] text-xs">
                        {formatCurrency(vp.price)}
                        {vp.stock === 0 && <span className="ml-2 text-red-400">sem estoque</span>}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => onMoveProduct(vitrine.id, vp.vitrine_product_id, "up")}
                        disabled={isPending || index === 0}
                        className="p-1 rounded text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30"
                        title="Mover para cima"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onMoveProduct(vitrine.id, vp.vitrine_product_id, "down")}
                        disabled={isPending || index === vitrine.products.length - 1}
                        className="p-1 rounded text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30"
                        title="Mover para baixo"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveProduct(vp.vitrine_product_id)}
                      disabled={isPending}
                      className="p-1.5 rounded text-[#6b7280] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 flex-shrink-0"
                      title="Remover da vitrine"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => onAddProduct(vitrine.id, existingProductIds)}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-[#2a2a2a] text-[#6b7280] text-sm hover:border-[#ffd600] hover:text-[#ffd600] transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar produto
            </button>
          </>
        ) : (
          <>
            {vitrine.vitrine_categories.length === 0 ? (
              <p className="text-[#4b5563] text-sm text-center py-4">Nenhuma categoria nesta vitrine.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {vitrine.vitrine_categories.map((vc, index) => (
                  <div key={vc.vitrine_category_id} className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
                    <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#ffd600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{vc.category_name}</p>
                      <p className="text-[#6b7280] text-xs">/{vc.category_slug}</p>
                    </div>
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => onMoveCategory(vitrine.id, vc.vitrine_category_id, "up")}
                        disabled={isPending || index === 0}
                        className="p-1 rounded text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30"
                        title="Mover para cima"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onMoveCategory(vitrine.id, vc.vitrine_category_id, "down")}
                        disabled={isPending || index === vitrine.vitrine_categories.length - 1}
                        className="p-1 rounded text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-30"
                        title="Mover para baixo"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveCategory(vc.vitrine_category_id)}
                      disabled={isPending}
                      className="p-1.5 rounded text-[#6b7280] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 flex-shrink-0"
                      title="Remover da vitrine"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => onAddCategory(vitrine.id, existingCategoryIds)}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-[#2a2a2a] text-[#6b7280] text-sm hover:border-[#ffd600] hover:text-[#ffd600] transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar categoria
            </button>
          </>
        )}
      </div>
    </div>
  );
}
