import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;

// Load local .env file if present
const envPath = fileURLToPath(new URL("../.env", import.meta.url));
if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Ignore
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set before running seeds.");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });

const initialPuppies = [
  {
    name: "Max",
    slug: "maltipoo-max-male",
    breed: "Maltipoo",
    meta: "Maltipoo, boy, 3 months, with video",
    media: "/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp",
    href: "/puppies/maltipoo-max-male",
    door: "#a24a1a",
    origin: "local",
    status: "available",
    featured: true,
    price_aed: 9500,
    description: "Max is an energetic and affectionate Maltipoo boy with rich apricot curls. He has passed all clinical vet health checks and is ready for his forever home in Dubai."
  },
  {
    name: "Korean Teacup Maltipoo",
    slug: "korean-teacup-maltipoo-female",
    breed: "Maltipoo",
    meta: "girl, 2 months, with video",
    media: "/media/gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg",
    href: "/puppies/korean-teacup-maltipoo-female",
    door: "#5a3a28",
    origin: "imported",
    status: "available",
    featured: true,
    price_aed: 16500,
    description: "Exquisite Korean teacup Maltipoo girl with doll-face features, compact anatomy, and pedigree certification. Travel-ready with verified health documentation."
  },
  {
    name: "Korean Teacup Poodle",
    slug: "korean-teacup-poodle-female",
    breed: "Poodle",
    meta: "girl, 2 months",
    media: "/media/xeMJCapr5vcU/e618c653b2/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg",
    href: "/puppies/korean-teacup-poodle-female",
    door: "#d4893f",
    origin: "imported",
    status: "available",
    featured: true,
    price_aed: 15500,
    description: "Tiny silver-beige Korean teacup poodle princess. Intelligent, hypo-allergenic, and gentle with children."
  },
  {
    name: "Maltipoo & Cavapoo",
    slug: "maltipoo-cavapoo-male",
    breed: "Maltipoo",
    meta: "boy, 3 months Maltipoo & 2 months Cavapoo, with video",
    media: "/media/YQhey4j7uWvZ/3ea10db6c1/b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg",
    href: "/puppies/maltipoo-cavapoo-male",
    door: "#b8644a",
    origin: "local",
    status: "available",
    featured: true,
    price_aed: 10500,
    description: "Playful boy duo available for showroom visits. Loving, gentle demeanor and microchipped."
  },
  {
    name: "Toy Poodle",
    slug: "toy-poodle-male-female",
    breed: "Poodle",
    meta: "boy & girl, 2 months",
    media: "/media/vMu0BPvkAZ-j/c65e53967d/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg",
    href: "/puppies/toy-poodle-male-female",
    door: "#7a4a2e",
    origin: "local",
    status: "available",
    featured: true,
    price_aed: 9800,
    description: "Teddy-bear faced toy poodle siblings in warm apricot tones. Vaccinated and ready for pickup."
  },
  {
    name: "Maltipoo",
    slug: "maltipoo-female-2",
    breed: "Maltipoo",
    meta: "girl, 3 months, with video",
    media: "/media/3WJNmn6VVgVu/732f779474/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg",
    href: "/puppies/maltipoo-female-2",
    door: "#a24a1a",
    origin: "local",
    status: "available",
    featured: true,
    price_aed: 11000,
    description: "Gentle female Maltipoo with fluffy cream coat and bright eyes. Fully vaccinated."
  },
  {
    name: "Pomeranian",
    slug: "pomeranian-female",
    breed: "Pomeranian",
    meta: "girl, 3 months",
    media: "/media/3yOfnmoyPooH/81e0c7e00c/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg",
    href: "/puppies/pomeranian-female",
    door: "#5a3a28",
    origin: "local",
    status: "available",
    featured: false,
    price_aed: 9000,
    description: "Fluffy snow-white Pomeranian female. Playful, affectionate, and showroom-ready."
  },
  {
    name: "Copper",
    slug: "copper-male",
    breed: "Cavapoo",
    meta: "Cavapoo, boy, 2 months",
    media: "/media/O-6w4FYqE10j/be76f399cc/b942a5_bb73ebbb952047988f944f3a8e3052bd-mv2.jpg",
    href: "/puppies/copper-male",
    door: "#d4893f",
    origin: "local",
    status: "available",
    featured: false,
    price_aed: 11500,
    description: "Copper is a gorgeous ruby-colored Cavapoo boy with soft wavy fleece and puppy eyes."
  },
  {
    name: "Shih Tzu",
    slug: "shitzu-female",
    breed: "Shih Tzu",
    meta: "girl, 2 months",
    media: "/media/qNrTCSrsYyzY/168fa8c4ff/b942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg",
    href: "/puppies/shitzu-female",
    door: "#b8644a",
    origin: "local",
    status: "available",
    featured: false,
    price_aed: 8500,
    description: "Calm and friendly Shih Tzu girl with classic tricolor coat. Ideal companion pet."
  },
  {
    name: "Shih Tzu",
    slug: "shitzu-male",
    breed: "Shih Tzu",
    meta: "boy, 2 months",
    media: "/media/crgs9ih6as_M/e37bafb1bf/b942a5_344e49c6c34940d2b09a3ddd5c2e3234-mv2.jpg",
    href: "/puppies/shitzu-male",
    door: "#7a4a2e",
    origin: "local",
    status: "available",
    featured: false,
    price_aed: 8500,
    description: "Handsome Shih Tzu boy, super friendly and accustomed to indoor family living."
  },
  {
    name: "Maltipoo",
    slug: "maltipoo-female-1",
    breed: "Maltipoo",
    meta: "girl, 2.5 months",
    media: "/media/wNm2_VIBEQvK/4b68f59e75/b942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg",
    href: "/puppies/maltipoo-female-1",
    door: "#a24a1a",
    origin: "local",
    status: "available",
    featured: false,
    price_aed: 10000,
    description: "Sweet natured Maltipoo girl, champion parentage, microchipped with vet passport."
  },
  {
    name: "Maltipoo",
    slug: "maltipoo-female",
    breed: "Maltipoo",
    meta: "girl, 2 months",
    media: "/media/lMhASnmIIVQ4/ad2353ad31/b942a5_6a5617708d75408b8f73725080ed0149-mv2.jpg",
    href: "/puppies/maltipoo-female",
    door: "#5a3a28",
    origin: "local",
    status: "available",
    featured: false,
    price_aed: 10000,
    description: "Playful teddy bear girl. Non-shedding coat and very easy to train."
  },
  {
    name: "Korean Teacup Pomeranian",
    slug: "korean-teacup-pomeranian-1",
    breed: "Pomeranian",
    meta: "girl, 2 months",
    media: "/media/EsAq2LSRvVCJ/4d553ed044/b942a5_a8d264c1aa754d80bc7c98917dfd1fda-mv2.jpg",
    href: "/puppies/korean-teacup-pomeranian-1",
    door: "#d4893f",
    origin: "imported",
    status: "available",
    featured: false,
    price_aed: 17000,
    description: "Ultra compact Korean teacup Pomeranian female with plush snow coat and tiny muzzle."
  },
  {
    name: "Korean Teacup Pomeranian",
    slug: "korean-teacup-pomeranian",
    breed: "Pomeranian",
    meta: "girl, 2 months",
    media: "/media/vzf7P8SPCZ-Q/a8db4ee114/b942a5_967bb346583b4146acb56607f5da5f21-mv2.jpg",
    href: "/puppies/korean-teacup-pomeranian",
    door: "#b8644a",
    origin: "imported",
    status: "available",
    featured: false,
    price_aed: 17000,
    description: "Cream white Korean teacup Pomeranian, vaccinated with Korean pedigree documents."
  },
  {
    name: "Korean Teacup Pomeranian",
    slug: "korean-teacup-pomeranian-male",
    breed: "Pomeranian",
    meta: "boy, 2 months",
    media: "/media/nZTGFv46hrZI/fb9eeefc9c/b942a5_dcb8eb174915463ea0c40c58b7b0e406-mv2.jpg",
    href: "/puppies/korean-teacup-pomeranian-male",
    door: "#7a4a2e",
    origin: "imported",
    status: "available",
    featured: false,
    price_aed: 16000,
    description: "Rare micro Pomeranian boy, playful temperament, guaranteed healthy."
  },
  // Gone home puppies
  {
    name: "Blue Marle Pomeranian",
    slug: "blue-marle-pomeranian",
    breed: "Pomeranian",
    meta: "boy",
    media: "/media/3yOfnmoyPooH/81e0c7e00c/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg",
    href: "/puppies/blue-marle-pomeranian",
    door: "#5a3a28",
    origin: "local",
    status: "gone_home",
    featured: false,
    price_aed: 12000,
    description: "Found his loving family in Dubai Marina."
  },
  {
    name: "Maltipoo",
    slug: "maltipoo-mia-girl",
    breed: "Maltipoo",
    meta: "Mia, girl",
    media: "/media/wNm2_VIBEQvK/4b68f59e75/b942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg",
    href: "/puppies/maltipoo-mia-girl",
    door: "#a24a1a",
    origin: "local",
    status: "gone_home",
    featured: false,
    price_aed: 10000,
    description: "Happily adopted by a loving family in Arabian Ranches."
  },
  {
    name: "Maltipoo",
    slug: "maltipoo-sadie-girl",
    breed: "Maltipoo",
    meta: "Sadie, girl",
    media: "/media/3WJNmn6VVgVu/732f779474/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg",
    href: "/puppies/maltipoo-sadie-girl",
    door: "#a24a1a",
    origin: "local",
    status: "gone_home",
    featured: false,
    price_aed: 10500,
    description: "Now living happily with her new parents in Palm Jumeirah."
  },
  {
    name: "Pomeranian",
    slug: "pomeranian-ace-boy",
    breed: "Pomeranian",
    meta: "Ace, boy",
    media: "/media/nZTGFv46hrZI/fb9eeefc9c/b942a5_dcb8eb174915463ea0c40c58b7b0e406-mv2.jpg",
    href: "/puppies/pomeranian-ace-boy",
    door: "#7a4a2e",
    origin: "imported",
    status: "gone_home",
    featured: false,
    price_aed: 16500,
    description: "Living his best life with his family in Abu Dhabi."
  },
  {
    name: "Poodle",
    slug: "poodle-leo-male",
    breed: "Poodle",
    meta: "Leo, boy",
    media: "/media/vMu0BPvkAZ-j/c65e53967d/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg",
    href: "/puppies/poodle-leo-male",
    door: "#7a4a2e",
    origin: "local",
    status: "gone_home",
    featured: false,
    price_aed: 9800,
    description: "Adopted by a family in Downtown Dubai."
  }
];

const initialFaqs = [
  { q: "Are your puppies vaccinated and health-checked?", a: "Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.", order: 1 },
  { q: "Can I meet a puppy before I decide?", a: "Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision.", order: 2 },
  { q: "Can I take my puppy home the same day?", a: "Local puppies are available immediately, so you can take your puppy home the same day.", order: 3 },
  { q: "Can I import a puppy from abroad?", a: "Yes. Alongside the puppies available here in Dubai, we can source premium teacup breeds from trusted overseas breeders on request.", order: 4 },
  { q: "How do imported puppies travel?", a: "Imported puppies travel in a temperature-controlled cabin with a trusted pet travel partner. We share updates at every stage, from departure to arrival in Dubai.", order: 5 },
  { q: "Can I see photos and health details before deciding?", a: "Always. We send real photos, videos, and full health details on WhatsApp so you know exactly which puppy you're bringing home.", order: 6 },
  { q: "Do you deliver?", a: "Yes. We offer safe delivery across the UAE and can arrange hand-over in our Downtown Dubai showroom if you'd prefer to collect in person.", order: 7 },
  { q: "Which breeds do you have?", a: "Maltipoo, Pomeranian, Toy Poodle, Cavapoo, and Shih Tzu — including Korean teacup lines. Tell us what you're looking for and we'll guide you.", order: 8 },
  { q: "Will you help after my puppy comes home?", a: "Of course. Our team stays in touch after collection to help with settling in, feeding, and any questions you have in those first weeks.", order: 9 }
];

try {
  await client.connect();
  console.log("Connected to PostgreSQL database. Starting seed...");

  // Seed Puppies
  for (const pup of initialPuppies) {
    await client.query(`
      INSERT INTO puppies (slug, name, breed, meta, media, href, door, origin, status, featured, price_aed, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        breed = EXCLUDED.breed,
        meta = EXCLUDED.meta,
        media = EXCLUDED.media,
        door = EXCLUDED.door,
        origin = EXCLUDED.origin,
        status = EXCLUDED.status,
        featured = EXCLUDED.featured,
        price_aed = EXCLUDED.price_aed,
        description = EXCLUDED.description,
        updated_at = NOW();
    `, [
      pup.slug,
      pup.name,
      pup.breed,
      pup.meta,
      pup.media,
      pup.href,
      pup.door,
      pup.origin,
      pup.status,
      pup.featured,
      pup.price_aed,
      pup.description
    ]);
  }
  console.log(`✓ Seeded ${initialPuppies.length} puppies.`);

  // Seed FAQs
  for (const faq of initialFaqs) {
    await client.query(`
      INSERT INTO faqs (question, answer, display_order)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING;
    `, [faq.q, faq.a, faq.order]);
  }
  console.log(`✓ Seeded ${initialFaqs.length} FAQs.`);

  // Check and seed sample inquiries if table is empty
  const inqCountResult = await client.query("SELECT COUNT(*) AS count FROM inquiries");
  if (parseInt(inqCountResult.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO inquiries (name, phone, email, location, curious, interest, message, status, notes)
      VALUES
        ('Sophia Al-Mansoor', '+971 50 987 6543', 'sophia@example.com', 'Downtown Dubai', 'Maltipoo', 'Max', 'We would love to visit the showroom this Friday afternoon to meet Max.', 'new', 'Interested in showroom visit Friday.'),
        ('David Miller', '+971 55 432 1098', 'david.m@example.com', 'Palm Jumeirah', 'Korean Teacup Poodle', 'Korean Teacup Poodle', 'Please share recent videos of the teacup poodle girl.', 'contacted', 'Sent video on WhatsApp 23/10.');
    `);
    console.log("✓ Seeded sample inquiries for CRM testing.");
  }

  console.log("Database seeding completed successfully.");
} catch (error) {
  console.error("Database seeder failed:", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
