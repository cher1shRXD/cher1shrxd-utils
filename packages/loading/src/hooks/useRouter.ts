"use client";

import { usePathname, useRouter as useNextRouter } from "next/navigation";
import { useLoadingStore } from "./useLoadingStore";

export const useRouter = () => {
  const router = useNextRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoadingStore();

  const push = (href: string) => {
    const currentUrl = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;
    if (currentUrl !== href) {
      setIsLoading(true);
      router.push(href);
    }
  };

  const replace = (href: string) => {
    const currentUrl = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;
    if (currentUrl !== href) {
      setIsLoading(true);
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
