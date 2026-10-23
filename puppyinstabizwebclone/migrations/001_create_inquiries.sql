CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  email VARCHAR(254),
  location VARCHAR(120),
  curious VARCHAR(100) NOT NULL,
  interest VARCHAR(160) NOT NULL,
  message VARCHAR(2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx
  ON inquiries (created_at DESC);
