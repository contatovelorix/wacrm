import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/require-user";
import { DashboardShell } from "./dashboard-shell";

// Every page in this route group is private. Keeping the verified server-side
// check here makes protection the default when a new dashboard page is added.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Server layout whose only job is to declare "do not index" metadata
// for the authed app. robots.ts already disallows these paths at the
// crawler-level and proxy redirects unauthenticated visitors, so
// this is belt-and-suspenders — but SEO-critical if a URL ever leaks
// via a link shared externally.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <DashboardShell>{children}</DashboardShell>;
}
