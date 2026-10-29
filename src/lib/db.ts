import { Binary, type Db } from "mongodb";
import { defaultHeroSlides } from "@/data/hero";
import {
  announcement,
  brand,
  contact,
  deliveryFee,
  freeDeliveryThreshold,
  socialLinks,
} from "@/data/site";
import { hashPassword } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import type { LengthOption, Product, VariationGroup } from "@/types/catalog";
import type {
  HeroSlide,
  HomeContent,
  HomeSection,
  MediaItem,
  Promotion,
  StoreSettings,
  Taxonomy,
} from "@/types/content";

export { defaultHeroSlides } from "@/data/hero";

export type StoredImage = {
  id: string;
  src: string;
  alt: string;
  mediaId: string | null;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  compareAt: number | null;
  categoryId: string;
  collectionId: string;
  texture: string;
  lengths: LengthOption[];
  variations: VariationGroup[];
  stock: number;
  available: boolean;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  createdAt: string;
  images: StoredImage[];
};

export type StoredOrder = {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    notes: string;
  };
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    length: string | null;
    variations: { label: string; value: string }[];
  }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

type ProductImageDoc = {
  id: string;
  mediaId: string | null;
  externalUrl: string | null;
  alt: string;
  position: number;
};

type ProductDoc = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  compareAt: number | null;
  categoryId: string;
  collectionId: string;
  texture: string;
  lengths: LengthOption[];
  variations: VariationGroup[];
  stock: number;
  available: boolean;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  createdAt: string;
  images: ProductImageDoc[];
};

type CategoryDoc = {
  _id: string;
  name: string;
  description: string;
  imageId: string | null;
  imageUrl: string;
  sortOrder: number;
};

type CollectionDoc = {
  _id: string;
  name: string;
  shopName: string;
  description: string;
  imageId: string | null;
  imageUrl: string;
  showOnHome: boolean;
  sortOrder: number;
};

type MediaDoc = {
  _id: string;
  filename: string;
  mime: string;
  alt: string;
  bytes: Binary;
  createdAt: string;
};

type AdminDoc = {
  _id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type OrderDoc = {
  _id: string;
  orderNumber: string;
  placedAt: string;
  status: string;
  customer: StoredOrder["customer"];
  items: StoredOrder["items"];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

type SettingDoc = {
  _id: string;
  value: unknown;
};

const globalReady = globalThis as unknown as { __amysMongoReady?: Promise<void> };

async function database() {
  const db = await getDb();
  await ensureReady(db);
  return db;
}

async function ensureReady(db: Db) {
  if (!globalReady.__amysMongoReady) {
    globalReady.__amysMongoReady = (async () => {
      try {
        await Promise.all([
          db.collection("products").createIndex({ slug: 1 }, { unique: true }),
          db.collection("orders").createIndex({ orderNumber: 1 }, { unique: true }),
          db.collection("admins").createIndex({ email: 1 }, { unique: true }),
          db.collection("categories").createIndex({ sortOrder: 1 }),
          db.collection("collections").createIndex({ sortOrder: 1 }),
        ]);
        await seedDefaults(db);
      } catch (error) {
        globalReady.__amysMongoReady = undefined;
        throw error;
      }
    })();
  }
  await globalReady.__amysMongoReady;
}

function products(db: Db) {
  return db.collection<ProductDoc>("products");
}
function categories(db: Db) {
  return db.collection<CategoryDoc>("categories");
}
function collections(db: Db) {
  return db.collection<CollectionDoc>("collections");
}
function media(db: Db) {
  return db.collection<MediaDoc>("media");
}
function admins(db: Db) {
  return db.collection<AdminDoc>("admins");
}
function orders(db: Db) {
  return db.collection<OrderDoc>("orders");
}
function settings(db: Db) {
  return db.collection<SettingDoc>("settings");
}

export function defaultHome(): HomeContent {
  return {
    announcement: announcement.message,
    announcementHref: announcement.href,
    hero: {
      eyebrow: "Calabar · Luxury hair",
      headline: brand.headline,
      supporting: brand.supporting,
      align: "center",
      background: "",
      textColor: "",
      imageId: null,
      imageAlt:
        "Model wearing a long voluminous black body-wave wig with a gold top, photographed for Amy’s Hairlab.",
      imagePosition: "center center",
      mobileImageId: null,
      buttons: [
        { label: "ORDER NOW →", href: "/shop", enabled: true },
        { label: "Explore Our Collections", href: "/#collections", enabled: false },
      ],
      slides: defaultHeroSlides(),
    },
    sections: [
      section("collections", "Shop by collection", "Textures chosen for movement, finish, and the way the hair sits."),
      section("featured", "Featured", "Pieces chosen for the front of the house."),
      section("arrivals", "New arrivals", "The newest textures in the atelier."),
    ],
  };
}

function section(type: HomeSection["type"], heading: string, supporting: string): HomeSection {
  return {
    id: type,
    type,
    heading,
    supporting,
    visible: true,
    productIds: [],
    bannerImageId: null,
    bannerAlt: "",
    bannerHref: "/shop",
  };
}

export function defaultSettings(): StoreSettings {
  const social = Object.fromEntries(socialLinks.map((item) => [item.label.toLowerCase(), item.href]));
  return {
    name: brand.name,
    short: brand.short,
    email: contact.email,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    address: contact.address,
    hours: contact.hours,
    instagram: social.instagram ?? "",
    tiktok: social.tiktok ?? "",
    pinterest: social.pinterest ?? "",
    whatsapp: social.whatsapp ?? "",
    announcement: announcement.message,
    announcementHref: announcement.href,
    deliveryFee,
    freeDeliveryThreshold,
  };
}

export function defaultPromotion(): Promotion {
  return {
    code: "",
    percent: 0,
    active: false,
    bannerText: "",
    bannerHref: "/shop",
    bannerVisible: false,
  };
}

async function seedDefaults(db: Db) {
  const store = await settings(db).findOne({ _id: "store" });
  if (!store) await writeSetting(db, "store", defaultSettings());
  const promotion = await settings(db).findOne({ _id: "promotion" });
  if (!promotion) await writeSetting(db, "promotion", defaultPromotion());
  const home = await settings(db).findOne({ _id: "home_published" });
  if (!home) {
    const content = defaultHome();
    await writeSetting(db, "home_published", content);
    await writeSetting(db, "home_draft", content);
  }
  const adminCount = await admins(db).countDocuments();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (adminCount === 0 && email && password && password.length >= 7) {
    await admins(db).insertOne({
      _id: crypto.randomUUID(),
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    });
  }
}

async function readSetting(db: Db, key: string) {
  const row = await settings(db).findOne({ _id: key });
  return row?.value ?? null;
}

async function writeSetting(db: Db, key: string, value: unknown) {
  await settings(db).updateOne({ _id: key }, { $set: { value } }, { upsert: true });
}

export function mediaPath(id: string) {
  return `/api/media/${id}`;
}

function imageSrc(mediaId: string | null, externalUrl: string | null) {
  if (mediaId) return mediaPath(mediaId);
  return externalUrl ?? "";
}

function mapProduct(doc: ProductDoc): AdminProduct {
  const images = [...(doc.images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((image) => ({
      id: image.id,
      mediaId: image.mediaId,
      src: imageSrc(image.mediaId, image.externalUrl),
      alt: image.alt,
    }));
  return {
    id: doc._id,
    slug: doc.slug,
    name: doc.name,
    description: doc.description,
    details: doc.details ?? [],
    price: doc.price,
    compareAt: doc.compareAt ?? null,
    categoryId: doc.categoryId,
    collectionId: doc.collectionId,
    texture: doc.texture,
    lengths: doc.lengths ?? [],
    variations: doc.variations ?? [],
    stock: doc.stock,
    available: Boolean(doc.available),
    featured: Boolean(doc.featured),
    bestseller: Boolean(doc.bestseller),
    isNew: Boolean(doc.isNew),
    createdAt: doc.createdAt,
    images,
  };
}

export function toPublicProduct(product: AdminProduct): Product {
  const lengths = product.lengths;
  const price = lengths.length ? Math.min(...lengths.map((item) => item.price)) : product.price;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price,
    compareAt: product.compareAt,
    description: product.description,
    details: product.details,
    category: product.collectionId,
    texture: product.texture,
    lengths,
    variations: product.variations,
    images: product.images.map((image) => image.src).filter(Boolean),
    stock: product.available ? product.stock : 0,
    bestseller: product.bestseller,
    featured: product.featured,
    categoryId: product.categoryId,
    collectionId: product.collectionId,
    isNew: product.isNew,
    createdAt: product.createdAt,
  };
}

export async function listAdminProducts() {
  const db = await database();
  const rows = await products(db).find({}).sort({ createdAt: -1, name: 1 }).toArray();
  return rows.map(mapProduct);
}

export async function getAdminProduct(id: string) {
  const db = await database();
  const row = await products(db).findOne({ _id: id });
  return row ? mapProduct(row) : null;
}

export async function getAdminProductBySlug(slug: string) {
  const db = await database();
  const row = await products(db).findOne({ slug });
  return row ? mapProduct(row) : null;
}

export type ProductInput = Omit<AdminProduct, "images" | "createdAt"> & {
  createdAt?: string;
  images: { mediaId: string | null; externalUrl: string | null; alt: string }[];
};

export async function saveProduct(input: ProductInput) {
  const db = await database();
  const slugTaken = await products(db).findOne({ slug: input.slug, _id: { $ne: input.id } });
  if (slugTaken) throw new Error("Another product already uses that address.");
  const category = await categories(db).findOne({ _id: input.categoryId });
  if (!category) throw new Error("Choose a category.");
  const collection = await collections(db).findOne({ _id: input.collectionId });
  if (!collection) throw new Error("Choose a collection.");
  const createdAt = input.createdAt ?? new Date().toISOString().slice(0, 10);
  const price = input.lengths.length ? Math.min(...input.lengths.map((item) => item.price)) : input.price;
  const images: ProductImageDoc[] = input.images.map((image, index) => ({
    id: crypto.randomUUID(),
    mediaId: image.mediaId,
    externalUrl: image.externalUrl,
    alt: image.alt,
    position: index,
  }));
  await products(db).updateOne(
    { _id: input.id },
    {
      $set: {
        slug: input.slug,
        name: input.name,
        description: input.description,
        details: input.details,
        price,
        compareAt: input.compareAt,
        categoryId: input.categoryId,
        collectionId: input.collectionId,
        texture: input.texture,
        lengths: input.lengths,
        variations: input.variations,
        stock: input.stock,
        available: input.available,
        featured: input.featured,
        bestseller: input.bestseller,
        isNew: input.isNew,
        images,
      },
      $setOnInsert: { _id: input.id, createdAt },
    },
    { upsert: true },
  );
}

export async function deleteProduct(id: string) {
  const db = await database();
  await products(db).deleteOne({ _id: id });
}

export async function listCategories(): Promise<Taxonomy[]> {
  const db = await database();
  const rows = await categories(db).find({}).sort({ sortOrder: 1, name: 1 }).toArray();
  return rows.map((row) => ({
    id: row._id,
    name: row.name,
    shopName: row.name,
    description: row.description,
    image: imageSrc(row.imageId, row.imageUrl || null),
    showOnHome: false,
    sortOrder: row.sortOrder,
  }));
}

export async function saveCategory(input: {
  id: string;
  name: string;
  description: string;
  imageId: string | null;
  imageUrl: string;
}) {
  const db = await database();
  const existing = await categories(db).findOne({ _id: input.id });
  const sortOrder = existing?.sortOrder ?? (await categories(db).countDocuments());
  await categories(db).updateOne(
    { _id: input.id },
    {
      $set: {
        name: input.name,
        description: input.description,
        imageId: input.imageId,
        imageUrl: input.imageUrl,
        sortOrder,
      },
      $setOnInsert: { _id: input.id },
    },
    { upsert: true },
  );
}

export async function deleteCategory(id: string) {
  const db = await database();
  const used = await products(db).countDocuments({ categoryId: id });
  if (used > 0) throw new Error("Move the products in this category before deleting it.");
  await categories(db).deleteOne({ _id: id });
}

export async function listCollections(): Promise<Taxonomy[]> {
  const db = await database();
  const rows = await collections(db).find({}).sort({ sortOrder: 1, name: 1 }).toArray();
  return rows.map((row) => ({
    id: row._id,
    name: row.name,
    shopName: row.shopName,
    description: row.description,
    image: imageSrc(row.imageId, row.imageUrl || null),
    showOnHome: Boolean(row.showOnHome),
    sortOrder: row.sortOrder,
  }));
}

export async function saveCollection(input: {
  id: string;
  name: string;
  shopName: string;
  description: string;
  imageId: string | null;
  imageUrl: string;
  showOnHome: boolean;
}) {
  const db = await database();
  const existing = await collections(db).findOne({ _id: input.id });
  const sortOrder = existing?.sortOrder ?? (await collections(db).countDocuments());
  await collections(db).updateOne(
    { _id: input.id },
    {
      $set: {
        name: input.name,
        shopName: input.shopName,
        description: input.description,
        imageId: input.imageId,
        imageUrl: input.imageUrl,
        showOnHome: input.showOnHome,
        sortOrder,
      },
      $setOnInsert: { _id: input.id },
    },
    { upsert: true },
  );
}

export async function deleteCollection(id: string) {
  const db = await database();
  const used = await products(db).countDocuments({ collectionId: id });
  if (used > 0) throw new Error("Move the products in this collection before deleting it.");
  await collections(db).deleteOne({ _id: id });
}

export async function setCollectionProducts(collectionId: string, productIds: string[]) {
  const db = await database();
  const current = await products(db).find({ collectionId }).project({ _id: 1 }).toArray();
  const keep = new Set(productIds);
  const fallback = await collections(db).findOne({ _id: { $ne: collectionId } }, { sort: { sortOrder: 1 } });
  const leaving = current.filter((row) => !keep.has(row._id));
  if (leaving.length > 0 && !fallback) {
    throw new Error("Create another collection before removing every product from this one.");
  }
  const col = products(db);
  for (const row of leaving) {
    await col.updateOne({ _id: row._id }, { $set: { collectionId: fallback!._id } });
  }
  for (const id of productIds) {
    await col.updateOne({ _id: id }, { $set: { collectionId } });
  }
}

export async function listMedia(): Promise<MediaItem[]> {
  const db = await database();
  const rows = await media(db)
    .find({}, { projection: { bytes: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return rows.map((row) => ({
    id: row._id,
    filename: row.filename,
    alt: row.alt,
    mime: row.mime,
    createdAt: row.createdAt,
  }));
}

export async function getMediaFile(id: string) {
  const db = await database();
  const row = await media(db).findOne({ _id: id }, { projection: { mime: 1, bytes: 1 } });
  if (!row) return undefined;
  return { mime: row.mime, bytes: Buffer.from(row.bytes.buffer) };
}

export async function insertMedia(file: { filename: string; mime: string; bytes: Buffer; alt: string }) {
  const db = await database();
  const id = crypto.randomUUID();
  await media(db).insertOne({
    _id: id,
    filename: file.filename,
    mime: file.mime,
    alt: file.alt,
    bytes: new Binary(file.bytes),
    createdAt: new Date().toISOString(),
  });
  return id;
}

export async function replaceMedia(id: string, file: { filename: string; mime: string; bytes: Buffer }) {
  const db = await database();
  const result = await media(db).updateOne(
    { _id: id },
    { $set: { filename: file.filename, mime: file.mime, bytes: new Binary(file.bytes) } },
  );
  if (result.matchedCount === 0) throw new Error("That image is no longer in the library.");
}

export async function updateMediaAlt(id: string, alt: string) {
  const db = await database();
  await media(db).updateOne({ _id: id }, { $set: { alt } });
}

export async function mediaUsages(id: string) {
  const db = await database();
  const usages: string[] = [];
  const productRows = await products(db)
    .find({ "images.mediaId": id }, { projection: { name: 1 } })
    .toArray();
  for (const product of productRows) usages.push(`Product: ${product.name}`);
  const categoryRows = await categories(db).find({ imageId: id }, { projection: { name: 1 } }).toArray();
  for (const category of categoryRows) usages.push(`Category: ${category.name}`);
  const collectionRows = await collections(db).find({ imageId: id }, { projection: { name: 1 } }).toArray();
  for (const collection of collectionRows) usages.push(`Collection: ${collection.name}`);
  const homes = await Promise.all([readSetting(db, "home_draft"), readSetting(db, "home_published")]);
  if (homes.some((home) => JSON.stringify(home ?? "").includes(id))) usages.push("Homepage");
  return usages;
}

export async function deleteMedia(id: string) {
  const usages = await mediaUsages(id);
  if (usages.length > 0) {
    throw new Error(`This image is still used. ${usages.join(". ")}. Replace it, or remove it from those places first.`);
  }
  const db = await database();
  await media(db).deleteOne({ _id: id });
}

export async function getSettings(): Promise<StoreSettings> {
  const db = await database();
  return { ...defaultSettings(), ...((await readSetting(db, "store")) as Partial<StoreSettings>) };
}

export async function saveSettings(next: StoreSettings) {
  const db = await database();
  await writeSetting(db, "store", next);
}

export async function getPromotion(): Promise<Promotion> {
  const db = await database();
  return { ...defaultPromotion(), ...((await readSetting(db, "promotion")) as Partial<Promotion>) };
}

export async function savePromotion(promotion: Promotion) {
  const db = await database();
  await writeSetting(db, "promotion", promotion);
}

function normalizeHeroSlides(hero: HomeContent["hero"] | undefined, fallback: HeroSlide[]): HeroSlide[] {
  if (hero?.slides && hero.slides.length > 0) return hero.slides;
  if (hero?.headline?.trim()) {
    const primary = hero.buttons?.find((button) => button.enabled) ?? hero.buttons?.[0];
    return [
      {
        id: "slide-legacy",
        headline: hero.headline,
        supporting: hero.supporting ?? "",
        buttonLabel: primary?.label || "ORDER NOW →",
        buttonHref: primary?.href || "/shop",
        enabled: true,
      },
      ...fallback.filter((slide) => slide.id !== "slide-order-now"),
    ];
  }
  return fallback;
}

export async function getHome(which: "home_draft" | "home_published"): Promise<HomeContent> {
  const db = await database();
  const stored = (await readSetting(db, which)) as HomeContent | null;
  const base = defaultHome();
  if (!stored) return base;
  const slides = normalizeHeroSlides(stored.hero, base.hero.slides);
  const lead = slides.find((slide) => slide.enabled && slide.headline.trim()) ?? slides[0];
  return {
    ...base,
    ...stored,
    hero: {
      ...base.hero,
      ...stored.hero,
      buttons: stored.hero?.buttons?.length > 0 ? stored.hero.buttons : base.hero.buttons,
      slides,
      headline: lead?.headline || base.hero.headline,
      supporting: lead?.supporting || base.hero.supporting,
    },
    sections: stored.sections?.length ? stored.sections : base.sections,
  };
}

export async function saveHome(which: "home_draft" | "home_published", content: HomeContent) {
  const db = await database();
  await writeSetting(db, which, content);
  if (which === "home_published") {
    const storeSettings = await getSettings();
    storeSettings.announcement = content.announcement;
    storeSettings.announcementHref = content.announcementHref;
    await writeSetting(db, "store", storeSettings);
  }
}

export async function adminCount() {
  const db = await database();
  return admins(db).countDocuments();
}

export async function findAdmin(id: string) {
  const db = await database();
  const row = await admins(db).findOne({ _id: id }, { projection: { email: 1 } });
  return row ? { id: row._id, email: row.email } : undefined;
}

export async function findAdminByEmail(email: string) {
  const db = await database();
  const row = await admins(db).findOne({ email });
  return row
    ? { id: row._id, email: row.email, password_hash: row.passwordHash }
    : undefined;
}

export async function updateAdminPassword(id: string, passwordHash: string) {
  const db = await database();
  await admins(db).updateOne({ _id: id }, { $set: { passwordHash } });
}

export async function listOrders() {
  const db = await database();
  const rows = await orders(db).find({}).sort({ placedAt: -1 }).limit(200).toArray();
  return rows.map(mapOrder);
}

export async function getOrder(id: string) {
  const db = await database();
  const row = await orders(db).findOne({ $or: [{ _id: id }, { orderNumber: id }] });
  return row ? mapOrder(row) : null;
}

function mapOrder(row: OrderDoc): StoredOrder {
  return {
    id: row._id,
    orderNumber: row.orderNumber,
    placedAt: row.placedAt,
    status: row.status,
    customer: row.customer,
    items: row.items,
    subtotal: row.subtotal,
    discount: row.discount,
    deliveryFee: row.deliveryFee,
    total: row.total,
  };
}

export async function setOrderStatus(id: string, status: string) {
  const allowed = ["placed", "confirmed", "packed", "dispatched", "delivered", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Choose a valid order status.");
  const db = await database();
  await orders(db).updateOne({ _id: id }, { $set: { status } });
}

export async function insertOrder(order: StoredOrder) {
  const db = await database();
  await orders(db).insertOne({
    _id: order.id,
    orderNumber: order.orderNumber,
    placedAt: order.placedAt,
    status: order.status,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    total: order.total,
  });
}

export async function adjustStock(productId: string, quantity: number) {
  const db = await database();
  await products(db).updateOne({ _id: productId }, [
    { $set: { stock: { $max: [{ $subtract: ["$stock", quantity] }, 0] } } },
  ]);
}

export async function commitOrder(order: StoredOrder, lines: { productId: string; quantity: number }[]) {
  const db = await database();
  const productCol = products(db);
  for (const line of lines) {
    const row = await productCol.findOne({ _id: line.productId });
    if (!row || !row.available || row.stock < line.quantity) {
      throw new Error("A piece in your bag is no longer available in that quantity.");
    }
  }
  for (const line of lines) {
    const result = await productCol.updateOne(
      { _id: line.productId, available: true, stock: { $gte: line.quantity } },
      { $inc: { stock: -line.quantity } },
    );
    if (result.modifiedCount !== 1) {
      throw new Error("A piece in your bag is no longer available in that quantity.");
    }
  }
  try {
    await orders(db).insertOne({
      _id: order.id,
      orderNumber: order.orderNumber,
      placedAt: order.placedAt,
      status: order.status,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryFee: order.deliveryFee,
      total: order.total,
    });
  } catch (error) {
    for (const line of lines) {
      await productCol.updateOne({ _id: line.productId }, { $inc: { stock: line.quantity } });
    }
    throw error;
  }
}

export function emptySiteBundle() {
  return {
    products: [] as Product[],
    collections: [] as Taxonomy[],
    categories: [] as Taxonomy[],
    settings: defaultSettings(),
    home: defaultHome(),
    promotion: defaultPromotion(),
  };
}

export async function loadSiteBundle() {
  try {
    const [adminProducts, collectionRows, categoryRows, storeSettings, home, promotion] = await Promise.all([
      listAdminProducts(),
      listCollections(),
      listCategories(),
      getSettings(),
      getHome("home_published"),
      getPromotion(),
    ]);
    return {
      products: adminProducts.map(toPublicProduct),
      collections: collectionRows,
      categories: categoryRows,
      settings: storeSettings,
      home,
      promotion,
    };
  } catch (error) {
    console.error("MongoDB is unavailable; serving an empty catalogue.", error);
    return emptySiteBundle();
  }
}

export async function ensureStore() {
  await database();
}
