"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BagTotals, CartLines } from "@/components/cart/CartLines";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary, fieldClass, labelClass } from "@/components/ui/styles";
import { useCart } from "@/context/CartContext";
import { useSite } from "@/context/CatalogContext";
import { nigerianStates } from "@/data/site";
import { placeOrder } from "@/lib/actions";
import { lineAvailability } from "@/lib/catalog";
import { saveOrder } from "@/lib/orders";
import { isNigerianPhone, isValidEmail } from "@/lib/validators";
import Link from "next/link";

type Fields = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  notes: string;
};

const empty: Fields = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  state: "",
  city: "",
  notes: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart, ready } = useCart();
  const { products, promotion } = useSite();
  const [fields, setFields] = useState<Fields>(empty);
  const [promo, setPromo] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | "form", string>>>({});
  const [pending, setPending] = useState(false);

  const blocked = items.some((item) => !lineAvailability(item, products).ok);
  const code = promo.trim().toUpperCase();
  const discount = promotion.active && promotion.code && code === promotion.code
    ? Math.round((subtotal * promotion.percent) / 100)
    : 0;

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (fields.fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!isValidEmail(fields.email)) next.email = "Enter a valid email address.";
    if (!isNigerianPhone(fields.phone)) {
      next.phone = "Enter a Nigerian phone number, such as 0803 000 0000 or +234 803 000 0000.";
    }
    if (fields.address.trim().length < 8) next.address = "Enter a delivery address.";
    if (!fields.state) next.state = "Choose a state.";
    if (fields.city.trim().length < 2) next.city = "Enter a city.";
    return next;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0 || items.length === 0 || blocked || pending) return;
    setPending(true);
    const result = await placeOrder({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        length: item.length,
        variations: item.variations,
      })),
      customer: fields,
      promoCode: promo,
    });
    if (!result.ok) {
      setPending(false);
      setErrors({ form: result.error });
      return;
    }
    saveOrder(result.order);
    clearCart();
    router.push(`/order-confirmation?order=${encodeURIComponent(result.order.orderNumber)}`);
  }

  if (!ready) {
    return <p className="px-5 py-20 text-center text-sm text-muted">Opening your bag…</p>;
  }

  if (items.length === 0) {
    return (
      <div>
        <PageIntro eyebrow="Checkout" title="Your bag is empty">
          <p>Add a piece before you place a demonstration order.</p>
        </PageIntro>
        <div className="px-5 pb-16 sm:px-8">
          <Link href="/shop" className={btnPrimary}>
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageIntro eyebrow="Demonstration checkout" title="Delivery details">
        <p>
          No card details are collected and no payment is processed. The order is recorded
          for the atelier, and a copy stays in this browser for your confirmation page.
        </p>
      </PageIntro>
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-5">
          {Object.keys(errors).length > 0 ? (
            <div role="alert" className="border border-ink bg-paper px-4 py-3 text-sm">
              Please correct the highlighted fields before placing the order.
            </div>
          ) : null}
          <Field
            id="fullName"
            label="Full name"
            value={fields.fullName}
            error={errors.fullName}
            autoComplete="name"
            onChange={(value) => update("fullName", value)}
          />
          <Field
            id="email"
            label="Email address"
            type="email"
            value={fields.email}
            error={errors.email}
            autoComplete="email"
            onChange={(value) => update("email", value)}
          />
          <Field
            id="phone"
            label="Nigerian phone number"
            type="tel"
            value={fields.phone}
            error={errors.phone}
            autoComplete="tel"
            placeholder="0803 000 0000"
            onChange={(value) => update("phone", value)}
          />
          <div>
            <label htmlFor="address" className={labelClass}>
              Delivery address
            </label>
            <textarea
              id="address"
              value={fields.address}
              autoComplete="street-address"
              onChange={(event) => update("address", event.target.value)}
              className={`${fieldClass} min-h-28`}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "address-error" : undefined}
            />
            {errors.address ? (
              <p id="address-error" className="mt-2 text-sm">
                {errors.address}
              </p>
            ) : null}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="state" className={labelClass}>
                State
              </label>
              <select
                id="state"
                value={fields.state}
                autoComplete="address-level1"
                onChange={(event) => update("state", event.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.state)}
                aria-describedby={errors.state ? "state-error" : undefined}
              >
                <option value="">Select a state</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state ? (
                <p id="state-error" className="mt-2 text-sm">
                  {errors.state}
                </p>
              ) : null}
            </div>
            <Field
              id="city"
              label="City"
              value={fields.city}
              error={errors.city}
              autoComplete="address-level2"
              onChange={(value) => update("city", value)}
            />
          </div>
          <div>
            <label htmlFor="notes" className={labelClass}>
              Order notes <span className="normal-case tracking-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={fields.notes}
              onChange={(event) => update("notes", event.target.value)}
              className={`${fieldClass} min-h-24`}
              placeholder="Gate code, preferred delivery window, wig colour note…"
            />
          </div>
          <div>
            <label htmlFor="promo" className={labelClass}>
              Promotion code <span className="normal-case tracking-normal text-muted">(optional)</span>
            </label>
            <input id="promo" value={promo} onChange={(event) => setPromo(event.target.value)} className={fieldClass} />
          </div>
          {blocked ? (
            <p role="alert" className="text-sm">
              One or more pieces are sold out or exceed the sample stock. Update the bag
              before placing the order.
            </p>
          ) : null}
          {errors.form ? (
            <p role="alert" className="text-sm">{errors.form}</p>
          ) : null}
          <button type="submit" className={btnPrimary} disabled={blocked || pending}>
            {pending ? "Placing order…" : "Place order"}
          </button>
        </div>
        <aside className="h-fit border border-line bg-paper p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-3xl">Order</h2>
          <div className="mt-4">
            <CartLines items={items} editable={false} />
          </div>
          <div className="mt-6">
            <BagTotals subtotal={subtotal} discount={discount} showDelivery />
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
}: {
  id: keyof Fields;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
