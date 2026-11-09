"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useConsent } from "@/contexts/ConsentContext";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "nt_pwa_prompt";
const LATER_MS = 7 * 24 * 60 * 60 * 1000;

type Stored =
  | { decision: "never" }
  | { decision: "later"; at: number }
  | { decision: "installed" };

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Stored;
  } catch {
    return null;
  }
}

function write(value: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

function shouldShow(stored: Stored | null): boolean {
  if (!stored) return true;
  if (stored.decision === "never" || stored.decision === "installed") return false;
  if (stored.decision === "later") return Date.now() - stored.at > LATER_MS;
  return true;
}

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAlreadyInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).standalone === true
  );
}

const IOS_STEPS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
    ),
    label: (
      <>
        Toque em <strong className="text-white">Compartilhar</strong> na barra do Safari
      </>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    label: (
      <>
        Toque em <strong className="text-white">&ldquo;Adicionar à Tela de Início&rdquo;</strong>
      </>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    label: (
      <>
        Toque em <strong className="text-white">&ldquo;Adicionar&rdquo;</strong> no canto superior direito
      </>
    ),
  },
];

export function InstallPrompt() {
  const { state: consentState, mounted: consentMounted } = useConsent();
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<"hidden" | "android" | "ios">("hidden");
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (!consentMounted || consentState === "pending") return;
    if (isAlreadyInstalled()) return;
    if (!shouldShow(readStored())) return;

    if (detectIOS()) {
      setMode("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setMode("android");
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [consentState, consentMounted]);

  async function handleInstall() {
    const p = deferredPrompt.current;
    if (!p) return;
    setInstalling(true);
    try {
      await p.prompt();
      const { outcome } = await p.userChoice;
      if (outcome === "accepted") write({ decision: "installed" });
    } finally {
      deferredPrompt.current = null;
      setInstalling(false);
      setMode("hidden");
    }
  }

  function handleLater() {
    write({ decision: "later", at: Date.now() });
    setMode("hidden");
  }

  function handleNever() {
    write({ decision: "never" });
    setMode("hidden");
  }

  if (mode === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar app Norte Tecnologia"
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
    >
      <div className="bg-[#111111] border-t border-[#2a2a2a] shadow-2xl px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-lg flex flex-col gap-4">

          {/* App info */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#2a2a2a]">
              <Image
                src="/icon-192.png"
                alt="Norte Tecnologia"
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">
                Norte Tecnologia
              </p>
              <p className="text-xs text-[#9ca3af] mt-0.5 leading-tight">
                {mode === "ios"
                  ? "Instale no iPhone para acesso rápido"
                  : installing
                  ? "Confirme a instalação no Chrome…"
                  : "Instale o app e acesse mais rápido"}
              </p>
            </div>
          </div>

          {/* iOS: numbered steps */}
          {mode === "ios" && (
            <ol className="flex flex-col gap-2" aria-label="Passos para instalar">
              {IOS_STEPS.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2.5"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] text-xs font-bold text-[#9ca3af]"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 text-[#9ca3af]">{step.icon}</span>
                    <span className="text-xs text-[#d1d5db] leading-relaxed">{step.label}</span>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {mode === "android" && (
              <button
                onClick={handleInstall}
                disabled={installing}
                className="flex-1 min-w-[120px] rounded-lg bg-[#ffd600] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#f5cc00] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {installing ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    Aguardando…
                  </>
                ) : (
                  "Instalar agora"
                )}
              </button>
            )}

            {mode === "android" && (
              <button
                onClick={handleLater}
                disabled={installing}
                className="flex-1 min-w-[100px] rounded-lg border border-[#3a3a3a] px-4 py-2.5 text-sm font-medium text-[#d1d5db] hover:border-[#555] hover:text-white active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mais tarde
              </button>
            )}

            <button
              onClick={handleNever}
              disabled={installing}
              className={`px-3 py-2.5 text-xs text-[#6b7280] hover:text-[#9ca3af] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${mode === "ios" ? "ml-auto" : ""}`}
            >
              {mode === "ios" ? "Fechar" : "Nunca"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
