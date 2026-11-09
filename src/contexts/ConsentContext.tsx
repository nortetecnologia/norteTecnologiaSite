"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type ConsentState = "pending" | "accepted" | "denied";

interface ConsentContextValue {
  state: ConsentState;
  accept: () => void;
  deny: () => void;
  canTrack: boolean;
  mounted: boolean;
}

const STORAGE_KEY = "nt_analytics_consent";

const ConsentContext = createContext<ConsentContextValue>({
  state: "pending",
  accept: () => {},
  deny: () => {},
  canTrack: false,
  mounted: false,
});

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState>("pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted") setState("accepted");
      else if (stored === "denied") setState("denied");
    } catch {}
    setMounted(true);
  }, []);

  const accept = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    setState("accepted");
  }, []);

  const deny = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, "denied"); } catch {}
    setState("denied");
  }, []);

  return (
    <ConsentContext.Provider value={{ state, accept, deny, canTrack: state === "accepted", mounted }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
