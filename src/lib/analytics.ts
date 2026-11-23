import { createClient } from "@/lib/supabase/browser";

export type AnalyticsEventName =
  | "page_view"
  | "language_selected"
  | "profile_selected"
  | "signup_completed"
  | "login_completed"
  | "trial_started"
  | "property_created"
  | "inquiry_submitted"
  | "alert_created"
  | "plan_selected";

type TrackEventOptions = {
  userId?: string | null;
  locale?: "en" | "fr" | "es";
  role?: string | null;
  path?: string;
  source?: string | null;
  campaign?: string | null;
  metadata?: Record<string, unknown>;
};

function getSessionId() {
  if (typeof window === "undefined") return null;

  const storageKey = "immopulse_analytics_session";

  let sessionId = window.localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

export async function trackEvent(
  eventName: AnalyticsEventName,
  options: TrackEventOptions = {},
) {
  try {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();

    const locale =
      options.locale ||
      (typeof window !== "undefined"
        ? window.localStorage.getItem("immopulse_locale")
        : null) ||
      "en";

    const safeLocale: "en" | "fr" | "es" =
      locale === "fr" || locale === "es" ? locale : "en";

    await supabase.from("analytics_events").insert({
      event_name: eventName,
      user_id: options.userId || data.user?.id || null,
      session_id: getSessionId(),
      locale: safeLocale,
      role: options.role || null,
      path:
        options.path ||
        (typeof window !== "undefined" ? window.location.pathname : null),
      source: options.source || null,
      campaign: options.campaign || null,
      metadata: options.metadata || {},
    });
  } catch {
    // Les statistiques ne doivent jamais bloquer l’application.
  }
}