"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "../hooks/useLoadingStore";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Link = ({ href, children, className, onClick }: Props) => {
  const pathname = usePathname();
  const { setIsLoading } = useLoadingStore();

  return (
    <NextLink
      href={href}
      onClick={(e) => {
        const currentUrl = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;
        if (currentUrl !== href) {
          setIsLoading(true);
        } else {
          e.preventDefault();
        }
        onClick?.();
      }}
      className={className}>
      {children}
    </NextLink>
  );
};

export default Link;
