"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { deleteLibraryAction, replaceLibraryAction, updateAltAction, uploadLibraryAction, type ActionState } from "@/lib/actions";
import { btnPrimary, fieldClass, labelClass } from "@/components/ui/styles";
import type { MediaItem } from "@/types/content";

export function LibraryManager({ media }: { media: MediaItem[] }) {
  const [query, setQuery] = useState("");
  const [uploadState, upload, uploading] = useActionState<ActionState, FormData>(uploadLibraryAction, {});
  const visible = useMemo(
    () => media.filter((item) => item.filename.toLowerCase().includes(query.trim().toLowerCase())),
    [media, query],
  );
  return (
    <div>
      <form action={upload} className="mb-8 space-y-3 border border-line bg-paper p-5">
        <label className={labelClass}>Upload images
          <input name="files" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple required className="mt-2 block w-full text-sm" />
        </label>
        <label className={labelClass}>Alternative text for this batch
          <input name="alt" className={`${fieldClass} mt-2`} />
        </label>
        {uploadState.error ? <p role="alert" className="text-sm">{uploadState.error}</p> : null}
        {uploadState.ok ? <p role="status" className="text-sm">{uploadState.ok}</p> : null}
        <button className={btnPrimary} disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</button>
      </form>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by filename" aria-label="Search images" className={`${fieldClass} mb-6`} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => <LibraryCard key={item.id} item={item} />)}
      </ul>
    </div>
  );
}

function LibraryCard({ item }: { item: MediaItem }) {
  const [replaceState, replace, replacing] = useActionState<ActionState, FormData>(replaceLibraryAction, {});
  const [deleteState, remove, removing] = useActionState<ActionState, FormData>(deleteLibraryAction, {});
  const reference = `/api/media/${item.id}`;
  return (
    <li className="border border-line bg-paper p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={reference} alt={item.alt || item.filename} className="aspect-square w-full object-cover" />
      <p className="mt-3 truncate text-sm">{item.filename}</p>
      <form action={updateAltAction} className="mt-3 flex gap-2">
        <input type="hidden" name="id" value={item.id} />
        <input name="alt" defaultValue={item.alt} aria-label="Alternative text" className={fieldClass} />
        <button className="text-sm underline">Save</button>
      </form>
      <button type="button" className="mt-3 text-sm underline" onClick={() => navigator.clipboard.writeText(reference)}>Copy reference</button>
      <form action={replace} className="mt-3">
        <input type="hidden" name="id" value={item.id} />
        <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="block w-full text-xs" />
        <button className="mt-2 text-sm underline" disabled={replacing}>Replace image</button>
        {replaceState.error ? <p role="alert" className="text-sm">{replaceState.error}</p> : null}
        {replaceState.ok ? <p role="status" className="text-sm">{replaceState.ok}</p> : null}
      </form>
      <form action={remove} className="mt-3">
        <input type="hidden" name="id" value={item.id} />
        <button className="text-sm underline" disabled={removing} onClick={(event) => { if (!window.confirm("Delete this image from the library?")) event.preventDefault(); }}>Delete</button>
        {deleteState.error ? <p role="alert" className="mt-2 text-sm">{deleteState.error}</p> : null}
      </form>
    </li>
  );
}
