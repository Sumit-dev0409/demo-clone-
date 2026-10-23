CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL,
  media TEXT NOT NULL,
  author VARCHAR(100),
  tilt NUMERIC(4, 2) NOT NULL DEFAULT 0,
  tape VARCHAR(30) NOT NULL DEFAULT '#f6d79a',
  tape_pos VARCHAR(30) NOT NULL DEFAULT 'center',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS faqs_order_idx ON faqs (display_order ASC);
CREATE INDEX IF NOT EXISTS reviews_order_idx ON reviews (display_order ASC);
