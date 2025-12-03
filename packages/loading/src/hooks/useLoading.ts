"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLoadingStore } from "./useLoadingStore";

export const useLoading = () => {
  const pathname = usePathname();
  const { isLoading, setIsLoading } = useLoadingStore();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

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
    if (isLoading) {
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
    }
  }, [pathname, setIsLoading, isLoading]);

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
