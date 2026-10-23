export const CDN = "https://puppy.instabizweb.com";

/** Build an optimized image URL identical to the source site's `/_next/image` endpoint. */
export function img(mediaPath: string, w = 1080): string {
  return `${CDN}/_next/image?url=${encodeURIComponent(mediaPath)}&w=${w}&q=75`;
}

export const WHATSAPP =
  "https://wa.me/971541676733?text=Hi%20TeddyPups!%20I%27d%20love%20to%20know%20more%20about%20your%20puppies.";

export type Puppy = {
  name: string;
  meta: string;
  media: string;
  href: string;
  door: string;
  /** Locally available in Dubai, or imported on request from an overseas breeder. */
  origin: "local" | "imported";
};

/** The six pups that "line up" in the hero stage. */
export const lineup: { name: string; media: string; href: string; x: number; w: string; peek: number; tilt: number }[] = [
  { name: "Max", media: "/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp", href: "/puppies/maltipoo-max-male", x: 9, w: "8.6rem", peek: 0.62, tilt: -5 },
  { name: "Korean Teacup Maltipoo", media: "/media/gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg", href: "/puppies/korean-teacup-maltipoo-female", x: 22.5, w: "10.4rem", peek: 0.8, tilt: 3 },
  { name: "Korean Teacup Poodle", media: "/media/xeMJCapr5vcU/e618c653b2/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg", href: "/puppies/korean-teacup-poodle-female", x: 35, w: "9.2rem", peek: 0.7, tilt: -2 },
  { name: "Maltipoo & Cavapoo", media: "/media/YQhey4j7uWvZ/3ea10db6c1/b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg", href: "/puppies/maltipoo-cavapoo-male", x: 65, w: "9.4rem", peek: 0.74, tilt: 3 },
  { name: "Toy Poodle", media: "/media/vMu0BPvkAZ-j/c65e53967d/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg", href: "/puppies/toy-poodle-male-female", x: 77.5, w: "10.6rem", peek: 0.82, tilt: -3 },
  { name: "Maltipoo", media: "/media/3WJNmn6VVgVu/732f779474/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg", href: "/puppies/maltipoo-female-2", x: 91, w: "8.4rem", peek: 0.6, tilt: 4 },
];

export const availablePuppies: Puppy[] = [
  { name: "Max", meta: "Maltipoo, boy, 3 months, with video", media: "/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp", href: "/puppies/maltipoo-max-male", door: "#a24a1a", origin: "local" },
  { name: "Korean Teacup Maltipoo", meta: "girl, 2 months, with video", media: "/media/gAaGwoGej2g6/5523e884dd/b942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg", href: "/puppies/korean-teacup-maltipoo-female", door: "#5a3a28", origin: "imported" },
  { name: "Korean Teacup Poodle", meta: "girl, 2 months", media: "/media/xeMJCapr5vcU/e618c653b2/b942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg", href: "/puppies/korean-teacup-poodle-female", door: "#d4893f", origin: "imported" },
  { name: "Maltipoo & Cavapoo", meta: "boy, 3 months Maltipoo & 2 months Cavapoo, with video", media: "/media/YQhey4j7uWvZ/3ea10db6c1/b942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg", href: "/puppies/maltipoo-cavapoo-male", door: "#b8644a", origin: "local" },
  { name: "Toy Poodle", meta: "boy & girl, 2 months", media: "/media/vMu0BPvkAZ-j/c65e53967d/b942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg", href: "/puppies/toy-poodle-male-female", door: "#7a4a2e", origin: "local" },
  { name: "Maltipoo", meta: "girl, 3 months, with video", media: "/media/3WJNmn6VVgVu/732f779474/b942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg", href: "/puppies/maltipoo-female-2", door: "#a24a1a", origin: "local" },
  { name: "Pomeranian", meta: "girl, 3 months", media: "/media/3yOfnmoyPooH/81e0c7e00c/b942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg", href: "/puppies/pomeranian-female", door: "#5a3a28", origin: "local" },
  { name: "Copper", meta: "Cavapoo, boy, 2 months", media: "/media/O-6w4FYqE10j/be76f399cc/b942a5_bb73ebbb952047988f944f3a8e3052bd-mv2.jpg", href: "/puppies/copper-male", door: "#d4893f", origin: "local" },
  { name: "Shih Tzu", meta: "girl, 2 months", media: "/media/qNrTCSrsYyzY/168fa8c4ff/b942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg", href: "/puppies/shitzu-female", door: "#b8644a", origin: "local" },
  { name: "Shih Tzu", meta: "boy, 2 months", media: "/media/crgs9ih6as_M/e37bafb1bf/b942a5_344e49c6c34940d2b09a3ddd5c2e3234-mv2.jpg", href: "/puppies/shitzu-male", door: "#7a4a2e", origin: "local" },
  { name: "Maltipoo", meta: "girl, 2.5 months", media: "/media/wNm2_VIBEQvK/4b68f59e75/b942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg", href: "/puppies/maltipoo-female-1", door: "#a24a1a", origin: "local" },
  { name: "Maltipoo", meta: "girl, 2 months", media: "/media/lMhASnmIIVQ4/ad2353ad31/b942a5_6a5617708d75408b8f73725080ed0149-mv2.jpg", href: "/puppies/maltipoo-female", door: "#5a3a28", origin: "local" },
  { name: "Korean Teacup Pomeranian", meta: "girl, 2 months", media: "/media/EsAq2LSRvVCJ/4d553ed044/b942a5_a8d264c1aa754d80bc7c98917dfd1fda-mv2.jpg", href: "/puppies/korean-teacup-pomeranian-1", door: "#d4893f", origin: "imported" },
  { name: "Korean Teacup Pomeranian", meta: "girl, 2 months", media: "/media/vzf7P8SPCZ-Q/a8db4ee114/b942a5_967bb346583b4146acb56607f5da5f21-mv2.jpg", href: "/puppies/korean-teacup-pomeranian", door: "#b8644a", origin: "imported" },
  { name: "Korean Teacup Pomeranian", meta: "boy, 2 months", media: "/media/nZTGFv46hrZI/fb9eeefc9c/b942a5_dcb8eb174915463ea0c40c58b7b0e406-mv2.jpg", href: "/puppies/korean-teacup-pomeranian-male", door: "#7a4a2e", origin: "imported" },
];

/** Look up a single puppy by the last segment of its `/puppies/...` link. */
export function findPuppy(slug: string) {
  return availablePuppies.find((p) => p.href === `/puppies/${slug}`);
}

/** Filter the available list by a `?breed=` slug or a `?origin=` value. */
export function filterPuppies(breed?: string, origin?: string) {
  return availablePuppies.filter((p) => {
    if (origin === "local" || origin === "imported") {
      if (p.origin !== origin) return false;
    }
    if (breed) {
      const needle = breed.replace(/-/g, " ");
      const haystack = `${p.name} ${p.meta}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export const showroomMedia = [
  "/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg",
  "/media/Vi-kzyvemRl4/e740ed8a24/27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg",
  "/media/g_e4ebbc7fyG/8276289ae7/27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg",
  "/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg",
];

export const passports: { title: string; text: string; ink: string; tilt: number }[] = [
  { title: "Vet-checked & healthy", text: "Every puppy comes vaccinated, dewormed, and with a verified health certificate.", ink: "#a24a1a", tilt: -8 },
  { title: "Korea to Dubai, safely", text: "Trusted breeders, safe travel, and premium care from start to finish.", ink: "#1f6b45", tilt: 5 },
  { title: "Support 24/7", text: "Always here to help, from choosing your puppy to post-delivery support.", ink: "#5a3a28", tilt: -4 },
  { title: "Trusted by families worldwide", text: "Puppies delivered to loving homes all around the world.", ink: "#c2622b", tilt: 7 },
];

export const polaroids: { caption: string; media: string; tilt: number; tape: string; tapePos: string }[] = [
  { caption: "Lulu 🧸 with her new mummy ❤️", media: "/media/dI8Jv0KRTiLJ/d2d7e5375b/27b888_7d940ce5701f48d98327e4a242b53ac4-mv2.jpg", tilt: -2.2, tape: "#f6d79a", tapePos: "center" },
  { caption: "Adorable Maltipoo baby 🧸❤️", media: "/media/TI-WtaFssfQt/c41fb2a387/27b888_15920f828b864dd1b44b98ec4e964c53-mv2.jpg", tilt: 1.6, tape: "#f9cdbf", tapePos: "left" },
  { caption: "My new teddy puppy 🥰🧸", media: "/media/j6T9eswP2eS8/59c6879a1d/27b888_bc27df54dcce410196c6016475364ff3-mv2.jpg", tilt: -0.9, tape: "#cfe5f6", tapePos: "right" },
  { caption: "Our new puppies 🧸🥰🤗", media: "/media/HJgL4rRnmReV/533701358f/27b888_082e47dfd8144423a96dc70d966fa5b2-mv2.jpg", tilt: 2.4, tape: "#f6d79a", tapePos: "tl" },
  { caption: "New puppy 🧸😍", media: "/media/uc5ANs5jm7r7/7160d8b7b1/27b888_f7f4966e59e94db591784d4ec546682f-mv2.jpg", tilt: -1.5, tape: "#e9dcc4", tapePos: "center" },
  { caption: "Gang of 3 😍🧸", media: "/media/pRJubyqHw8p7/d58c4c07ee/27b888_b073c5815f7c4f92ad9a57741a653663-mv2.jpg", tilt: 0.8, tape: "#f6d79a", tapePos: "right" },
  { caption: "So happy 😍😍", media: "/media/4wOJk9azop_-/65ecf66bf0/27b888_cfe895dbcc2d4bff85f890be9b496543-mv2.jpg", tilt: -2.6, tape: "#f9cdbf", tapePos: "left" },
  { caption: "New pup 🤗💫", media: "/media/3h20rIasJCOa/10c307cb1c/27b888_a7e7ab6a931e4c79a798bab9927d396e-mv2.jpg", tilt: 1.2, tape: "#cfe5f6", tapePos: "center" },
];

export const faqs: { q: string; a: string }[] = [
  { q: "Are your puppies vaccinated and health-checked?", a: "Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family." },
  { q: "Can I meet a puppy before I decide?", a: "Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision." },
  { q: "Can I take my puppy home the same day?", a: "Local puppies are available immediately, so you can take your puppy home the same day." },
];

/** The full list shown on the dedicated FAQ page. */
export const faqsFull: { q: string; a: string }[] = [
  ...faqs,
  { q: "Can I import a puppy from abroad?", a: "Yes. Alongside the puppies available here in Dubai, we can source premium teacup breeds from trusted overseas breeders on request." },
  { q: "How do imported puppies travel?", a: "Imported puppies travel in a temperature-controlled cabin with a trusted pet travel partner. We share updates at every stage, from departure to arrival in Dubai." },
  { q: "Can I see photos and health details before deciding?", a: "Always. We send real photos, videos, and full health details on WhatsApp so you know exactly which puppy you're bringing home." },
  { q: "Do you deliver?", a: "Yes. We offer safe delivery across the UAE and can arrange hand-over in our Downtown Dubai showroom if you'd prefer to collect in person." },
  { q: "Which breeds do you have?", a: "Maltipoo, Pomeranian, Toy Poodle, Cavapoo, and Shih Tzu — including Korean teacup lines. Tell us what you're looking for and we'll guide you." },
  { q: "Will you help after my puppy comes home?", a: "Of course. Our team stays in touch after collection to help with settling in, feeding, and any questions you have in those first weeks." },
];

/** Puppies who already found their families, shown on the listing page. */
export const goneHome: { name: string; meta: string; slug: string }[] = [
  { name: "Blue Marle Pomeranian", meta: "boy", slug: "blue-marle-pomeranian" },
  { name: "Maltipoo", meta: "Mia, girl", slug: "maltipoo-mia-girl" },
  { name: "Maltipoo", meta: "Sadie, girl", slug: "maltipoo-sadie-girl" },
  { name: "Pomeranian", meta: "Ace, boy", slug: "pomeranian-ace-boy" },
  { name: "Poodle", meta: "Leo, boy", slug: "poodle-leo-male" },
];

/** Number of happy-family moments shown on the wall. */
export const familyCount = 64;

/** The two lanes on the "How it works" page. */
export const lanes: {
  id: string;
  tag: string;
  badge: string;
  place: string;
  steps: { title: string; text: string }[];
}[] = [
  {
    id: "local",
    tag: "Local",
    badge: "meet in person",
    place: "Downtown Dubai",
    steps: [
      { title: "Explore our puppies", text: "Browse the available puppies and their real photos, or message us for the latest arrivals." },
      { title: "Choose your puppy", text: "Tell us about your family and lifestyle, and we'll help you find the perfect match." },
      { title: "Meet before you choose", text: "Visit our Downtown Dubai showroom and spend time with your puppy before deciding." },
      { title: "Pick-up or delivery", text: "Take your puppy home the same day, or have us deliver safely anywhere in the UAE." },
    ],
  },
  {
    id: "imported",
    tag: "Imported",
    badge: "order upon request",
    place: "Europe · Korea → Dubai",
    steps: [
      { title: "Reserve your puppy", text: "Pick a premium teacup breed from our trusted overseas breeder network and reserve it." },
      { title: "Personalized consultation", text: "We walk you through the breed, health details, paperwork, and what to expect." },
      { title: "Import and arrival", text: "We handle the safe, stress-free import and keep you updated until arrival in Dubai." },
      { title: "Welcome home", text: "Collect your puppy in Dubai and get post-arrival support from our team." },
    ],
  },
];

/** The premium puppy promise cards on the "How it works" page. */
export const promises: { title: string; text: string }[] = [
  { title: "Hand-selected breeders", text: "We work only with breeders we know and trust, so every puppy comes from healthy, well-cared-for parents." },
  { title: "Full transparency", text: "Real photos, honest health details, and no surprises — you always know exactly what you're getting." },
  { title: "Safe, stress-free delivery", text: "From Dubai showroom pick-up to international import, your puppy travels comfortably and safely." },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Puppies", href: "/puppies" },
  { label: "Happy families", href: "/happy-families" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "Visit & contact", href: "/contact" },
];

export const TELEPHONE = "+971 54 167 6733";
export const EMAIL = "teddypupsadmin@gmail.com";
export const ADDRESS = "Downtown Dubai, United Arab Emirates";
export const SLOGAN = "every puppy is family";

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/teddypups.worldwide/" },
  { label: "TikTok", href: "https://www.tiktok.com/@teddypupsuae" },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61567496944539",
  },
];

export const breeds = [
  { label: "Maltipoo", href: "/puppies?breed=maltipoo" },
  { label: "Pomeranian", href: "/puppies?breed=pomeranian" },
  { label: "Poodle", href: "/puppies?breed=poodle" },
  { label: "Cavapoo", href: "/puppies?breed=cavapoo" },
  { label: "Shih Tzu", href: "/puppies?breed=shih-tzu" },
];

export const journeySteps = [
  {
    title: "Choose your breed",
    text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
    tint: "#fbe3b4",
  },
  {
    title: "Get photos & details",
    text: "Our team will share real photos, health details, and all necessary information directly on WhatsApp.",
    tint: "#f9cdbf",
  },
  {
    title: "Secure & safe delivery",
    text: "Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.",
    tint: "#dce9c8",
  },
];

export const testimonial = {
  quote:
    "TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.",
  author: "Sarah M., Dubai, UAE",
};