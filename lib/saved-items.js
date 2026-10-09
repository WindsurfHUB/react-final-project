"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "campus_lost_and_found_saved_items";

export function useSavedItems() {
  const [savedIds, setSavedIds] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load saved items from localStorage", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  const toggleSave = (id) => {
    if (!id) return;
    try {
      setSavedIds((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("saved-items-updated"));
        return next;
      });
    } catch (e) {
      console.error("Failed to update localStorage", e);
    }
  };

  const isSaved = (id) => savedIds.includes(id);

  return { savedIds, isSaved, toggleSave, isReady };
}
