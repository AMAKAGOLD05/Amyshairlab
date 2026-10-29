export type HeroButton = {
  label: string;
  href: string;
  enabled: boolean;
};

export type HeroSlide = {
  id: string;
  headline: string;
  supporting: string;
  buttonLabel: string;
  buttonHref: string;
  enabled: boolean;
};

export type HeroContent = {
  eyebrow: string;
  /** Kept in sync with the first enabled slide for page metadata. */
  headline: string;
  supporting: string;
  align: "left" | "center";
  background: string;
  textColor: string;
  imageId: string | null;
  imageAlt: string;
  imagePosition: string;
  mobileImageId: string | null;
  buttons: HeroButton[];
  /** Text-only slides layered over the fixed hero photograph. */
  slides: HeroSlide[];
};

export type HomeSectionType =
  | "collections"
  | "bestsellers"
  | "arrivals"
  | "featured"
  | "banner"
  | "story"
  | "custom"
  | "testimonials"
  | "gallery"
  | "newsletter";

export type HomeSection = {
  id: string;
  type: HomeSectionType;
  heading: string;
  supporting: string;
  visible: boolean;
  productIds: string[];
  bannerImageId: string | null;
  bannerAlt: string;
  bannerHref: string;
};

export type HomeContent = {
  announcement: string;
  announcementHref: string;
  hero: HeroContent;
  sections: HomeSection[];
};

export type StoreSettings = {
  name: string;
  short: string;
  email: string;
  phone: string;
  phoneHref: string;
  address: string;
  hours: string;
  instagram: string;
  tiktok: string;
  pinterest: string;
  whatsapp: string;
  announcement: string;
  announcementHref: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
};

export type Promotion = {
  code: string;
  percent: number;
  active: boolean;
  bannerText: string;
  bannerHref: string;
  bannerVisible: boolean;
};

export type MediaItem = {
  id: string;
  filename: string;
  alt: string;
  mime: string;
  createdAt: string;
};

export type Taxonomy = {
  id: string;
  name: string;
  shopName: string;
  description: string;
  image: string;
  showOnHome: boolean;
  sortOrder: number;
};
