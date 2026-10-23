import { NextResponse } from "next/server";
import { updateInquiry, type InquiryStatus } from "@/lib/inquiries";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrative authorization required." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Inquiry ID is required." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const allowedStatuses: InquiryStatus[] = ["new", "contacted", "resolved", "archived"];

  const updates: { status?: InquiryStatus; notes?: string | null } = {};

  if (payload.status !== undefined) {
    if (typeof payload.status !== "string" || !allowedStatuses.includes(payload.status as InquiryStatus)) {
      return NextResponse.json(
        { error: `Status must be one of: ${allowedStatuses.join(", ")}` },
        { status: 422 },
      );
    }
    updates.status = payload.status as InquiryStatus;
  }

  if (payload.notes !== undefined) {
    updates.notes = typeof payload.notes === "string" ? payload.notes.trim() : null;
  }

  try {
    const updated = await updateInquiry(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }
    return NextResponse.json({ inquiry: updated });
  } catch (error) {
    console.error("Failed to update inquiry:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
