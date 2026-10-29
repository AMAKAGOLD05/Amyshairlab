"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import { PageIntro } from "@/components/ui/PageIntro";
import { btnPrimary, btnSecondary, fieldClass, labelClass } from "@/components/ui/styles";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { useWishlist } from "@/context/WishlistContext";
import { nigerianStates } from "@/data/site";
import { formatNaira } from "@/lib/money";
import {
  ORDERS_PENDING,
  ordersServerSnapshot,
  parseOrders,
  readOrdersRaw,
  subscribeOrders,
} from "@/lib/orders";
import {
  PROFILE_PENDING,
  emptyProfile,
  parseProfile,
  profileServerSnapshot,
  readProfileRaw,
  saveProfile,
  subscribeProfile,
  type CustomerProfile,
} from "@/lib/profile";
import { isNigerianPhone, isValidEmail } from "@/lib/validators";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "saved", label: "Saved" },
  { id: "details", label: "Details" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function CustomerDashboard() {
  const profileRaw = useSyncExternalStore(subscribeProfile, readProfileRaw, profileServerSnapshot);
  const ordersRaw = useSyncExternalStore(subscribeOrders, readOrdersRaw, ordersServerSnapshot);
  const profile = profileRaw === PROFILE_PENDING ? emptyProfile : parseProfile(profileRaw);
  const orders = ordersRaw === ORDERS_PENDING ? [] : parseOrders(ordersRaw);
  const ready = profileRaw !== PROFILE_PENDING && ordersRaw !== ORDERS_PENDING;
  const { count: bagCount, subtotal, ready: bagReady } = useCart();
  const { ids, ready: wishlistReady } = useWishlist();
  const { products } = useCatalog();
  const [section, setSection] = useState<SectionId>("overview");
  const saved = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined);
  const missingSaved = wishlistReady ? ids.length - saved.length : 0;
  const greeting = profile.fullName.trim() || "there";

  return (
    <div>
      <PageIntro eyebrow="Your dashboard" title={ready ? `Hello, ${greeting}` : "Hello"}>
        <p>
          Orders, saved pieces, and the details below stay on this device. There is no
          customer account to sign in to, and nothing on this page is sent to a server.
        </p>
      </PageIntro>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[13rem_1fr]">
        <nav aria-label="Dashboard" className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={section === item.id ? "page" : undefined}
              onClick={() => setSection(item.id)}
              className={`px-3 py-2 text-left text-[0.72rem] uppercase tracking-[0.16em] ${
                section === item.id ? "bg-ink text-ivory" : "hover:bg-paper"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        {section === "overview" ? (
          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="font-serif text-4xl">
              On this device
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              <Stat label="Orders" value={ready ? String(orders.length) : "…"} />
              <Stat label="Saved" value={wishlistReady ? String(ids.length) : "…"} />
              <Stat label="In the bag" value={bagReady ? String(bagCount) : "…"} />
            </ul>
            <div className="mt-8 border border-line bg-paper p-6">
              <h3 className="font-serif text-3xl">Latest order</h3>
              {!ready ? (
                <p className="mt-3 text-sm text-muted">Looking for orders…</p>
              ) : orders[0] ? (
                <p className="mt-3 text-sm leading-6 text-cocoa">
                  <Link
                    href={`/order-confirmation?order=${encodeURIComponent(orders[0].orderNumber)}`}
                    className="font-serif text-2xl text-ink"
                  >
                    {orders[0].orderNumber}
                  </Link>
                  <span className="mt-1 block">
                    {formatNaira(orders[0].total)} · demonstration checkout
                  </span>
                </p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-cocoa">
                  No demonstration orders yet.{" "}
                  <Link href="/shop" className="underline decoration-gold underline-offset-4">
                    Visit the shop
                  </Link>
                  .
                </p>
              )}
              {bagReady && bagCount > 0 ? (
                <p className="mt-4 text-sm text-cocoa">
                  The bag holds {bagCount} {bagCount === 1 ? "piece" : "pieces"} · {formatNaira(subtotal)} before delivery.{" "}
                  <Link href="/cart" className="underline decoration-gold underline-offset-4">
                    Review the bag
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          </section>
        ) : null}
        {section === "orders" ? (
          <section aria-labelledby="orders-title">
            <h2 id="orders-title" className="font-serif text-4xl">
              Demonstration orders
            </h2>
            {!ready ? (
              <p className="mt-4 text-sm text-muted">Looking for orders on this device…</p>
            ) : orders.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-cocoa">
                No demonstration orders are saved in this browser.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {orders.map((order) => (
                  <li key={order.orderNumber} className="py-4">
                    <Link
                      href={`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}`}
                      className="block"
                    >
                      <span className="font-serif text-2xl">{order.orderNumber}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {new Date(order.placedAt).toLocaleString("en-NG")} · {formatNaira(order.total)} ·{" "}
                        {order.items.length} {order.items.length === 1 ? "line" : "lines"} · demo
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
        {section === "saved" ? (
          <section aria-labelledby="saved-title">
            <h2 id="saved-title" className="font-serif text-4xl">
              Saved pieces
            </h2>
            {!wishlistReady ? (
              <p className="mt-4 text-sm text-muted">Opening your wishlist…</p>
            ) : saved.length === 0 ? (
              <p className="mt-4 max-w-md text-sm leading-6 text-cocoa">
                Nothing is saved yet. Use the heart on a piece to keep it here.
                {missingSaved > 0
                  ? " A saved piece is no longer in the catalogue on this browser."
                  : ""}
              </p>
            ) : (
              <div className="mt-6">
                {missingSaved > 0 ? (
                  <p className="mb-4 text-sm text-muted">
                    {missingSaved} saved {missingSaved === 1 ? "piece is" : "pieces are"} no longer in
                    the catalogue on this browser.
                  </p>
                ) : null}
                <ProductGrid products={saved} />
              </div>
            )}
          </section>
        ) : null}
        {section === "details" ? <DetailsForm profile={profile} ready={ready} /> : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="border border-line bg-paper px-5 py-5">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold-deep">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
    </li>
  );
}

function DetailsForm({ profile, ready }: { profile: CustomerProfile; ready: boolean }) {
  const [draft, setDraft] = useState<CustomerProfile | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerProfile, string>>>({});
  const [savedNote, setSavedNote] = useState(false);
  const fields = draft ?? profile;

  function update<K extends keyof CustomerProfile>(key: K, value: CustomerProfile[K]) {
    setSavedNote(false);
    setDraft({ ...(draft ?? profile), [key]: value });
  }

  return (
    <section aria-labelledby="details-title">
      <h2 id="details-title" className="font-serif text-4xl">
        Your details
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-cocoa">
        These details are for this dashboard only. Checkout still asks for a delivery
        address, and that address is stored with the demonstration order.
      </p>
      <form
        className="mt-6 max-w-xl space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const next: CustomerProfile = {
            fullName: fields.fullName.trim(),
            email: fields.email.trim(),
            phone: fields.phone.trim(),
            city: fields.city.trim(),
            state: fields.state,
          };
          const nextErrors: Partial<Record<keyof CustomerProfile, string>> = {};
          if (next.email && !isValidEmail(next.email)) nextErrors.email = "Enter a valid email address.";
          if (next.phone && !isNigerianPhone(next.phone)) {
            nextErrors.phone = "Use a Nigerian mobile number, such as 0803 000 0000.";
          }
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length > 0) {
            setSavedNote(false);
            return;
          }
          saveProfile(next);
          setDraft(null);
          setSavedNote(true);
        }}
      >
        <Field
          id="dash-name"
          label="Full name"
          value={fields.fullName}
          autoComplete="name"
          onChange={(value) => update("fullName", value)}
        />
        <Field
          id="dash-email"
          label="Email"
          type="email"
          value={fields.email}
          autoComplete="email"
          error={errors.email}
          onChange={(value) => update("email", value)}
        />
        <Field
          id="dash-phone"
          label="Phone"
          type="tel"
          value={fields.phone}
          autoComplete="tel"
          error={errors.phone}
          onChange={(value) => update("phone", value)}
        />
        <div>
          <label htmlFor="dash-state" className={labelClass}>
            State
          </label>
          <select
            id="dash-state"
            value={fields.state}
            onChange={(event) => update("state", event.target.value)}
            className={fieldClass}
          >
            <option value="">Select a state</option>
            {nigerianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <Field
          id="dash-city"
          label="City"
          value={fields.city}
          autoComplete="address-level2"
          onChange={(value) => update("city", value)}
        />
        <button type="submit" className={btnPrimary} disabled={!ready}>
          Save on this device
        </button>
        {savedNote ? (
          <p role="status" className="text-sm">
            Saved on this device.
          </p>
        ) : null}
      </form>
      <Link href="/shop" className={`${btnSecondary} mt-8`}>
        Continue shopping
      </Link>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
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
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-cocoa">
          {error}
        </p>
      ) : null}
    </div>
  );
}
