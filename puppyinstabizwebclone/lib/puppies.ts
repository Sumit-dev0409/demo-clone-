import { availablePuppies, findPuppy, goneHome } from "./data.ts";

async function resolveDb() {
  const { getPool, isDbCircuitOpen, recordDbFailure } = await import("./db.ts");
  return { pool: getPool(), isDbCircuitOpen, recordDbFailure };
}

export type PuppyOrigin = "local" | "imported";
export type PuppyStatus = "available" | "reserved" | "gone_home";

export type PuppyRecord = {
  id: string;
  slug: string;
  name: string;
  breed: string;
  meta: string;
  media: string;
  href: string;
  door: string;
  origin: PuppyOrigin;
  status: PuppyStatus;
  featured: boolean;
  price_aed: number | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

export type PuppyInput = {
  name: string;
  slug?: string;
  breed: string;
  meta: string;
  media: string;
  door?: string;
  origin: PuppyOrigin;
  status?: PuppyStatus;
  featured?: boolean;
  price_aed?: number | null;
  description?: string | null;
};

export type PuppyValidation = {
  value?: PuppyInput;
  errors: Record<string, string>;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validatePuppyInput(input: unknown): PuppyValidation {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { errors: { form: "Invalid puppy data provided." } };
  }

  const fields = input as Record<string, unknown>;

  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  if (!name) errors.name = "Puppy name is required.";
  if (name.length > 120) errors.name = "Name must be 120 characters or fewer.";

  const breed = typeof fields.breed === "string" ? fields.breed.trim() : "";
  if (!breed) errors.breed = "Breed is required.";
  if (breed.length > 100) errors.breed = "Breed must be 100 characters or fewer.";

  const meta = typeof fields.meta === "string" ? fields.meta.trim() : "";
  if (!meta) errors.meta = "Summary/meta information is required.";
  if (meta.length > 255) errors.meta = "Meta must be 255 characters or fewer.";

  const media = typeof fields.media === "string" ? fields.media.trim() : "";
  if (!media) errors.media = "Image or media path is required.";

  const originRaw = fields.origin;
  const origin: PuppyOrigin =
    originRaw === "imported" ? "imported" : "local";

  const statusRaw = fields.status;
  const status: PuppyStatus =
    statusRaw === "reserved"
      ? "reserved"
      : statusRaw === "gone_home"
      ? "gone_home"
      : "available";

  const door =
    typeof fields.door === "string" && fields.door.trim()
      ? fields.door.trim()
      : "#a24a1a";

  const slug =
    typeof fields.slug === "string" && fields.slug.trim()
      ? slugify(fields.slug.trim())
      : slugify(`${breed}-${name}-${origin}`);

  let price_aed: number | null = null;
  if (fields.price_aed !== undefined && fields.price_aed !== null && fields.price_aed !== "") {
    const num = Number(fields.price_aed);
    if (!Number.isFinite(num) || num < 0) {
      errors.price_aed = "Price must be a positive number.";
    } else {
      price_aed = num;
    }
  }

  const description =
    typeof fields.description === "string" && fields.description.trim()
      ? fields.description.trim()
      : null;

  const featured = Boolean(fields.featured);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    value: {
      name,
      slug,
      breed,
      meta,
      media,
      door,
      origin,
      status,
      featured,
      price_aed,
      description,
    },
    errors: {},
  };
}

/** Fallback helper that converts static data items to PuppyRecord format */
function fallbackPuppies(): PuppyRecord[] {
  const available: PuppyRecord[] = availablePuppies.map((p, idx) => ({
    id: `static-avail-${idx}`,
    slug: p.href.replace("/puppies/", ""),
    name: p.name,
    breed: p.meta.split(",")[0].trim() || p.name,
    meta: p.meta,
    media: p.media,
    href: p.href,
    door: p.door,
    origin: p.origin,
    status: "available",
    featured: idx < 6,
    price_aed: p.origin === "imported" ? 16500 : 9500,
    description: `${p.name} is a healthy, vet-certified puppy ready for a warm and loving home in Dubai.`,
    created_at: new Date("2026-01-01T00:00:00Z"),
    updated_at: new Date("2026-01-01T00:00:00Z"),
  }));

  const gone: PuppyRecord[] = goneHome.map((g, idx) => ({
    id: `static-gone-${idx}`,
    slug: g.slug,
    name: g.name,
    breed: g.name.split(" ")[0] || "Puppy",
    meta: g.meta,
    media: "/media/3yOfnmoyPooH/81e0c7e00c/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg",
    href: `/puppies/${g.slug}`,
    door: "#5a3a28",
    origin: "local",
    status: "gone_home",
    featured: false,
    price_aed: null,
    description: `${g.name} has already found their forever family!`,
    created_at: new Date("2025-12-01T00:00:00Z"),
    updated_at: new Date("2025-12-01T00:00:00Z"),
  }));

  return [...available, ...gone];
}

export type PuppyFilters = {
  breed?: string;
  origin?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

export async function getPuppies(filters: PuppyFilters = {}): Promise<PuppyRecord[]> {
  if (process.env.DATABASE_URL) {
    try {
      const { pool, isDbCircuitOpen, recordDbFailure } = await resolveDb();
      if (!isDbCircuitOpen()) {
        const conditions: string[] = [];
        const values: (string | number)[] = [];

        if (filters.status) {
          values.push(filters.status);
          conditions.push(`status = $${values.length}`);
        }

        if (filters.origin && (filters.origin === "local" || filters.origin === "imported")) {
          values.push(filters.origin);
          conditions.push(`origin = $${values.length}`);
        }

        if (filters.breed) {
          const breedNeedle = `%${filters.breed.replace(/-/g, " ")}%`;
          values.push(breedNeedle);
          conditions.push(`(breed ILIKE $${values.length} OR name ILIKE $${values.length} OR meta ILIKE $${values.length})`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const limitClause = filters.limit ? `LIMIT ${Number(filters.limit)}` : "";
        const offsetClause = filters.offset ? `OFFSET ${Number(filters.offset)}` : "";

        const query = `
          SELECT
            id, slug, name, breed, meta, media, href, door, origin, status,
            featured, price_aed, description, created_at, updated_at
          FROM puppies
          ${whereClause}
          ORDER BY featured DESC, created_at DESC
          ${limitClause} ${offsetClause}
        `;

        const result = await pool.query<PuppyRecord>(query, values);
        if (result.rows.length > 0) {
          return result.rows;
        }
      }
    } catch {
      try {
        const { recordDbFailure } = await resolveDb();
        recordDbFailure();
      } catch {
        // Ignore
      }
    }
  }

  // Fallback to static catalog
  let list = fallbackPuppies();
  if (filters.status) {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters.origin) {
    list = list.filter((p) => p.origin === filters.origin);
  }
  if (filters.breed) {
    const needle = filters.breed.toLowerCase().replace(/-/g, " ");
    list = list.filter((p) =>
      `${p.breed} ${p.name} ${p.meta}`.toLowerCase().includes(needle),
    );
  }
  return list;
}

export async function getPuppyBySlug(slug: string): Promise<PuppyRecord | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { pool, isDbCircuitOpen, recordDbFailure } = await resolveDb();
      if (!isDbCircuitOpen()) {
        const result = await pool.query<PuppyRecord>(
          `SELECT
            id, slug, name, breed, meta, media, href, door, origin, status,
            featured, price_aed, description, created_at, updated_at
           FROM puppies
           WHERE slug = $1
           LIMIT 1`,
          [slug],
        );
        if (result.rows[0]) {
          return result.rows[0];
        }
      }
    } catch {
      try {
        const { recordDbFailure } = await resolveDb();
        recordDbFailure();
      } catch {
        // Ignore
      }
    }
  }

  const staticAvail = findPuppy(slug);
  if (staticAvail) {
    return {
      id: `static-${slug}`,
      slug,
      name: staticAvail.name,
      breed: staticAvail.meta.split(",")[0].trim() || staticAvail.name,
      meta: staticAvail.meta,
      media: staticAvail.media,
      href: staticAvail.href,
      door: staticAvail.door,
      origin: staticAvail.origin,
      status: "available",
      featured: true,
      price_aed: staticAvail.origin === "imported" ? 16500 : 9500,
      description: `${staticAvail.name} is a healthy, vet-certified puppy ready for a warm and loving home in Dubai.`,
      created_at: new Date("2026-01-01T00:00:00Z"),
      updated_at: new Date("2026-01-01T00:00:00Z"),
    };
  }

  const gone = goneHome.find((g) => g.slug === slug);
  if (gone) {
    return {
      id: `static-${slug}`,
      slug,
      name: gone.name,
      breed: gone.name.split(" ")[0] || "Puppy",
      meta: gone.meta,
      media: "/media/3yOfnmoyPooH/81e0c7e00c/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg",
      href: `/puppies/${gone.slug}`,
      door: "#5a3a28",
      origin: "local",
      status: "gone_home",
      featured: false,
      price_aed: null,
      description: `${gone.name} has found their forever family!`,
      created_at: new Date("2025-12-01T00:00:00Z"),
      updated_at: new Date("2025-12-01T00:00:00Z"),
    };
  }

  return null;
}

export async function createPuppy(input: PuppyInput): Promise<PuppyRecord> {
  const { pool } = await resolveDb();
  const slug = input.slug || slugify(`${input.breed}-${input.name}`);
  const href = `/puppies/${slug}`;

  const result = await pool.query<PuppyRecord>(
    `INSERT INTO puppies
      (slug, name, breed, meta, media, href, door, origin, status, featured, price_aed, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [
      slug,
      input.name,
      input.breed,
      input.meta,
      input.media,
      href,
      input.door || "#a24a1a",
      input.origin || "local",
      input.status || "available",
      Boolean(input.featured),
      input.price_aed ?? null,
      input.description ?? null,
    ],
  );

  return result.rows[0];
}

export async function updatePuppy(
  id: string,
  updates: Partial<PuppyInput>,
): Promise<PuppyRecord | null> {
  const { pool } = await resolveDb();
  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  const allowed: (keyof PuppyInput)[] = [
    "name",
    "slug",
    "breed",
    "meta",
    "media",
    "door",
    "origin",
    "status",
    "featured",
    "price_aed",
    "description",
  ];

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      values.push(updates[key] as string | number | boolean | null);
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (updates.slug) {
    values.push(`/puppies/${updates.slug}`);
    fields.push(`href = $${values.length}`);
  }

  if (fields.length === 0) {
    const existing = await pool.query<PuppyRecord>(
      "SELECT * FROM puppies WHERE id = $1",
      [id],
    );
    return existing.rows[0] || null;
  }

  fields.push("updated_at = NOW()");
  values.push(id);

  const query = `
    UPDATE puppies
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query<PuppyRecord>(query, values);
  return result.rows[0] || null;
}

export async function deletePuppy(id: string): Promise<boolean> {
  const { pool } = await resolveDb();
  const result = await pool.query("DELETE FROM puppies WHERE id = $1 RETURNING id", [id]);
  return (result.rowCount ?? 0) > 0;
}
