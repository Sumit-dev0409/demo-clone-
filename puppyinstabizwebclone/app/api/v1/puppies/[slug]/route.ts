import { NextResponse } from "next/server";
import {
  deletePuppy,
  getPuppyBySlug,
  updatePuppy,
  validatePuppyInput,
} from "@/lib/puppies";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  try {
    const puppy = await getPuppyBySlug(slug);
    if (!puppy) {
      return NextResponse.json({ error: "Puppy not found." }, { status: 404 });
    }
    return NextResponse.json({ puppy });
  } catch (error) {
    console.error("Failed to retrieve puppy:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrative authorization required." },
      { status: 401 },
    );
  }

  const { slug } = await params;
  const existing = await getPuppyBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Puppy not found." }, { status: 404 });
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

  try {
    const updated = await updatePuppy(existing.id, body as Record<string, unknown>);
    return NextResponse.json({ puppy: updated });
  } catch (error) {
    console.error("Failed to update puppy:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrative authorization required." },
      { status: 401 },
    );
  }

  const { slug } = await params;
  const existing = await getPuppyBySlug(slug);
  if (!existing) {
    return NextResponse.json({ error: "Puppy not found." }, { status: 404 });
  }

  try {
    const deleted = await deletePuppy(existing.id);
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete puppy." }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Puppy deleted successfully." });
  } catch (error) {
    console.error("Failed to delete puppy:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
