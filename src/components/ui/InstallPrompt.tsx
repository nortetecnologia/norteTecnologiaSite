"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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

export function InstallPrompt() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Register service worker regardless of prompt preference
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (!shouldShow(readStored())) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    const p = deferredPrompt.current;
    if (!p) return;
    await p.prompt();
    const { outcome } = await p.userChoice;
    if (outcome === "accepted") write({ decision: "installed" });
    deferredPrompt.current = null;
    setVisible(false);
  }

  function handleLater() {
    write({ decision: "later", at: Date.now() });
    setVisible(false);
  }

  function handleNever() {
    write({ decision: "never" });
    setVisible(false);
  }

  if (!visible) return null;

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
                src="/logo.png"
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
                Instale o app e acesse mais rápido
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleInstall}
              className="flex-1 min-w-[120px] rounded-lg bg-[#ffd600] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#f5cc00] active:scale-95 transition-all"
            >
              Instalar agora
            </button>
            <button
              onClick={handleLater}
              className="flex-1 min-w-[100px] rounded-lg border border-[#3a3a3a] px-4 py-2.5 text-sm font-medium text-[#d1d5db] hover:border-[#555] hover:text-white active:scale-95 transition-all"
            >
              Mais tarde
            </button>
            <button
              onClick={handleNever}
              className="px-3 py-2.5 text-xs text-[#6b7280] hover:text-[#9ca3af] active:scale-95 transition-all"
            >
              Nunca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
