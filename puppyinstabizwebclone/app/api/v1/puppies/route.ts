import { NextResponse } from "next/server";
import {
  createPuppy,
  getPuppies,
  validatePuppyInput,
  type PuppyFilters,
} from "@/lib/puppies";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: PuppyFilters = {};
  if (searchParams.get("breed")) filters.breed = searchParams.get("breed")!;
  if (searchParams.get("origin")) filters.origin = searchParams.get("origin")!;
  if (searchParams.get("status")) filters.status = searchParams.get("status")!;
  if (searchParams.get("limit")) filters.limit = parseInt(searchParams.get("limit")!, 10);
  if (searchParams.get("offset")) filters.offset = parseInt(searchParams.get("offset")!, 10);

  try {
    const puppies = await getPuppies(filters);
    return NextResponse.json({ puppies, total: puppies.length });
  } catch (error) {
    console.error("Unable to list puppies:", error);
    return NextResponse.json(
      { error: "Failed to retrieve puppies." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrative authorization required." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validatePuppyInput(body);
  if (!validation.value) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fields: validation.errors },
      { status: 422 },
    );
  }

  try {
    const puppy = await createPuppy(validation.value);
    return NextResponse.json({ puppy }, { status: 201 });
  } catch (error) {
    console.error("Unable to create puppy:", error);
    return NextResponse.json(
      { error: "Failed to create puppy record." },
      { status: 500 },
    );
  }
}
