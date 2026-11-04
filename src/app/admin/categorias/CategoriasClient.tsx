"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "./actions";

export interface SubcategoryData {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  subcategories: SubcategoryData[];
}

type ModalState =
  | { kind: "none" }
  | { kind: "cat_create" }
  | { kind: "cat_edit"; id: string; name: string }
  | { kind: "cat_delete"; id: string; name: string }
  | { kind: "sub_create"; catId: string; catName: string }
  | { kind: "sub_edit"; id: string; name: string; catId: string }
  | { kind: "sub_delete"; id: string; name: string };

// ── NameForm ─────────────────────────────────────────────────────────────────

interface NameFormProps {
  initialValue: string;
  label: string;
  placeholder: string;
  error: string | null;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

function NameForm({
  initialValue,
  label,
  placeholder,
  error,
  pending,
  onCancel,
  onSubmit,
}: NameFormProps) {
  const [value, setValue] = useState(initialValue);
  const isEdit = initialValue !== "";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#d1d5db] mb-1.5">
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) onSubmit(value.trim());
            if (e.key === "Escape") onCancel();
          }}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="px-4 py-2 text-sm text-[#d1d5db] hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => value.trim() && onSubmit(value.trim())}
          disabled={pending || !value.trim()}
          className="px-5 py-2 text-sm font-semibold bg-[#ffd600] text-[#0a0a0a] rounded-lg hover:bg-[#e6c000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending
            ? isEdit
              ? "Salvando…"
              : "Criando…"
            : isEdit
            ? "Salvar"
            : "Criar"}
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CategoriasClient({
  categories,
}: {
  categories: CategoryData[];
}) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function openModal(state: ModalState) {
    setModal(state);
    setModalError(null);
  }

  function closeModal() {
    setModal({ kind: "none" });
    setModalError(null);
  }

  async function runAction(
    fn: () => Promise<{ success?: boolean; error?: string }>
  ) {
    setPending(true);
    setModalError(null);
    const result = await fn();
    setPending(false);
    if (result.error) {
      setModalError(result.error);
    } else {
      closeModal();
      router.refresh();
    }
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  const modalNode = modal.kind !== "none" && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white font-semibold text-lg mb-4">
          {modal.kind === "cat_create" && "Nova Categoria"}
          {modal.kind === "cat_edit" && "Editar Categoria"}
          {modal.kind === "cat_delete" && "Excluir Categoria"}
          {modal.kind === "sub_create" && `Subcategoria em "${modal.catName}"`}
          {modal.kind === "sub_edit" && "Editar Subcategoria"}
          {modal.kind === "sub_delete" && "Excluir Subcategoria"}
        </h2>

        {/* Delete confirmation */}
        {(modal.kind === "cat_delete" || modal.kind === "sub_delete") && (
          <div className="space-y-4">
            <p className="text-[#d1d5db] text-sm">
              Tem certeza que deseja excluir{" "}
              <span className="font-medium text-white">{'"'}{modal.name}{'"'}</span>
              {modal.kind === "cat_delete"
                ? "? Exclua as subcategorias vinculadas antes."
                : "? Esta ação não pode ser desfeita."}
            </p>
            {modalError && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                {modalError}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={pending}
                className="px-4 py-2 text-sm text-[#d1d5db] hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (modal.kind === "cat_delete")
                    runAction(() => deleteCategory(modal.id));
                  else if (modal.kind === "sub_delete")
                    runAction(() => deleteSubcategory(modal.id));
                }}
                disabled={pending}
                className="px-4 py-2 text-sm font-semibold bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                {pending ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        )}

        {/* Create / Edit form */}
        {modal.kind !== "cat_delete" && modal.kind !== "sub_delete" && (
          <NameForm
            key={JSON.stringify(modal)}
            initialValue={
              modal.kind === "cat_edit" || modal.kind === "sub_edit"
                ? modal.name
                : ""
            }
            label={
              modal.kind === "cat_create" || modal.kind === "cat_edit"
                ? "Nome da categoria"
                : "Nome da subcategoria"
            }
            placeholder={
              modal.kind === "cat_create" || modal.kind === "cat_edit"
                ? "Ex: Computadores"
                : "Ex: Desktop"
            }
            error={modalError}
            pending={pending}
            onCancel={closeModal}
            onSubmit={(name) => {
              const m = modal;
              if (m.kind === "cat_create")
                runAction(() => createCategory(name));
              else if (m.kind === "cat_edit")
                runAction(() => updateCategory(m.id, name));
              else if (m.kind === "sub_create")
                runAction(() => createSubcategory(m.catId, name));
              else if (m.kind === "sub_edit")
                runAction(() => updateSubcategory(m.id, name));
            }}
          />
        )}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-semibold">Categorias</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Organize as categorias e subcategorias dos produtos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal({ kind: "cat_create" })}
          className="inline-flex shrink-0 items-center gap-2 bg-[#ffd600] text-[#0a0a0a] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e6c000] transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nova Categoria
        </button>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-12 text-center">
          <div className="mx-auto mb-4 w-14 h-14 bg-[#2a2a2a] rounded-full flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>
          <h2 className="text-white font-medium mb-2">
            Nenhuma categoria cadastrada
          </h2>
          <p className="text-[#6b7280] text-sm max-w-xs mx-auto mb-5">
            Crie a primeira categoria para organizar os produtos da loja.
          </p>
          <button
            type="button"
            onClick={() => openModal({ kind: "cat_create" })}
            className="inline-flex items-center gap-2 bg-[#ffd600] text-[#0a0a0a] text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#e6c000] transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova Categoria
          </button>
        </div>
      )}

      {/* Category list */}
      {categories.length > 0 && (
        <div className="space-y-3">
          {categories.map((cat) => {
            const isExpanded = expanded.has(cat.id);
            return (
              <div
                key={cat.id}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden"
              >
                {/* Category row */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleExpand(cat.id)}
                    className="text-[#6b7280] hover:text-white transition-colors p-0.5 shrink-0"
                    aria-label={isExpanded ? "Recolher" : "Expandir"}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm">
                      {cat.name}
                    </span>
                    <span className="ml-2 text-xs text-[#4b5563]">
                      {cat.subcategories.length}{" "}
                      {cat.subcategories.length === 1
                        ? "subcategoria"
                        : "subcategorias"}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          kind: "cat_edit",
                          id: cat.id,
                          name: cat.name,
                        })
                      }
                      className="p-1.5 text-[#6b7280] hover:text-[#ffd600] transition-colors rounded"
                      title="Editar"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openModal({
                          kind: "cat_delete",
                          id: cat.id,
                          name: cat.name,
                        })
                      }
                      className="p-1.5 text-[#6b7280] hover:text-red-400 transition-colors rounded"
                      title="Excluir"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Subcategory list */}
                {isExpanded && (
                  <div className="border-t border-[#2a2a2a] px-4 pb-3 pt-2">
                    <div className="space-y-0.5 ml-7">
                      {cat.subcategories.length === 0 && (
                        <p className="text-xs text-[#4b5563] py-1.5">
                          Nenhuma subcategoria.
                        </p>
                      )}
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-2 py-1.5"
                        >
                          <span
                            className="text-[#3a3a3a] text-sm select-none"
                            aria-hidden="true"
                          >
                            └
                          </span>
                          <span className="flex-1 text-sm text-[#d1d5db] min-w-0 truncate">
                            {sub.name}
                          </span>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                openModal({
                                  kind: "sub_edit",
                                  id: sub.id,
                                  name: sub.name,
                                  catId: cat.id,
                                })
                              }
                              className="p-1 text-[#6b7280] hover:text-[#ffd600] transition-colors rounded"
                              title="Editar"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                openModal({
                                  kind: "sub_delete",
                                  id: sub.id,
                                  name: sub.name,
                                })
                              }
                              className="p-1 text-[#6b7280] hover:text-red-400 transition-colors rounded"
                              title="Excluir"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          openModal({
                            kind: "sub_create",
                            catId: cat.id,
                            catName: cat.name,
                          })
                        }
                        className="flex items-center gap-1.5 text-xs text-[#4b5563] hover:text-[#ffd600] transition-colors py-1.5 mt-0.5"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nova Subcategoria
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalNode}
    </div>
  );
}
