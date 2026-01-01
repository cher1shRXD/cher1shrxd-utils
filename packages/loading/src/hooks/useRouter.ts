"use client";

import { usePathname, useRouter as useNextRouter } from "next/navigation";
import { useLoadingStore } from "./useLoadingStore";

export const useRouter = () => {
  const router = useNextRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoadingStore();

  const shouldStartLoading = (href: string): boolean => {
    if (typeof window === "undefined") {
      const currentUrl = `${pathname}`;
      return currentUrl !== href;
    }

    const current = new URL(window.location.href);
    const target = new URL(href, window.location.href);

    const currentKey = `${current.pathname}${current.search}`;
    const targetKey = `${target.pathname}${target.search}`;

    return currentKey !== targetKey;
  };

  const push = (href: string) => {
    if (shouldStartLoading(href)) {
      setIsLoading(true);
      router.push(href);
    } else {
      router.push(href);
    }
  };

  const replace = (href: string) => {
    if (shouldStartLoading(href)) {
      setIsLoading(true);
      router.replace(href);
    } else {
      router.replace(href);
    }
  };

  const back = () => {
    setIsLoading(true);
    router.back();
  };

  const refresh = () => {
    router.refresh();
  };

  return {
    push,
    replace,
    back,
    refresh,
  };
};
