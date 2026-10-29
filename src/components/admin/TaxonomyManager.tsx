"use client";

import { useActionState } from "react";
import { deleteCategoryAction, deleteCollectionAction, saveCategoryAction, saveCollectionAction, type ActionState } from "@/lib/actions";
import { btnPrimary, fieldClass, labelClass } from "@/components/ui/styles";
import type { AdminProduct } from "@/lib/db";
import type { Taxonomy } from "@/types/content";

export function CategoryManager({ categories, notice }: { categories: Taxonomy[]; notice?: string }) {
  return (
    <div className="space-y-8">
      {notice ? <p className="border border-line bg-paper px-4 py-3 text-sm" role="status">{notice}</p> : null}
      <RecordForm kind="category" />
      <ul className="space-y-6">
        {categories.map((item) => <RecordForm key={item.id} kind="category" item={item} />)}
      </ul>
    </div>
  );
}

export function CollectionManager({
  collections,
  products,
  notice,
}: {
  collections: Taxonomy[];
  products: AdminProduct[];
  notice?: string;
}) {
  return (
    <div className="space-y-8">
      {notice ? <p className="border border-line bg-paper px-4 py-3 text-sm" role="status">{notice}</p> : null}
      <RecordForm kind="collection" products={products} />
      <ul className="space-y-6">
        {collections.map((item) => (
          <RecordForm
            key={item.id}
            kind="collection"
            item={item}
            products={products}
            selected={products.filter((product) => product.collectionId === item.id).map((product) => product.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function RecordForm({
  kind,
  item,
  products = [],
  selected = [],
}: {
  kind: "category" | "collection";
  item?: Taxonomy;
  products?: AdminProduct[];
  selected?: string[];
}) {
  const action = kind === "category" ? saveCategoryAction : saveCollectionAction;
  const [state, save, pending] = useActionState<ActionState, FormData>(action, {});
  return (
    <li className="grid gap-4 border border-line bg-paper p-5 lg:grid-cols-[8rem_1fr]">
      {item?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="aspect-square w-full object-cover" />
      ) : <div className="aspect-square bg-sand" />}
      <form action={save} className="space-y-3">
        <input type="hidden" name="id" defaultValue={item?.id ?? ""} />
        <input type="hidden" name="imageId" defaultValue={item?.image.startsWith("/api/media/") ? item.image.split("/").pop() : ""} />
        <input type="hidden" name="imageUrl" defaultValue={item?.image.startsWith("http") ? item.image : ""} />
        <label className={labelClass}>Name
          <input name="name" required defaultValue={item?.name ?? ""} className={`${fieldClass} mt-2`} />
        </label>
        {kind === "collection" ? (
          <label className={labelClass}>Shop name
            <input name="shopName" defaultValue={item?.shopName ?? ""} className={`${fieldClass} mt-2`} />
          </label>
        ) : null}
        <label className={labelClass}>Description
          <textarea name="description" defaultValue={item?.description ?? ""} className={`${fieldClass} mt-2 min-h-20`} />
        </label>
        <label className={labelClass}>
          Image
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-2 block w-full text-sm"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file && file.size > 5 * 1024 * 1024) {
                event.currentTarget.value = "";
                window.alert("Each image must be 5 MB or smaller.");
              }
            }}
          />
          <span className="mt-1 block text-xs font-normal text-muted">JPG, PNG, WEBP, or GIF · max 5 MB</span>
        </label>
        {kind === "collection" ? (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="showOnHome" defaultChecked={item?.showOnHome ?? true} />
              Show on the homepage
            </label>
            <label className={labelClass}>Products
              <select name="productId" multiple defaultValue={selected} className={`${fieldClass} mt-2 min-h-32`}>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
            </label>
          </>
        ) : null}
        {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
        {state.ok ? <p role="status" className="text-sm">{state.ok}</p> : null}
        <div className="flex gap-4">
          <button className={btnPrimary} disabled={pending}>{item ? "Save" : kind === "category" ? "Create category" : "Create collection"}</button>
        </div>
      </form>
      {item ? (
        <form action={kind === "category" ? deleteCategoryAction : deleteCollectionAction}>
          <input type="hidden" name="id" value={item.id} />
          <button className="text-sm underline" onClick={(event) => { if (!window.confirm(`Delete ${item.name}?`)) event.preventDefault(); }}>Delete</button>
        </form>
      ) : null}
    </li>
  );
}
