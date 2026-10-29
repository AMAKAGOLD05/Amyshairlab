"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { needsConfiguration, startingPrice, unitPrice } from "@/lib/catalog";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/types/catalog";
import { Price } from "@/components/ui/Price";
import { btnPrimary } from "@/components/ui/styles";

export function PurchasePanel({
  product,
  compact = false,
  onAdded,
}: {
  product: Product;
  compact?: boolean;
  onAdded?: () => void;
}) {
  const { items, addItem } = useCart();
  const [length, setLength] = useState<string | null>(
    product.lengths.length === 1 ? product.lengths[0].label : null,
  );
  const [choices, setChoices] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of product.variations) {
      if (group.options.length === 1) initial[group.id] = group.options[0];
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const variations = useMemo(
    () =>
      product.variations
        .filter((group) => choices[group.id])
        .map((group) => ({ label: group.label, value: choices[group.id] })),
    [choices, product.variations],
  );

  const selectedPrice =
    product.lengths.length > 0 && !length
      ? null
      : unitPrice(product, length);
  const lineId = `${product.id}__${length ?? ""}__${variations
    .map((item) => `${item.label}:${item.value}`)
    .sort()
    .join("|")}`;
  const alreadyInBag = items.find((item) => item.id === lineId)?.quantity ?? 0;
  const remaining = Math.max(product.stock - alreadyInBag, 0);
  const soldOut = product.stock <= 0;

  function chooseLength(next: string) {
    setLength(next);
    setQuantity(1);
    setStatus(null);
  }

  function onAdd() {
    const result = addItem({
      productId: product.id,
      length,
      variations,
      quantity,
    });
    setStatus(result);
    if (result.ok) onAdded?.();
  }

  return (
    <div id="purchase" className={compact ? "" : "mt-8 border-t border-line pt-8"}>
      {selectedPrice === null ? (
        <Price amount={startingPrice(product)} compareAt={product.compareAt} from />
      ) : (
        <p className="text-lg">{formatNaira(selectedPrice)}</p>
      )}
      <p className="mt-2 text-sm text-muted">
        {soldOut ? "Sold out." : `${product.stock} available.`}
      </p>

      {product.lengths.length > 0 ? (
        <fieldset className="mt-6">
          <legend className="text-[0.68rem] uppercase tracking-[0.18em] text-cocoa">
            Length
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.lengths.map((option) => {
              const selected = length === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseLength(option.label)}
                  className={`min-h-11 border px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "border-ink bg-ink text-ivory"
                      : "border-line bg-paper text-ink hover:border-ink"
                  }`}
                >
                  <span className="block">{option.label}</span>
                  <span className={`block text-xs ${selected ? "text-sand" : "text-muted"}`}>
                    {formatNaira(option.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {product.variations.map((group) => (
        <fieldset key={group.id} className="mt-6">
          <legend className="text-[0.68rem] uppercase tracking-[0.18em] text-cocoa">
            {group.label}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.options.map((option) => {
              const selected = choices[group.id] === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setChoices((current) => ({ ...current, [group.id]: option }));
                    setStatus(null);
                  }}
                  className={`min-h-11 border px-3 text-sm transition-colors ${
                    selected
                      ? "border-ink bg-ink text-ivory"
                      : "border-line bg-paper hover:border-ink"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor={`qty-${product.id}`} className="text-[0.68rem] uppercase tracking-[0.18em] text-cocoa">
            Quantity
          </label>
          <input
            id={`qty-${product.id}`}
            type="number"
            inputMode="numeric"
            min={1}
            max={Math.max(remaining, 1)}
            value={quantity}
            disabled={soldOut || remaining === 0}
            onChange={(event) => {
              const next = Number(event.target.value);
              setQuantity(Number.isFinite(next) ? next : 1);
              setStatus(null);
            }}
            className="mt-2 w-24 border border-line bg-paper px-3 py-3 text-sm"
          />
        </div>
        <button
          type="button"
          className={`${btnPrimary} min-w-44 flex-1`}
          disabled={soldOut || remaining === 0}
          onClick={onAdd}
        >
          {soldOut ? "Sold out" : remaining === 0 ? "All in your bag" : "Add to bag"}
        </button>
      </div>

      {alreadyInBag > 0 ? (
        <p className="mt-3 text-sm text-muted">{alreadyInBag} already in your bag.</p>
      ) : null}

      <p
        role="status"
        className={`mt-4 text-sm ${status ? (status.ok ? "text-cocoa" : "text-ink") : "sr-only"}`}
      >
        {status?.message ?? "Bag updates appear here."}
      </p>

      {!compact && needsConfiguration(product) ? (
        <p className="mt-2 text-sm text-muted">
          Choose every option above. The bag will not take an unfinished selection.
        </p>
      ) : null}
    </div>
  );
}
