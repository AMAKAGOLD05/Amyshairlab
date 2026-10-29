"use client";

import { useState } from "react";
import { btnPrimary, fieldClass, labelClass } from "@/components/ui/styles";
import { isNigerianPhone, isValidEmail } from "@/lib/validators";

const KEY = "amys-hairlab-messages";

type Message = {
  name: string;
  email: string;
  phone: string;
  note: string;
  savedAt: string;
};

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (phone.trim() && !isNigerianPhone(phone)) {
      setError("Enter a Nigerian phone number, or leave the phone field empty.");
      return;
    }
    if (note.trim().length < 8) {
      setError("Write a short message so we know what you need.");
      return;
    }
    const entry: Message = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      note: note.trim(),
      savedAt: new Date().toISOString(),
    };
    const existing = readMessages();
    localStorage.setItem(KEY, JSON.stringify([entry, ...existing].slice(0, 20)));
    setError(null);
    setDone(true);
    setName("");
    setEmail("");
    setPhone("");
    setNote("");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <p className="text-sm leading-6 text-muted">
        Messages are stored in this browser only. They are not emailed and they do not
        reach a studio inbox.
      </p>
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input id="contact-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          Phone <span className="normal-case tracking-normal text-muted">(optional)</span>
        </label>
        <input id="contact-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} autoComplete="tel" placeholder="0803 000 0000" />
      </div>
      <div>
        <label htmlFor="contact-note" className={labelClass}>
          Message
        </label>
        <textarea id="contact-note" value={note} onChange={(event) => setNote(event.target.value)} className={`${fieldClass} min-h-32`} />
      </div>
      {error ? (
        <p role="alert" className="text-sm">
          {error}
        </p>
      ) : null}
      {done ? (
        <p role="status" className="text-sm text-cocoa">
          Saved on this device. This demonstration does not send the message anywhere.
        </p>
      ) : null}
      <button type="submit" className={btnPrimary}>
        Send message
      </button>
    </form>
  );
}

function readMessages(): Message[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as Message[]) : [];
  } catch {
    return [];
  }
}
