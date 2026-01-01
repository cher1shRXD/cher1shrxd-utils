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
        if (typeof window !== "undefined") {
          const current = new URL(window.location.href);
          const target = new URL(href, window.location.href);

          const currentKey = `${current.pathname}${current.search}`;
          const targetKey = `${target.pathname}${target.search}`;

          if (currentKey === targetKey) {
            if (current.hash === target.hash) {
              e.preventDefault();
            }
          } else {
            setIsLoading(true);
          }
        } else {
          const currentUrl = `${pathname}`;
          if (currentUrl !== href) {
            setIsLoading(true);
          } else {
            e.preventDefault();
          }
        }
        onClick?.();
      }}
      className={className}>
      {children}
    </NextLink>
  );
};

export default Link;
