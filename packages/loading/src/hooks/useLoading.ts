"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLoadingStore } from "./useLoadingStore";

export const useLoading = () => {
  const pathname = usePathname();
  const { isLoading, setIsLoading } = useLoadingStore();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const navWatchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startUrlKeyRef = useRef<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const incrementProgress = useCallback(() => {
    setProgress((prev) => {
      if (prev < 30) {
        return prev + Math.random() * 8 + 2;
      } else if (prev < 70) {
        return prev + Math.random() * 4 + 1;
      } else if (prev < 90) {
        return prev + Math.random() * 2 + 0.5;
      } else {
        return Math.min(prev + Math.random() * 0.5, 95);
      }
    });
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setVisible(true);
        setProgress(0);
        setProgress(5);
      }, 0);

      intervalRef.current = setInterval(incrementProgress, 150);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading, incrementProgress]);

  useEffect(() => {
    if (!isLoading) {
      if (navWatchIntervalRef.current) {
        clearInterval(navWatchIntervalRef.current);
        navWatchIntervalRef.current = null;
      }
      startUrlKeyRef.current = null;
      return;
    }

    // Snapshot current URL key only once at the moment loading starts.
    // (If we reset this when pathname changes, completion detection can get stuck.)
    if (startUrlKeyRef.current === null) {
      if (typeof window !== "undefined") {
        startUrlKeyRef.current = `${window.location.pathname}${window.location.search}`;
      } else {
        startUrlKeyRef.current = pathname;
      }
    }

    // Watch for actual committed navigation (including query-string changes)
    // without using useSearchParams (which would require Suspense).
    if (navWatchIntervalRef.current) {
      clearInterval(navWatchIntervalRef.current);
      navWatchIntervalRef.current = null;
    }

    navWatchIntervalRef.current = setInterval(() => {
      if (typeof window === "undefined") return;
      const startKey = startUrlKeyRef.current;
      if (!startKey) return;

      const currentKey = `${window.location.pathname}${window.location.search}`;
      if (currentKey === startKey) return;

      if (navWatchIntervalRef.current) {
        clearInterval(navWatchIntervalRef.current);
        navWatchIntervalRef.current = null;
      }
      startUrlKeyRef.current = null;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setTimeout(() => {
        setProgress(100);
      }, 0);

      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, 50);

    return () => {
      if (navWatchIntervalRef.current) {
        clearInterval(navWatchIntervalRef.current);
        navWatchIntervalRef.current = null;
      }
    };
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (!isLoading && visible) {
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isLoading, visible]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (navWatchIntervalRef.current) {
        clearInterval(navWatchIntervalRef.current);
        navWatchIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    progress,
    visible,
  };
};
