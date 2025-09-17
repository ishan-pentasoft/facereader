"use client";

import { useState, useEffect, useCallback } from "react";

export function useContactDetails() {
  const [contact, setContact] = useState({
    details: null,
    isLoading: true,
  });

  const fetchContactDetails = useCallback(async () => {
    try {
      const res = await fetch("/api/user/contact-details", {
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        const data = json?.data ?? null;
        setContact({ details: data, isLoading: false });
        return { ok: true, data };
      } else {
        const err = await safeJson(res);
        setContact({ details: null, isLoading: false });
        return { ok: false, error: err };
      }
    } catch (error) {
      setContact({ details: null, isLoading: false });
      return { ok: false, error };
    }
  }, []);

  const refresh = useCallback(
    () => fetchContactDetails(),
    [fetchContactDetails]
  );

  useEffect(() => {
    fetchContactDetails();
  }, [fetchContactDetails]);

  return { contact, refresh };
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}
