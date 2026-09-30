"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

// A link of the entry page: a plain <a> in the server HTML (works without JS); on click it also
// sends the GA4 `branch_select` event with the chosen branch. It never prevents the navigation.
export function EntryLink({
  branch,
  href,
  className,
  children,
}: {
  branch: "business" | "home";
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href as Route}
      className={className}
      onClick={() => track({ name: "branch_select", params: { branch } })}
    >
      {children}
    </Link>
  );
}
