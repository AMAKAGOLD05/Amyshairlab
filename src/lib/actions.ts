"use server";

import { updateTag } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { clearSession, verifyPassword, writeSession, hashPassword } from "@/lib/auth";
import {
  commitOrder,
  deleteCategory,
  deleteCollection,
  deleteMedia,
  deleteProduct,
  findAdminByEmail,
  getAdminProduct,
  getHome,
  getPromotion,
  getSettings,
  insertMedia,
  listAdminProducts,
  mediaUsages,
  replaceMedia,
  saveCategory,
  saveCollection,
  saveHome,
  saveProduct,
  savePromotion,
  saveSettings,
  setCollectionProducts,
  setOrderStatus,
  updateAdminPassword,
  updateMediaAlt,
  type ProductInput,
} from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { quoteDeliveryFee } from "@/data/site";
import { unitPrice } from "@/lib/catalog";
import { createOrderNumber, isNigerianPhone, isValidEmail } from "@/lib/validators";
import type { CartLine } from "@/types/catalog";
import type { HomeContent, HomeSection, Promotion, StoreSettings } from "@/types/content";

export type ActionState = { error?: string; ok?: string };

const failures = new Map<string, { count: number; reset: number }>();

function refresh() {
  updateTag("store");
}

function bubble(error: unknown): ActionState {
  unstable_rethrow(error);
  return { error: error instanceof Error ? error.message : "That change could not be saved." };
}

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function readImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!imageTypes.has(file.type)) throw new Error("Use a JPG, PNG, WEBP, or GIF image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Each image must be 5 MB or smaller.");
  return {
    filename: file.name.replace(/[^\w.\- ]+/g, "").slice(0, 180) || "image",
    mime: file.type,
    bytes: Buffer.from(await file.arrayBuffer()),
  };
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function money(value: FormDataEntryValue | null) {
  const amount = Number(String(value ?? "").replace(/[^\d]/g, ""));
  if (!Number.isInteger(amount) || amount < 0 || amount > 100_000_000) {
    throw new Error("Enter a price in whole naira.");
  }
  return amount;
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const now = Date.now();
  const attempt = failures.get(email);
  if (attempt && attempt.reset > now && attempt.count >= 8) {
    return { error: "Too many attempts. Wait a few minutes and try again." };
  }
  if (!isValidEmail(email) || password.length < 7) {
    return { error: "Enter the administrator email and password." };
  }
  const admin = await findAdminByEmail(email);
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    const current = attempt && attempt.reset > now ? attempt : { count: 0, reset: now + 10 * 60 * 1000 };
    failures.set(email, { count: current.count + 1, reset: current.reset });
    return { error: "Those details do not match an administrator account." };
  }
  failures.delete(email);
  await writeSession(admin.id);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function saveProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 2) throw new Error("Enter a product name.");
    const description = String(formData.get("description") ?? "").trim();
    if (description.length < 10) throw new Error("Enter a product description.");
    const price = money(formData.get("price"));
    const compareRaw = String(formData.get("compareAt") ?? "").trim();
    const compareAt = compareRaw ? money(compareRaw) : null;
    if (compareAt !== null && compareAt <= price) {
      throw new Error("The original price must be higher than the selling price.");
    }
    const stock = Number(formData.get("stock"));
    if (!Number.isInteger(stock) || stock < 0 || stock > 100000) throw new Error("Enter a stock quantity.");
    const lengths = String(formData.get("lengths") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(.+?)\s+(\d+)$/);
        if (!match) throw new Error(`Use “18\\" 84000” for each length. “${line}” is not in that form.`);
        return { label: match[1].trim(), price: Number(match[2]) };
      });
    const variations = String(formData.get("variations") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, rest] = line.split(":");
        const options = (rest ?? "").split(",").map((item) => item.trim()).filter(Boolean);
        if (!label?.trim() || options.length === 0) {
          throw new Error("Write variations as “Colour: Natural, Honey”.");
        }
        return { id: slugify(label) || "option", label: label.trim(), options };
      });
    const details = String(formData.get("details") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const id = String(formData.get("id") ?? "").trim() || crypto.randomUUID();
    const existing = await getAdminProduct(id);
    const slug = slugify(String(formData.get("slug") ?? "") || name);
    if (!slug) throw new Error("Enter a name that can become a page address.");
    const order = JSON.parse(String(formData.get("imageOrder") ?? "[]")) as {
      kind: "kept" | "new";
      mediaId?: string | null;
      externalUrl?: string | null;
      alt?: string;
      fileIndex?: number;
    }[];
    if (!Array.isArray(order)) throw new Error("The image list could not be read.");
    const uploads = formData.getAll("newFile").filter((file): file is File => file instanceof File && file.size > 0);
    const images: ProductInput["images"] = [];
    for (const item of order) {
      const alt = String(item.alt ?? "").trim().slice(0, 180);
      if (item.kind === "new") {
        const file = uploads[item.fileIndex ?? -1];
        if (!file) throw new Error("One of the new images did not upload. Try again.");
        const stored = await readImage(file);
        if (!stored) throw new Error("One of the new images could not be read.");
        const mediaId = await insertMedia({ ...stored, alt });
        images.push({ mediaId, externalUrl: null, alt });
      } else if (item.mediaId) {
        images.push({ mediaId: item.mediaId, externalUrl: null, alt });
      } else if (item.externalUrl && /^https:\/\/images\.unsplash\.com\//.test(item.externalUrl)) {
        images.push({ mediaId: null, externalUrl: item.externalUrl, alt });
      }
    }
    const input: ProductInput = {
      id,
      slug,
      name,
      description,
      details,
      price,
      compareAt,
      categoryId: String(formData.get("categoryId") ?? ""),
      collectionId: String(formData.get("collectionId") ?? ""),
      texture: String(formData.get("texture") ?? "").trim() || name,
      lengths,
      variations,
      stock,
      available: formData.get("available") === "on",
      featured: formData.get("featured") === "on",
      bestseller: formData.get("bestseller") === "on",
      isNew: formData.get("isNew") === "on",
      createdAt: existing?.createdAt,
      images,
    };
    await saveProduct(input);
    refresh();
  } catch (error) {
    return bubble(error);
  }
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await deleteProduct(id);
  refresh();
  redirect("/admin/products?deleted=1");
}

export async function saveCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 2) throw new Error("Enter a category name.");
    const id = String(formData.get("id") ?? "").trim() || slugify(name);
    const file = await readImage(formData.get("image"));
    const mediaId = file ? await insertMedia({ ...file, alt: name }) : String(formData.get("imageId") ?? "") || null;
    await saveCategory({
      id,
      name,
      description: String(formData.get("description") ?? "").trim(),
      imageId: mediaId,
      imageUrl: mediaId ? "" : String(formData.get("imageUrl") ?? ""),
    });
    refresh();
    return { ok: "Category saved." };
  } catch (error) {
    return bubble(error);
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  try {
    await deleteCategory(String(formData.get("id") ?? ""));
  } catch (error) {
    redirect(`/admin/categories?error=${encodeURIComponent(error instanceof Error ? error.message : "Could not delete.")}`);
  }
  refresh();
  redirect("/admin/categories?saved=1");
}

export async function saveCollectionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 2) throw new Error("Enter a collection name.");
    const id = String(formData.get("id") ?? "").trim() || slugify(name);
    const file = await readImage(formData.get("image"));
    const mediaId = file ? await insertMedia({ ...file, alt: name }) : String(formData.get("imageId") ?? "") || null;
    await saveCollection({
      id,
      name,
      shopName: String(formData.get("shopName") ?? "").trim() || name,
      description: String(formData.get("description") ?? "").trim(),
      imageId: mediaId,
      imageUrl: mediaId ? "" : String(formData.get("imageUrl") ?? ""),
      showOnHome: formData.get("showOnHome") === "on",
    });
    const productIds = formData.getAll("productId").map(String);
    await setCollectionProducts(id, productIds);
    refresh();
    return { ok: "Collection saved." };
  } catch (error) {
    return bubble(error);
  }
}

export async function deleteCollectionAction(formData: FormData) {
  await requireAdmin();
  try {
    await deleteCollection(String(formData.get("id") ?? ""));
  } catch (error) {
    redirect(`/admin/collections?error=${encodeURIComponent(error instanceof Error ? error.message : "Could not delete.")}`);
  }
  refresh();
  redirect("/admin/collections?saved=1");
}

function cleanHome(value: unknown): HomeContent {
  if (!value || typeof value !== "object") throw new Error("The homepage could not be read.");
  const home = value as HomeContent;
  const slides = (home.hero?.slides ?? [])
    .map((slide) => ({
      id: String(slide.id || crypto.randomUUID()).slice(0, 80),
      headline: String(slide.headline ?? "").trim().slice(0, 140),
      supporting: String(slide.supporting ?? "").trim().slice(0, 500),
      buttonLabel: String(slide.buttonLabel ?? "").trim().slice(0, 48),
      buttonHref: String(slide.buttonHref ?? "").trim().slice(0, 200) || "/shop",
      enabled: Boolean(slide.enabled),
    }))
    .filter((slide) => slide.headline);
  if (slides.length === 0) throw new Error("Add at least one hero slide with a headline.");
  if (!slides.some((slide) => slide.enabled)) throw new Error("Enable at least one hero slide.");
  const lead = slides.find((slide) => slide.enabled) ?? slides[0];
  const buttons = (home.hero.buttons ?? []).slice(0, 2).map((button) => ({
    label: String(button.label ?? "").trim().slice(0, 48),
    href: String(button.href ?? "").trim().slice(0, 200),
    enabled: Boolean(button.enabled),
  }));
  if (buttons.length === 0) {
    buttons.push({ label: lead.buttonLabel, href: lead.buttonHref, enabled: true });
  } else {
    buttons[0] = { label: lead.buttonLabel, href: lead.buttonHref, enabled: true };
  }
  const sections = (home.sections ?? []).map((section) => cleanSection(section));
  return {
    announcement: String(home.announcement ?? "").trim().slice(0, 220),
    announcementHref: String(home.announcementHref ?? "/shop").trim().slice(0, 200) || "/shop",
    hero: {
      eyebrow: String(home.hero.eyebrow ?? "").trim().slice(0, 80),
      headline: lead.headline,
      supporting: lead.supporting,
      align: home.hero.align === "left" ? "left" : "center",
      background: /^#[0-9a-fA-F]{6}$/.test(home.hero.background ?? "") ? home.hero.background : "",
      textColor: /^#[0-9a-fA-F]{6}$/.test(home.hero.textColor ?? "") ? home.hero.textColor : "",
      imageId: home.hero.imageId || null,
      imageAlt: String(home.hero.imageAlt ?? "").trim().slice(0, 180),
      imagePosition: String(home.hero.imagePosition ?? "center 30%").slice(0, 40),
      mobileImageId: home.hero.mobileImageId || null,
      buttons,
      slides,
    },
    sections,
  };
}

function cleanSection(section: HomeSection): HomeSection {
  const types = new Set([
    "collections",
    "bestsellers",
    "arrivals",
    "featured",
    "banner",
    "story",
    "custom",
    "testimonials",
    "gallery",
    "newsletter",
  ]);
  if (!types.has(section.type)) throw new Error("That homepage section is not supported.");
  return {
    id: String(section.id || crypto.randomUUID()).slice(0, 80),
    type: section.type,
    heading: String(section.heading ?? "").trim().slice(0, 140),
    supporting: String(section.supporting ?? "").trim().slice(0, 1200),
    visible: Boolean(section.visible),
    productIds: Array.isArray(section.productIds) ? section.productIds.map(String).slice(0, 12) : [],
    bannerImageId: section.bannerImageId || null,
    bannerAlt: String(section.bannerAlt ?? "").slice(0, 180),
    bannerHref: String(section.bannerHref ?? "/shop").slice(0, 200),
  };
}

export async function saveHomeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const content = cleanHome(JSON.parse(String(formData.get("content") ?? "")));
    const heroFile = await readImage(formData.get("heroImage"));
    const mobileFile = await readImage(formData.get("heroMobile"));
    if (formData.get("removeHero") === "1") content.hero.imageId = null;
    if (formData.get("removeMobile") === "1") content.hero.mobileImageId = null;
    if (heroFile) content.hero.imageId = await insertMedia({ ...heroFile, alt: content.hero.imageAlt });
    if (mobileFile) content.hero.mobileImageId = await insertMedia({ ...mobileFile, alt: content.hero.imageAlt });
    const intent = String(formData.get("intent") ?? "draft");
    await saveHome("home_draft", content);
    if (intent === "publish") await saveHome("home_published", content);
    refresh();
    if (intent === "preview") redirect("/admin/preview");
    return { ok: intent === "publish" ? "Homepage published." : "Draft saved." };
  } catch (error) {
    return bubble(error);
  }
}

export async function uploadLibraryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const files = formData.getAll("files");
    let saved = 0;
    for (const file of files) {
      const image = await readImage(file);
      if (!image) continue;
      await insertMedia({ ...image, alt: String(formData.get("alt") ?? "").trim() });
      saved += 1;
    }
    if (saved === 0) throw new Error("Choose at least one image.");
    refresh();
    return { ok: saved === 1 ? "Image added to the library." : `${saved} images added to the library.` };
  } catch (error) {
    return bubble(error);
  }
}

export async function updateAltAction(formData: FormData) {
  await requireAdmin();
  await updateMediaAlt(String(formData.get("id") ?? ""), String(formData.get("alt") ?? "").trim().slice(0, 180));
  refresh();
}

export async function replaceLibraryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const image = await readImage(formData.get("file"));
    if (!image) throw new Error("Choose a replacement image.");
    await replaceMedia(String(formData.get("id") ?? ""), image);
    refresh();
    return { ok: "Image replaced. Pages that use it now show the new file." };
  } catch (error) {
    return bubble(error);
  }
}

export async function deleteLibraryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const id = String(formData.get("id") ?? "");
    if (formData.get("confirm") !== "yes") {
      const usages = await mediaUsages(id);
      if (usages.length > 0) {
        return { error: `This image is still used by ${usages.join(", ")}. Remove it there first, or replace the file instead.` };
      }
    }
    await deleteMedia(id);
    refresh();
    return { ok: "Image deleted." };
  } catch (error) {
    return bubble(error);
  }
}

export async function setOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await setOrderStatus(id, String(formData.get("status") ?? ""));
  refresh();
  redirect(`/admin/orders/${id}`);
}

export async function savePromotionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const percent = Number(formData.get("percent"));
    if (!Number.isInteger(percent) || percent < 0 || percent > 90) {
      throw new Error("Enter a discount from 0 to 90 percent.");
    }
    const promotion: Promotion = {
      code: String(formData.get("code") ?? "").trim().toUpperCase().slice(0, 24),
      percent,
      active: formData.get("active") === "on",
      bannerText: String(formData.get("bannerText") ?? "").trim().slice(0, 180),
      bannerHref: String(formData.get("bannerHref") ?? "/shop").trim().slice(0, 200) || "/shop",
      bannerVisible: formData.get("bannerVisible") === "on",
    };
    await savePromotion(promotion);
    refresh();
    return { ok: "Promotion saved." };
  } catch (error) {
    return bubble(error);
  }
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const current = await getSettings();
    const next: StoreSettings = {
      ...current,
      name: String(formData.get("name") ?? "").trim().slice(0, 80) || current.name,
      short: String(formData.get("short") ?? "").trim().slice(0, 280),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      phoneHref: String(formData.get("phoneHref") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      hours: String(formData.get("hours") ?? "").trim(),
      instagram: String(formData.get("instagram") ?? "").trim(),
      tiktok: String(formData.get("tiktok") ?? "").trim(),
      pinterest: String(formData.get("pinterest") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      announcement: String(formData.get("announcement") ?? "").trim().slice(0, 220),
      announcementHref: String(formData.get("announcementHref") ?? "/shop").trim() || "/shop",
      deliveryFee: money(formData.get("deliveryFee")),
      freeDeliveryThreshold: money(formData.get("freeDeliveryThreshold")),
    };
    if (next.email && !isValidEmail(next.email)) throw new Error("Enter a valid contact email.");
    await saveSettings(next);
    const home = await getHome("home_published");
    home.announcement = next.announcement;
    home.announcementHref = next.announcementHref;
    await saveHome("home_published", home);
    refresh();
    return { ok: "Store settings saved." };
  } catch (error) {
    return bubble(error);
  }
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  try {
    const current = await findAdminByEmail(admin.email);
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "");
    if (!current || !verifyPassword(password, current.password_hash)) {
      throw new Error("The current password does not match.");
    }
    if (next.length < 7) throw new Error("Use at least 7 characters for the new password.");
    await updateAdminPassword(admin.id, hashPassword(next));
    return { ok: "Password updated." };
  } catch (error) {
    return bubble(error);
  }
}

export async function placeOrder(input: {
  items: { productId: string; quantity: number; length: string | null; variations: { label: string; value: string }[] }[];
  customer: CartLine extends never ? never : {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    notes: string;
  };
  promoCode: string;
}) {
  try {
    const customer = {
      fullName: input.customer.fullName.trim(),
      email: input.customer.email.trim(),
      phone: input.customer.phone.trim(),
      address: input.customer.address.trim(),
      state: input.customer.state.trim(),
      city: input.customer.city.trim(),
      notes: input.customer.notes.trim().slice(0, 400),
    };
    if (customer.fullName.length < 2) return { ok: false as const, error: "Enter your full name." };
    if (!isValidEmail(customer.email)) return { ok: false as const, error: "Enter a valid email address." };
    if (!isNigerianPhone(customer.phone)) return { ok: false as const, error: "Enter a Nigerian phone number." };
    if (customer.address.length < 8 || customer.city.length < 2 || !customer.state) {
      return { ok: false as const, error: "Enter a complete delivery address." };
    }
    const catalogue = await listAdminProducts();
    const items: CartLine[] = [];
    for (const line of input.items) {
      const product = catalogue.find((item) => item.id === line.productId);
      if (!product || !product.available) return { ok: false as const, error: "A piece in your bag is no longer available." };
      const quantity = Number(line.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) return { ok: false as const, error: "Check the quantities in your bag." };
      if (product.stock < quantity) return { ok: false as const, error: `${product.name} does not have enough stock.` };
      if (product.lengths.length > 0 && !product.lengths.some((item) => item.label === line.length)) {
        return { ok: false as const, error: `Choose a length for ${product.name}.` };
      }
      for (const group of product.variations) {
        if (!line.variations.some((item) => item.label === group.label && group.options.includes(item.value))) {
          return { ok: false as const, error: `Choose ${group.label} for ${product.name}.` };
        }
      }
      const publicProduct = {
        ...product,
        category: product.collectionId,
        images: product.images.map((image) => image.src),
        stock: product.stock,
      };
      items.push({
        id: `${product.id}__${line.length ?? ""}__${line.variations.map((item) => `${item.label}:${item.value}`).sort().join("|")}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.src ?? "",
        unitPrice: unitPrice(publicProduct, line.length),
        length: line.length,
        variations: line.variations,
        quantity,
      });
    }
    if (items.length === 0) return { ok: false as const, error: "Your bag is empty." };
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const promotion = await getPromotion();
    const code = input.promoCode.trim().toUpperCase();
    const discount = promotion.active && promotion.code && code === promotion.code
      ? Math.round((subtotal * promotion.percent) / 100)
      : 0;
    const settings = await getSettings();
    const delivery = quoteDeliveryFee(subtotal - discount, settings.deliveryFee, settings.freeDeliveryThreshold);
    const orderNumber = createOrderNumber();
    const order = {
      id: crypto.randomUUID(),
      orderNumber,
      placedAt: new Date().toISOString(),
      status: "placed",
      customer,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        length: item.length,
        variations: item.variations,
      })),
      subtotal,
      discount,
      deliveryFee: delivery,
      total: subtotal - discount + delivery,
    };
    await commitOrder(order, items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
    refresh();
    return {
      ok: true as const,
      order: {
        orderNumber,
        placedAt: order.placedAt,
        customer,
        items,
        subtotal,
        discount,
        deliveryFee: delivery,
        total: order.total,
        demonstration: true as const,
      },
    };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "The order could not be placed." };
  }
}
