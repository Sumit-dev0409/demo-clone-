"use client";

import { useEffect, useState } from "react";
import type { InquiryRecord, InquiryStatus } from "@/lib/inquiries";
import type { PuppyRecord } from "@/lib/puppies";
import { breeds, img } from "@/lib/data";

type HealthData = {
  status: string;
  database: string;
  latency_ms?: number;
  db_time?: string;
  migrations_applied?: number;
  timestamp?: string;
};

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"inquiries" | "puppies" | "system">("inquiries");

  // Inquiries State
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("all");
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryActionMessage, setInquiryActionMessage] = useState("");

  // Puppies State
  const [puppies, setPuppies] = useState<PuppyRecord[]>([]);
  const [puppiesLoading, setPuppiesLoading] = useState(false);
  const [showAddPuppy, setShowAddPuppy] = useState(false);
  const [newPuppy, setNewPuppy] = useState({
    name: "",
    breed: "Maltipoo",
    origin: "local",
    meta: "boy, 2 months",
    media: "/media/Z0ToauDx7Eve/5fffe4d022/b942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp",
    door: "#a24a1a",
    price_aed: "9500",
    description: "",
  });

  // Health State
  const [health, setHealth] = useState<HealthData | null>(null);

  // Initialize from localStorage or cookie
  useEffect(() => {
    const saved = localStorage.getItem("teddypups_admin_key");
    if (saved) {
      setApiKey(saved);
      verifyAuth(saved);
    }
    fetchHealth();
  }, []);

  async function fetchHealth() {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({ status: "unavailable", database: "unreachable" });
    }
  }

  async function verifyAuth(keyToTest: string) {
    setAuthError("");
    try {
      const res = await fetch("/api/v1/inquiries?limit=1", {
        headers: { "x-admin-key": keyToTest },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("teddypups_admin_key", keyToTest);
        loadInquiries(keyToTest, inquiryStatusFilter);
        loadPuppies();
      } else {
        setAuthError("Invalid Admin Key. Please verify your credentials.");
        setIsAuthenticated(false);
      }
    } catch {
      setAuthError("Failed to reach server. Please check your connection.");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) return;
    await verifyAuth(apiKey.trim());
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem("teddypups_admin_key");
    setApiKey("");
  }

  async function loadInquiries(key: string = apiKey, status: string = inquiryStatusFilter) {
    setInquiriesLoading(true);
    try {
      const url = status === "all" ? "/api/v1/inquiries?limit=100" : `/api/v1/inquiries?status=${status}&limit=100`;
      const res = await fetch(url, {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInquiriesLoading(false);
    }
  }

  async function loadPuppies() {
    setPuppiesLoading(true);
    try {
      const res = await fetch("/api/v1/puppies?limit=100");
      if (res.ok) {
        const data = await res.json();
        setPuppies(data.puppies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPuppiesLoading(false);
    }
  }

  async function updateInquiryState(id: string, newStatus: InquiryStatus, notes?: string) {
    try {
      const res = await fetch(`/api/v1/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": apiKey,
        },
        body: JSON.stringify({ status: newStatus, notes }),
      });
      if (res.ok) {
        setInquiryActionMessage(`Inquiry marked as ${newStatus}.`);
        setTimeout(() => setInquiryActionMessage(""), 3000);
        loadInquiries(apiKey, inquiryStatusFilter);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function updatePuppyState(slug: string, newStatus: string) {
    try {
      const res = await fetch(`/api/v1/puppies/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": apiKey,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadPuppies();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreatePuppy(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/puppies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": apiKey,
        },
        body: JSON.stringify({
          ...newPuppy,
          price_aed: Number(newPuppy.price_aed) || null,
        }),
      });
      if (res.ok) {
        setShowAddPuppy(false);
        loadPuppies();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create puppy.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="tp-page min-h-screen bg-[#fffdf8] pb-24 pt-10">
      <div className="gutter mx-auto max-w-[110rem]">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[var(--color-toffee)]/30 pb-6">
          <div>
            <p className="tp-kicker font-scrawl">Staff Portal</p>
            <h1 className="tp-title font-plush text-3xl md:text-4xl">TeddyPups Operations</h1>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
                Staff Authenticated
              </span>
              <button onClick={handleLogout} className="btn btn-ghost text-sm py-1.5 px-3">
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Authentication Card if not logged in */}
        {!isAuthenticated ? (
          <div className="mx-auto mt-12 max-w-md rounded-3xl border border-[var(--color-toffee)]/40 bg-white p-8 shadow-sm">
            <h2 className="font-plush text-2xl text-[var(--color-cocoa)]">Admin Verification</h2>
            <p className="mt-2 text-sm text-[var(--color-cocoa-soft)]">
              Enter your secret staff API key to access live inquiries, puppy inventory, and database operations.
            </p>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-cocoa)]">
                  Admin API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter ADMIN_API_KEY"
                  className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-3 text-sm focus:outline-none"
                  required
                />
              </div>
              {authError && <p className="text-sm text-red-600">{authError}</p>}
              <button type="submit" className="btn btn-primary w-full justify-center">
                Access Operations Portal
              </button>
            </form>
            <div className="mt-6 border-t border-[var(--color-toffee)]/20 pt-4 text-xs text-[var(--color-cocoa-soft)]">
              Tip: Development default key is configured in your local <code className="bg-amber-50 px-1 py-0.5 rounded">.env</code>.
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* System Status Banner */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[var(--color-toffee)]/30 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-cocoa-soft)]">
                  Database Status
                </span>
                <p className="mt-1 flex items-center gap-2 font-plush text-2xl text-[var(--color-cocoa)]">
                  <span
                    className={`size-2.5 rounded-full ${
                      health?.database === "connected" || health?.database === "ok"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />
                  {health?.database === "connected" || health?.database === "ok" ? "Connected" : "Fallback / Offline"}
                </p>
                <p className="mt-1 text-xs text-[var(--color-cocoa-soft)]">
                  Latency: {health?.latency_ms ?? "—"} ms
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-toffee)]/30 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-cocoa-soft)]">
                  Total Enquiries
                </span>
                <p className="mt-1 font-plush text-2xl text-[var(--color-cocoa)]">
                  {inquiries.length} Leads
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  {inquiries.filter((i) => i.status === "new").length} pending contact
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-toffee)]/30 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-cocoa-soft)]">
                  Puppies in Catalog
                </span>
                <p className="mt-1 font-plush text-2xl text-[var(--color-cocoa)]">
                  {puppies.length} Total
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  {puppies.filter((p) => p.status === "available").length} available for adoption
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-toffee)]/30 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-cocoa-soft)]">
                  Migrations Applied
                </span>
                <p className="mt-1 font-plush text-2xl text-[var(--color-cocoa)]">
                  {health?.migrations_applied ?? "—"} Versions
                </p>
                <p className="mt-1 text-xs text-[var(--color-cocoa-soft)]">PostgreSQL 16 Schema</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[var(--color-toffee)]/30">
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`border-b-2 px-6 py-3 font-semibold transition-colors ${
                  activeTab === "inquiries"
                    ? "border-[var(--color-cocoa)] text-[var(--color-cocoa)]"
                    : "border-transparent text-[var(--color-cocoa-soft)] hover:text-[var(--color-cocoa)]"
                }`}
              >
                Inquiries & Leads ({inquiries.length})
              </button>
              <button
                onClick={() => setActiveTab("puppies")}
                className={`border-b-2 px-6 py-3 font-semibold transition-colors ${
                  activeTab === "puppies"
                    ? "border-[var(--color-cocoa)] text-[var(--color-cocoa)]"
                    : "border-transparent text-[var(--color-cocoa-soft)] hover:text-[var(--color-cocoa)]"
                }`}
              >
                Puppy Inventory ({puppies.length})
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`border-b-2 px-6 py-3 font-semibold transition-colors ${
                  activeTab === "system"
                    ? "border-[var(--color-cocoa)] text-[var(--color-cocoa)]"
                    : "border-transparent text-[var(--color-cocoa-soft)] hover:text-[var(--color-cocoa)]"
                }`}
              >
                System & API Health
              </button>
            </div>

            {/* Inquiries Tab */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-[var(--color-cocoa-soft)]">Filter:</span>
                    {["all", "new", "contacted", "resolved", "archived"].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setInquiryStatusFilter(st);
                          loadInquiries(apiKey, st);
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                          inquiryStatusFilter === st
                            ? "bg-[var(--color-cocoa)] text-white"
                            : "bg-amber-100/60 text-[var(--color-cocoa)] hover:bg-amber-100"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  {inquiryActionMessage && (
                    <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                      {inquiryActionMessage}
                    </span>
                  )}
                </div>

                {inquiriesLoading ? (
                  <p className="py-12 text-center text-[var(--color-cocoa-soft)]">Loading customer enquiries...</p>
                ) : inquiries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--color-toffee)] p-12 text-center">
                    <p className="font-plush text-lg text-[var(--color-cocoa)]">No enquiries found</p>
                    <p className="mt-1 text-sm text-[var(--color-cocoa-soft)]">
                      New enquiries submitted via the contact form will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {inquiries.map((inq) => {
                      const cleanPhone = inq.phone.replace(/[^\d+]/g, "");
                      const waLink = `https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(
                        `Hi ${inq.name}! Thank you for reaching out to TeddyPups regarding ${inq.interest || inq.curious}. How can we assist you today?`,
                      )}`;

                      return (
                        <div
                          key={inq.id}
                          className="flex flex-col justify-between rounded-2xl border border-[var(--color-toffee)]/30 bg-white p-5 shadow-xs transition-shadow hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-plush text-lg font-bold text-[var(--color-cocoa)]">{inq.name}</h3>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                                  inq.status === "new"
                                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                                    : inq.status === "contacted"
                                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                                    : inq.status === "resolved"
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {inq.status}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-[var(--color-cocoa-soft)]">
                              {new Date(inq.created_at).toLocaleString()}
                            </p>

                            <div className="mt-4 space-y-1.5 text-xs text-[var(--color-cocoa)]">
                              <p>
                                <span className="font-semibold">Phone:</span> {inq.phone}
                              </p>
                              {inq.email && (
                                <p>
                                  <span className="font-semibold">Email:</span> {inq.email}
                                </p>
                              )}
                              {inq.location && (
                                <p>
                                  <span className="font-semibold">Location:</span> {inq.location}
                                </p>
                              )}
                              <p>
                                <span className="font-semibold">Curious about:</span> {inq.curious}
                              </p>
                              <p>
                                <span className="font-semibold">Selected Pup:</span> {inq.interest}
                              </p>
                              {inq.message && (
                                <div className="mt-2 rounded-xl bg-amber-50/70 p-2.5 italic text-[var(--color-cocoa)]">
                                  &ldquo;{inq.message}&rdquo;
                                </div>
                              )}
                              {inq.notes && (
                                <p className="mt-2 text-xs font-medium text-emerald-800">
                                  Staff Note: {inq.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 border-t border-[var(--color-toffee)]/20 pt-4">
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp text-xs py-1.5 px-3"
                              >
                                WhatsApp Customer
                              </a>
                              <a href={`tel:${cleanPhone}`} className="btn btn-ghost text-xs py-1.5 px-3">
                                Call
                              </a>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs">
                              <span className="font-semibold text-[var(--color-cocoa-soft)]">Change status:</span>
                              <div className="flex gap-1">
                                {(["new", "contacted", "resolved"] as InquiryStatus[]).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => updateInquiryState(inq.id, st)}
                                    disabled={inq.status === st}
                                    className={`rounded px-2 py-0.5 capitalize text-xs ${
                                      inq.status === st
                                        ? "bg-gray-200 text-gray-500 cursor-default"
                                        : "bg-amber-100 hover:bg-amber-200 text-[var(--color-cocoa)]"
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Puppies Tab */}
            {activeTab === "puppies" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-plush text-xl text-[var(--color-cocoa)]">Available & Adopted Puppies</h2>
                  <button
                    onClick={() => setShowAddPuppy(!showAddPuppy)}
                    className="btn btn-primary text-xs py-2 px-4"
                  >
                    {showAddPuppy ? "Close Form" : "+ Add New Puppy"}
                  </button>
                </div>

                {showAddPuppy && (
                  <form
                    onSubmit={handleCreatePuppy}
                    className="rounded-3xl border border-[var(--color-toffee)]/40 bg-white p-6 shadow-sm space-y-4"
                  >
                    <h3 className="font-plush text-lg text-[var(--color-cocoa)]">New Puppy Profile</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-cocoa)]">Puppy Name</label>
                        <input
                          type="text"
                          required
                          value={newPuppy.name}
                          onChange={(e) => setNewPuppy({ ...newPuppy, name: e.target.value })}
                          className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-2 text-sm"
                          placeholder="e.g. Bella"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-cocoa)]">Breed</label>
                        <select
                          value={newPuppy.breed}
                          onChange={(e) => setNewPuppy({ ...newPuppy, breed: e.target.value })}
                          className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-2 text-sm"
                        >
                          {breeds.map((b) => (
                            <option key={b.label} value={b.label}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-cocoa)]">Origin</label>
                        <select
                          value={newPuppy.origin}
                          onChange={(e) => setNewPuppy({ ...newPuppy, origin: e.target.value })}
                          className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-2 text-sm"
                        >
                          <option value="local">In Dubai (Showroom)</option>
                          <option value="imported">Imported (Korea/Europe)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-cocoa)]">Summary Meta</label>
                        <input
                          type="text"
                          required
                          value={newPuppy.meta}
                          onChange={(e) => setNewPuppy({ ...newPuppy, meta: e.target.value })}
                          className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-2 text-sm"
                          placeholder="girl, 2.5 months, with video"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-cocoa)]">Price (AED)</label>
                        <input
                          type="number"
                          value={newPuppy.price_aed}
                          onChange={(e) => setNewPuppy({ ...newPuppy, price_aed: e.target.value })}
                          className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-2 text-sm"
                          placeholder="9500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-cocoa)]">Media Path</label>
                        <input
                          type="text"
                          required
                          value={newPuppy.media}
                          onChange={(e) => setNewPuppy({ ...newPuppy, media: e.target.value })}
                          className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-cocoa)]">Description</label>
                      <textarea
                        value={newPuppy.description}
                        onChange={(e) => setNewPuppy({ ...newPuppy, description: e.target.value })}
                        className="tp-field mt-1 w-full rounded-xl border border-[var(--color-toffee)] p-2 text-sm"
                        rows={2}
                        placeholder="Tell visitors about this puppy's personality and health paperwork..."
                      />
                    </div>
                    <button type="submit" className="btn btn-primary text-xs py-2 px-5">
                      Save & Publish Puppy
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {puppies.map((pup) => (
                    <div
                      key={pup.slug}
                      className="rounded-2xl border border-[var(--color-toffee)]/30 bg-white p-4 shadow-xs"
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-amber-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img(pup.media, 400)}
                          alt={pup.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-plush text-base font-bold text-[var(--color-cocoa)]">{pup.name}</h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              pup.status === "available"
                                ? "bg-emerald-100 text-emerald-800"
                                : pup.status === "reserved"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {pup.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-cocoa-soft)]">{pup.meta}</p>
                        {pup.price_aed && (
                          <p className="mt-1 font-semibold text-xs text-[var(--color-cocoa)]">
                            {Number(pup.price_aed).toLocaleString()} AED
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between border-t border-[var(--color-toffee)]/20 pt-2 text-xs">
                          <span className="text-[10px] uppercase font-bold text-[var(--color-cocoa-soft)]">
                            {pup.origin === "local" ? "In Dubai" : "Imported"}
                          </span>
                          <select
                            value={pup.status}
                            onChange={(e) => updatePuppyState(pup.slug, e.target.value)}
                            className="rounded-md border border-[var(--color-toffee)] bg-amber-50/50 px-2 py-1 text-xs"
                          >
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="gone_home">Gone Home</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Status Tab */}
            {activeTab === "system" && (
              <div className="rounded-3xl border border-[var(--color-toffee)]/40 bg-white p-6 shadow-sm space-y-6">
                <h2 className="font-plush text-xl text-[var(--color-cocoa)]">System Architecture & Database Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[var(--color-cocoa)]">API & Database Endpoints</h3>
                    <ul className="space-y-1.5 text-xs text-[var(--color-cocoa-soft)]">
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">GET /api/health</code> — Status & database ping check</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">POST /api/v1/inquiries</code> — Public contact form letter submission</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">GET /api/v1/inquiries</code> — Staff inquiry listing & filtering (Protected)</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">PATCH /api/v1/inquiries/:id</code> — Update inquiry status & notes (Protected)</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">GET /api/v1/puppies</code> — Public puppy catalog with filters</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">GET /api/v1/puppies/:slug</code> — Individual puppy profile</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">POST /api/v1/puppies</code> — Add new puppy profile (Protected)</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">PATCH /api/v1/puppies/:slug</code> — Update puppy details/status (Protected)</li>
                      <li><code className="bg-amber-50 px-1 py-0.5 rounded font-mono">DELETE /api/v1/puppies/:slug</code> — Remove puppy (Protected)</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-[var(--color-cocoa)]">Active Node / Next.js Environment</h3>
                    <div className="rounded-2xl bg-amber-50/50 p-4 font-mono text-xs text-[var(--color-cocoa)] space-y-1">
                      <p>Node Version: 24.15.0</p>
                      <p>Framework: Next.js 15.5.28 (App Router)</p>
                      <p>Database: PostgreSQL 16 (pg Pool)</p>
                      <p>Migration Runner: scripts/migrate.mjs</p>
                      <p>Database Seeder: scripts/seed.mjs</p>
                      <p>Last Health Ping: {health?.timestamp ?? "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
