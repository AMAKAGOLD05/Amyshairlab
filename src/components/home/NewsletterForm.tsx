"use client";

import { useState } from "react";
import { isValidEmail } from "@/lib/validators";
import { btnPrimary, fieldClass } from "@/components/ui/styles";

const KEY = "amys-hairlab-newsletter";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      setMessage(null);
      return;
    }
    const existing = readEmails();
    const next = existing.includes(email.trim().toLowerCase())
      ? existing
      : [...existing, email.trim().toLowerCase()];
    localStorage.setItem(KEY, JSON.stringify(next));
    setError(null);
    setMessage(
      "Saved on this device only. It was not sent to a mailing service, and Amy’s Hairlab cannot see it.",
    );
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 text-left" noValidate>
      <label htmlFor="newsletter-email" className="text-[0.68rem] uppercase tracking-[0.18em] text-cocoa">
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
          placeholder="you@email.com"
          required
        />
        <button type="submit" className={btnPrimary}>
          Join the list
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="mt-3 text-sm text-cocoa">
          {message}
        </p>
      ) : null}
    </form>
  );
}

function readEmails() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}
