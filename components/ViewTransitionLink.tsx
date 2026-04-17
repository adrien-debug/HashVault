"use client";

/**
 * Drop-in replacement for next/link that triggers the View Transitions API
 * before navigating, enabling cinematic cross-fade animations.
 * Falls back silently to normal navigation on unsupported browsers.
 */

import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string };

export function ViewTransitionLink({ href, children, onClick, ...rest }: Props) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();

    if (!("startViewTransition" in document)) {
      router.push(href);
      return;
    }

    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
      router.push(href);
    });
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
