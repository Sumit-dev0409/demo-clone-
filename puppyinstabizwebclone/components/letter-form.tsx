"use client";

import { useState } from "react";
import { availablePuppies, breeds, WHATSAPP } from "@/lib/data";

export default function LetterForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [curious, setCurious] = useState(breeds[0].label);
  const [interest, setInterest] = useState("any puppy (not sure yet)");
  const [message, setMessage] = useState("");
  const [submissionState, setSubmissionState] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const [submissionError, setSubmissionError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmissionState("submitting");
    setSubmissionError("");

    const values = new FormData(e.currentTarget);
    const payload = Object.fromEntries(values.entries());

    try {
      const response = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        error?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok) {
        const fieldErrors = Object.entries(result.fields ?? {})
          .map(([field, error]) => `${field}: ${error}`)
          .join(" ");
        throw new Error(
          [result.error, fieldErrors].filter(Boolean).join(" ") ||
            "We couldn't save your enquiry. Please try again.",
        );
      }

      const lines = [
        "Hi TeddyPups!",
        `My name is ${name}.`,
        `You can reach me on ${phone}${email ? ` or by email at ${email}` : ""}.`,
        `I live in ${location || "—"}.`,
        `I'm curious about ${curious}.`,
        `Puppy I'm interested in: ${interest}.`,
        message ? `Message: ${message}` : "",
        "With love, a future puppy parent 🧸",
      ].filter(Boolean);
      setWhatsappUrl(
        `${WHATSAPP.split("?")[0]}?text=${encodeURIComponent(lines.join("\n"))}`,
      );
      setSubmissionState("submitted");
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We couldn't save your enquiry. Please try again.",
      );
      setSubmissionState("error");
    }
  }

  return (
    <form
      className="tp-letter"
      onSubmit={handleSubmit}
      aria-busy={submissionState === "submitting"}
    >
      <span className="tp-letter__stamp" aria-hidden="true">
        TEDDY
        <br />
        PUPS
      </span>

      <p className="tp-letter__line">
        Dear TeddyPups, my name is{" "}
        <input
          className="tp-field"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Your name"
          placeholder="your name"
          required
        />{" "}
        , and you can reach me on{" "}
        <input
          className="tp-field"
          type="tel"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Your phone number"
          placeholder="phone / WhatsApp"
          required
        />{" "}
        or by email at{" "}
        <input
          className="tp-field"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Your email"
          placeholder="email"
        />{" "}
        .
      </p>

      <p className="tp-letter__line">
        I live in{" "}
        <input
          className="tp-field"
          type="text"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Where you live"
          placeholder="city, country"
        />{" "}
        , and I&apos;m curious about{" "}
        <select
          className="tp-field"
          name="curious"
          value={curious}
          onChange={(e) => setCurious(e.target.value)}
          aria-label="What you're curious about"
        >
          {breeds.map((b) => (
            <option key={b.label} value={b.label}>
              {b.label}
            </option>
          ))}
          <option value="importing a puppy">importing a puppy</option>
          <option value="something else">something else</option>
        </select>{" "}
        .
      </p>

      <div className="tp-letter__line mt-6">
        <label className="block" htmlFor="letter-interest">
          Puppy you&apos;re interested in (optional)
        </label>
        <select
          id="letter-interest"
          className="tp-field mt-1 w-full rounded-xl border-2 border-dashed border-toffee-deep px-3 py-2"
          name="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          <option value="any puppy (not sure yet)">any puppy (not sure yet)</option>
          {availablePuppies.map((p) => (
            <option key={p.href} value={`${p.name} (${p.meta})`}>
              {p.name} — {p.meta}
            </option>
          ))}
        </select>
      </div>

      <div className="tp-letter__line mt-6">
        <label className="block" htmlFor="letter-message">
          Your message (optional)
        </label>
        <textarea
          id="letter-message"
          className="tp-field mt-1"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a little about the home you can offer…"
        />
      </div>

      {/* Honeypot: real people never fill this in. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="letter-website">Website</label>
        <input id="letter-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="tp-letter__signoff">
        with love, a future puppy parent
      </p>

      <button
        type="submit"
        className="btn btn-primary mt-5"
        disabled={submissionState === "submitting" || submissionState === "submitted"}
      >
        {submissionState === "submitting" ? "Sending…" : "Post my letter"}
      </button>
      {submissionState === "error" && (
        <p className="mt-4 text-sm text-red-800" role="alert">
          {submissionError}
        </p>
      )}
      {submissionState === "submitted" && (
        <p className="mt-4 text-sm" role="status">
          Your enquiry has been saved.{" "}
          <a
            className="font-semibold underline"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continue on WhatsApp
          </a>{" "}
          to reach us directly.
        </p>
      )}
    </form>
  );
}