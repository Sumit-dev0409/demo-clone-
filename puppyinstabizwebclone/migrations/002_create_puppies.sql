CREATE TABLE IF NOT EXISTS puppies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  meta VARCHAR(255) NOT NULL,
  media TEXT NOT NULL,
  href VARCHAR(255) NOT NULL,
  door VARCHAR(30) DEFAULT '#a24a1a',
  origin VARCHAR(30) NOT NULL DEFAULT 'local',
  status VARCHAR(30) NOT NULL DEFAULT 'available',
  featured BOOLEAN NOT NULL DEFAULT false,
  price_aed NUMERIC(10, 2),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS puppies_status_idx ON puppies (status);
CREATE INDEX IF NOT EXISTS puppies_origin_idx ON puppies (origin);
CREATE INDEX IF NOT EXISTS puppies_breed_idx ON puppies (breed);
CREATE INDEX IF NOT EXISTS puppies_featured_idx ON puppies (featured);
