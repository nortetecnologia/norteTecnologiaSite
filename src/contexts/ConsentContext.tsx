"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type ConsentState = "pending" | "accepted" | "denied";

interface ConsentContextValue {
  state: ConsentState;
  accept: () => void;
  deny: () => void;
  canTrack: boolean;
}

const STORAGE_KEY = "nt_analytics_consent";

const ConsentContext = createContext<ConsentContextValue>({
  state: "pending",
  accept: () => {},
  deny: () => {},
  canTrack: false,
});

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState>("pending");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted") setState("accepted");
      else if (stored === "denied") setState("denied");
    } catch {}
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
    <ConsentContext.Provider value={{ state, accept, deny, canTrack: state === "accepted" }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
