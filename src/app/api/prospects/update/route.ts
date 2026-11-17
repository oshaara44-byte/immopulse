import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = [
  "new",
  "to_qualify",
  "to_follow_up",
  "visit_scheduled",
  "visit_completed",
  "offer",
  "converted",
  "not_relevant",
  "archived",
] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

type UpdateBody = {
  prospectId?: string;
  status?: AllowedStatus;
  priority?: number;
  nextActionAt?: string | null;
  notes?: string | null;
};

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as UpdateBody;

    if (!body.prospectId) {
      return NextResponse.json(
        { error: "prospectId est requis." },
        { status: 400 },
      );
    }

    if (body.priority !== undefined) {
      if (!Number.isInteger(body.priority) || body.priority < 1 || body.priority > 3) {
        return NextResponse.json(
          { error: "La priorité doit être comprise entre 1 et 3." },
          { status: 400 },
        );
      }
    }

    if (body.status && !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Statut non autorisé." },
        { status: 400 },
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: "Organisation introuvable." },
        { status: 404 },
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      updates.status = body.status;
    }

    if (body.priority !== undefined) {
      updates.priority = body.priority;
    }

    if (body.nextActionAt !== undefined) {
      updates.next_action_at = body.nextActionAt;
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes;
    }

    updates.updated_at = new Date().toISOString();

    const { data: prospect, error } = await supabase
      .from("prospects")
      .update(updates)
      .eq("id", body.prospectId)
      .eq("organization_id", profile.organization_id)
      .select(
        "id, status, priority, next_action_at, notes, updated_at",
      )
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      );
    }

    if (!prospect) {
      return NextResponse.json(
        { error: "Prospect introuvable." },
        { status: 404 },
      );
    }

    return NextResponse.json({ prospect });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 },
    );
  }
}