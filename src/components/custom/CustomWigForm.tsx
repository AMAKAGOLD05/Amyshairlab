"use client";

import { useState } from "react";
import { btnPrimary, fieldClass, labelClass } from "@/components/ui/styles";
import { isNigerianPhone, isValidEmail } from "@/lib/validators";

const KEY = "amys-hairlab-custom-requests";

export function CustomWigForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brief, setBrief] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) return setError("Enter your name.");
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    if (!isNigerianPhone(phone)) {
      return setError("Enter a Nigerian phone number, such as 0803 000 0000.");
    }
    if (brief.trim().length < 12) {
      return setError("Describe the length, texture, and hairline you want.");
    }
    const id = `CW-${Date.now().toString().slice(-6)}`;
    const entry = {
      id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      brief: brief.trim(),
      savedAt: new Date().toISOString(),
    };
    const existing = read();
    localStorage.setItem(KEY, JSON.stringify([entry, ...existing].slice(0, 20)));
    setError(null);
    setReference(id);
    setName("");
    setEmail("");
    setPhone("");
    setBrief("");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <p className="text-sm leading-6 text-muted">
        This request is stored in local storage on this device. It is not sent to a wig
        maker and it does not reserve hair.
      </p>
      <div>
        <label htmlFor="wig-name" className={labelClass}>Full name</label>
        <input id="wig-name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="wig-email" className={labelClass}>Email</label>
        <input id="wig-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="wig-phone" className={labelClass}>Nigerian phone number</label>
        <input id="wig-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} autoComplete="tel" placeholder="0803 000 0000" />
      </div>
      <div>
        <label htmlFor="wig-brief" className={labelClass}>What should the wig do?</label>
        <textarea
          id="wig-brief"
          value={brief}
          onChange={(event) => setBrief(event.target.value)}
          className={`${fieldClass} min-h-36`}
          placeholder="Length, texture, density, colour, and how you want the hairline to sit."
        />
      </div>
      {error ? <p role="alert" className="text-sm">{error}</p> : null}
      {reference ? (
        <p role="status" className="border border-gold bg-paper px-4 py-3 text-sm">
          Demonstration reference {reference} saved on this device only.
        </p>
      ) : null}
      <button type="submit" className={btnPrimary}>
        Save custom request
      </button>
    </form>
  );
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
