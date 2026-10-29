"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions";
import { btnPrimary, fieldClass, labelClass } from "@/components/ui/styles";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});
  return (
    <div className="mx-auto w-full max-w-md px-5 py-20">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep">Private</p>
      <h1 className="mt-3 font-serif text-5xl">Atelier login</h1>
      <p className="mt-4 text-sm leading-6 text-cocoa">
        This desk is for the store administrator. Customer accounts stay on the account page.
      </p>
      {configured ? null : (
        <p className="mt-4 border border-gold bg-paper px-4 py-3 text-sm leading-6" role="status">
          No administrator exists yet. Add ADMIN_EMAIL and ADMIN_PASSWORD to the server environment, then restart the site. The password is never shown here.
        </p>
      )}
      <form action={action} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={fieldClass} />
        </div>
        {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
        <button type="submit" className={btnPrimary} disabled={pending || !configured}>
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
