"use client";

import { useActionState } from "react";
import { changePasswordAction, savePromotionAction, saveSettingsAction, type ActionState } from "@/lib/actions";
import { btnPrimary, fieldClass, labelClass } from "@/components/ui/styles";
import type { Promotion, StoreSettings } from "@/types/content";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettingsAction, {});
  return (
    <form action={action} className="grid max-w-3xl gap-4">
      <Text name="name" label="Store name" defaultValue={settings.name} />
      <Text name="short" label="Short description" defaultValue={settings.short} />
      <Text name="email" label="Customer service email" defaultValue={settings.email} />
      <Text name="phone" label="Phone" defaultValue={settings.phone} />
      <Text name="phoneHref" label="Phone link" defaultValue={settings.phoneHref} />
      <Text name="address" label="Address" defaultValue={settings.address} />
      <Text name="hours" label="Hours" defaultValue={settings.hours} />
      <Text name="instagram" label="Instagram" defaultValue={settings.instagram} />
      <Text name="tiktok" label="TikTok" defaultValue={settings.tiktok} />
      <Text name="pinterest" label="Pinterest" defaultValue={settings.pinterest} />
      <Text name="whatsapp" label="WhatsApp" defaultValue={settings.whatsapp} />
      <Text name="announcement" label="Announcement bar" defaultValue={settings.announcement} />
      <Text name="announcementHref" label="Announcement destination" defaultValue={settings.announcementHref} />
      <Text name="deliveryFee" label="Delivery fee (₦)" defaultValue={String(settings.deliveryFee)} />
      <Text name="freeDeliveryThreshold" label="Free delivery from (₦)" defaultValue={String(settings.freeDeliveryThreshold)} />
      {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
      {state.ok ? <p role="status" className="text-sm">{state.ok}</p> : null}
      <button className={btnPrimary} disabled={pending}>Save settings</button>
    </form>
  );
}

export function PromotionForm({ promotion }: { promotion: Promotion }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(savePromotionAction, {});
  return (
    <form action={action} className="grid max-w-3xl gap-4">
      <Text name="code" label="Discount code" defaultValue={promotion.code} />
      <Text name="percent" label="Percent off" defaultValue={String(promotion.percent)} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={promotion.active} /> Active at checkout</label>
      <Text name="bannerText" label="Promotional banner text" defaultValue={promotion.bannerText} />
      <Text name="bannerHref" label="Banner destination" defaultValue={promotion.bannerHref} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="bannerVisible" defaultChecked={promotion.bannerVisible} /> Show the banner text in promotions</label>
      {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
      {state.ok ? <p role="status" className="text-sm">{state.ok}</p> : null}
      <button className={btnPrimary} disabled={pending}>Save promotion</button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(changePasswordAction, {});
  return (
    <form action={action} className="grid max-w-md gap-4">
      <Text name="password" label="Current password" type="password" />
      <Text name="next" label="New password" type="password" />
      {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
      {state.ok ? <p role="status" className="text-sm">{state.ok}</p> : null}
      <button className={btnPrimary} disabled={pending}>Update password</button>
    </form>
  );
}

function Text({ name, label, defaultValue = "", type = "text" }: { name: string; label: string; defaultValue?: string; type?: string }) {
  return (
    <label className={labelClass}>{label}
      <input name={name} type={type} defaultValue={defaultValue} className={`${fieldClass} mt-2`} />
    </label>
  );
}
