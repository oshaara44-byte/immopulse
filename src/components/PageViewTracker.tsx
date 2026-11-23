"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("utm_source");
    const campaign = searchParams.get("utm_campaign");

    void trackEvent("page_view", {
      path: pathname,
      source,
      campaign,
    });
  }, [pathname, searchParams]);

  return null;
}