import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { listInquiries, validateInquiry } from "@/lib/inquiries";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

const maxBodyBytes = 16 * 1024;

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Administrative authorization required." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  try {
    const data = await listInquiries({ status, limit, offset });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unable to list inquiries:", error);
    return NextResponse.json(
      { error: "Failed to retrieve enquiries." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Unable to read request body." }, { status: 400 });
  }
  if (Buffer.byteLength(rawBody, "utf8") > maxBodyBytes) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const validation = validateInquiry(payload);
  if (validation.honeypotFilled) {
    return NextResponse.json(
      { error: "Please submit a valid enquiry." },
      { status: 422 },
    );
  }
  if (!validation.value) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fields: validation.errors },
      { status: 422 },
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Enquiries are temporarily unavailable. Please contact us directly." },
      { status: 503 },
    );
  }

  try {
    const result = await getPool().query<{ id: string; created_at: Date }>(
      `INSERT INTO inquiries
        (name, phone, email, location, curious, interest, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
       RETURNING id, created_at`,
      [
        validation.value.name,
        validation.value.phone,
        validation.value.email,
        validation.value.location,
        validation.value.curious,
        validation.value.interest,
        validation.value.message,
      ],
    );
    return NextResponse.json(
      { id: result.rows[0].id, createdAt: result.rows[0].created_at },
      { status: 201 },
    );
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "unknown";
    console.error("Unable to store enquiry", { code });
    return NextResponse.json(
      { error: "Enquiries are temporarily unavailable. Please contact us directly." },
      { status: 503 },
    );
  }
}
