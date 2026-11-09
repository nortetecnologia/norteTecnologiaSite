"use client";

import { useEffect, useRef, useTransition } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import { trackSearch } from "@/app/actions/analytics";

interface Props {
  query: string;
  resultsCount: number;
}

export function SearchTracker({ query, resultsCount }: Props) {
  const { canTrack } = useConsent();
  const [, startTransition] = useTransition();
  const trackedRef = useRef("");

  useEffect(() => {
    const key = `${query}|${resultsCount}`;
    if (!canTrack || !query || trackedRef.current === key) return;
    trackedRef.current = key;
    startTransition(() => trackSearch(query, resultsCount));
  }, [canTrack, query, resultsCount]);

  return null;
}
