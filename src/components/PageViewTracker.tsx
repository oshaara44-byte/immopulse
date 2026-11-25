"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

function PageViewTrackerContent() {
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

function PageViewTrackerFallback() {
  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={<PageViewTrackerFallback />}>
      <PageViewTrackerContent />
    </Suspense>
  );
}