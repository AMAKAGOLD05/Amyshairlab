/** Collection slug. New collections created in the atelier are included. */
export type CategorySlug = string;

export type LengthOption = {
  label: string;
  /** Price in Nigerian naira for this length. */
  price: number;
};

export type VariationGroup = {
  id: string;
  label: string;
  options: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Price in Nigerian naira. When lengths are listed, this matches the lowest length price. */
  price: number;
  /** Previous price, shown when a discount is active. */
  compareAt?: number | null;
  description: string;
  details: string[];
  category: CategorySlug;
  texture: string;
  lengths: LengthOption[];
  variations: VariationGroup[];
  /** Full image URLs. An empty array shows the on-site placeholder. */
  images: string[];
  stock: number;
  bestseller: boolean;
  featured?: boolean;
  /** Shop collection id. `category` stays as that slug for the existing filters. */
  categoryId?: string;
  collectionId?: string;
  isNew: boolean;
  /** ISO date used for “newest” sorting. */
  createdAt: string;
};

export type CartLine = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  length: string | null;
  variations: { label: string; value: string }[];
  quantity: number;
};

export type StoredOrder = {
  orderNumber: string;
  placedAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    notes: string;
  };
  items: CartLine[];
  subtotal: number;
  discount?: number;
  deliveryFee: number;
  total: number;
  demonstration: true;
};
