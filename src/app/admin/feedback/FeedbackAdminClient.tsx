"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteFeedback } from "./actions";

interface FeedbackRow {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  consent_given: boolean;
  created_at: string;
}

interface Props {
  items: FeedbackRow[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FeedbackAdminClient({ items }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Excluir este feedback? Esta ação não pode ser desfeita.")) return;
    setDeletingId(id);
    setError(null);
    startTransition(async () => {
      const result = await deleteFeedback(id);
      setDeletingId(null);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-12 text-center">
        <p className="text-[#6b7280] text-sm">Nenhum feedback recebido ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-white">
                  {item.name || "Anônimo"}
                </span>
                {item.email && (
                  <a
                    href={`mailto:${item.email}`}
                    className="text-xs text-[#ffd600] hover:underline"
                  >
                    {item.email}
                  </a>
                )}
                <span className="text-xs text-[#4b5563]">
                  {formatDate(item.created_at)}
                </span>
              </div>
              <p className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap break-words">
                {item.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              disabled={isPending && deletingId === item.id}
              className="shrink-0 rounded-lg border border-[#2a2a2a] p-2 text-[#6b7280] hover:border-red-800/60 hover:text-red-400 transition-colors disabled:opacity-40"
              aria-label="Excluir feedback"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
