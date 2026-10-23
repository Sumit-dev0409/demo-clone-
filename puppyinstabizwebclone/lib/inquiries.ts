

export type InquiryStatus = "new" | "contacted" | "resolved" | "archived";

export type InquiryRecord = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  curious: string;
  interest: string;
  message: string | null;
  status: InquiryStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
};

export type InquiryInput = {
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  curious: string;
  interest: string;
  message: string | null;
};

export type InquiryValidation = {
  value?: InquiryInput;
  errors: Record<string, string>;
  honeypotFilled: boolean;
};

const limits = {
  name: 120,
  phone: 25,
  email: 254,
  location: 120,
  curious: 100,
  interest: 160,
  message: 2000,
} as const;

export function validateInquiry(input: unknown): InquiryValidation {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      errors: { form: "Please submit a valid enquiry." },
      honeypotFilled: false,
    };
  }

  const fields = input as Record<string, unknown>;
  const honeypotFilled =
    typeof fields.website === "string" && fields.website.trim().length > 0;
  function readField(field: keyof typeof limits, required = false): string | null {
    const raw = fields[field];
    if (typeof raw !== "string") {
      if (required) errors[field] = "This field is required.";
      return null;
    }

    const trimmed = raw.trim();
    if (trimmed.length > limits[field]) {
      errors[field] = `Must be ${limits[field]} characters or fewer.`;
      return null;
    }
    if (!trimmed && required) {
      errors[field] = "This field is required.";
      return null;
    }
    return trimmed || null;
  }

  const name = readField("name", true);
  const phone = readField("phone", true);
  const email = readField("email");
  const location = readField("location");
  const curious = readField("curious", true);
  const interest = readField("interest", true);
  const message = readField("message");

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (
    phone &&
    (!/^\+?[\d\s().-]+$/.test(phone) || (phone.match(/\d/g) ?? []).length < 7)
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  const value =
    name && phone && curious && interest && Object.keys(errors).length === 0
      ? { name, phone, email, location, curious, interest, message }
      : undefined;

  return {
    value,
    errors,
    honeypotFilled,
  };
}

export type InquiryFilters = {
  status?: string;
  limit?: number;
  offset?: number;
};

export async function listInquiries(filters: InquiryFilters = {}): Promise<{
  inquiries: InquiryRecord[];
  total: number;
}> {
  if (!process.env.DATABASE_URL) {
    return { inquiries: [], total: 0 };
  }

  const { getPool } = await import("./db.ts");
  const pool = getPool();
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (filters.status && filters.status !== "all") {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
  const offset = Math.max(Number(filters.offset) || 0, 0);

  const countQuery = `SELECT COUNT(*) AS total FROM inquiries ${whereClause}`;
  const countResult = await pool.query<{ total: string }>(countQuery, values);
  const total = parseInt(countResult.rows[0]?.total || "0", 10);

  values.push(limit);
  const limitParam = `$${values.length}`;
  values.push(offset);
  const offsetParam = `$${values.length}`;

  const dataQuery = `
    SELECT
      id, name, phone, email, location, curious, interest, message,
      status, notes, created_at, updated_at
    FROM inquiries
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const result = await pool.query<InquiryRecord>(dataQuery, values);
  return {
    inquiries: result.rows,
    total,
  };
}

export async function updateInquiry(
  id: string,
  updates: { status?: InquiryStatus; notes?: string | null },
): Promise<InquiryRecord | null> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const { getPool } = await import("./db.ts");
  const pool = getPool();
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (updates.status !== undefined) {
    values.push(updates.status);
    fields.push(`status = $${values.length}`);
  }

  if (updates.notes !== undefined) {
    values.push(updates.notes);
    fields.push(`notes = $${values.length}`);
  }

  if (fields.length === 0) {
    const existing = await pool.query<InquiryRecord>(
      "SELECT * FROM inquiries WHERE id = $1",
      [id],
    );
    return existing.rows[0] || null;
  }

  fields.push("updated_at = NOW()");
  values.push(id);

  const query = `
    UPDATE inquiries
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query<InquiryRecord>(query, values);
  return result.rows[0] || null;
}
