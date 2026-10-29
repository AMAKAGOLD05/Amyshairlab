/**
 * Store defaults and static legal copy.
 * Catalogue, collections, categories, orders, and media live in MongoDB.
 */
export const announcement = {
  message: "",
  href: "/shop",
};

export const brand = {
  name: "Amy’s Hairlab",
  headline: "Let Your Hair Do the Talking.",
  supporting:
    "Discover luxury wigs crafted to elevate your beauty, express your style, and give you the confidence to stand out.",
  short:
    "Luxury hair, edited in Calabar for women who want movement, finish, and a look that feels entirely their own.",
};

/** Default delivery fee in naira until store settings are saved in MongoDB. */
export const deliveryFee = 5500;

/** Default free-delivery threshold in naira until store settings are saved in MongoDB. */
export const freeDeliveryThreshold = 200000;

export const contact = {
  email: "helloamyshairlab@gmail.com",
  phone: "+234 803 000 0000",
  phoneHref: "tel:+2348030000000",
  address: "Calabar, Cross River, Nigeria",
  hours: "Showroom visits by appointment.",
};

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "Pinterest", href: "https://www.pinterest.com/" },
  { label: "WhatsApp", href: "https://wa.me/2348030000000" },
] as const;

export const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const policies = {
  shipping: {
    title: "Shipping",
    paragraphs: [
      "Amy’s Hairlab is based in Calabar, Cross River. We deliver nationwide across Nigeria and internationally. Once your order is confirmed and payment is received, we prepare your pieces for dispatch from our Calabar studio.",
      "Orders are processed within five working days. Custom wigs and made-to-order pieces may take longer; we will confirm an expected timeline when your order is accepted.",
      `A flat delivery fee of ₦${deliveryFee.toLocaleString("en-NG")} is added at checkout for deliveries within Nigeria. Orders of ₦${freeDeliveryThreshold.toLocaleString("en-NG")} or more qualify for complimentary nationwide delivery within Nigeria. International delivery rates depend on destination and are confirmed when your order is accepted.`,
      "Delivery within Calabar and nearby Cross River locations typically takes 1–3 working days after dispatch. Nationwide deliveries to other Nigerian states usually take 3–7 working days. International deliveries usually take 7–14 working days, depending on your location and the courier schedule. Public holidays and courier delays may extend these windows.",
      "Please provide a complete delivery address, a reachable phone number, and any access notes that help the rider or courier find you. Incorrect or incomplete details can delay your order or cause a failed delivery attempt.",
      "When your order ships, we share tracking information where the courier provides it. Keep your order number and tracking details until the package arrives. If tracking stalls for more than 48 hours after the expected delivery window, contact us and we will follow up with the courier.",
      "Someone should be available to receive the package. If a delivery attempt fails, the courier may retry or hold the parcel. Extra storage or redelivery fees charged by the courier are the customer’s responsibility unless the failure was caused by our error.",
      "Risk passes to you once the courier marks the package as delivered. Please inspect your order promptly. If the package arrives damaged, open, or incomplete, report it within 48 hours with photographs so we can help under our Returns policy.",
      `For shipping questions about nationwide or international delivery, write to us through the Contact page or email ${contact.email}. This policy may be updated from time to time; the version on this page applies to your order.`,
    ],
  },
  returns: {
    title: "Returns",
    paragraphs: [
      "At Amy’s Hairlab, we take care with every piece we send out. If something arrives and it is not right, we want a clear path for you to tell us.",
      "You may request a return within 7 days of delivery for unused hair that is still in its original packaging, with seals unbroken, and without colouring, cutting, washing, styling, or other wear. Bundles, closures, frontals, and ready-to-wear wigs that meet these conditions may be considered.",
      "Custom wigs and made-to-order pieces are excluded from returns, because they are prepared to your measurements and preferences. Sale items marked as final sale are also excluded.",
      "To begin a return, contact us with your order number, the product name, and clear photographs of the item and packaging before you send anything back. We will confirm whether the return is approved and share the return address and next steps.",
      "Approved returns must be packed securely and sent with a trackable courier. Return shipping is paid by the customer unless we shipped the wrong item, a damaged item, or an incomplete order. Please keep your tracking number until the return is settled.",
      "Once we receive the package, we inspect it within 3–5 business days. If the hair meets our return conditions, we will arrange a refund to your original payment method, or an exchange for another piece of equal value when stock allows. Delivery fees are non-refundable unless the return is due to our error.",
      "If the item arrives damaged, incomplete, or not as described, contact us within 48 hours of delivery with photographs. We will replace the piece or refund you after we confirm the issue.",
      "Hygiene and quality matter in hair. We cannot accept returns that show wear, odour, adhesive residue, cut wefts, altered lace, or missing packaging. Amy’s Hairlab reserves the right to refuse a return that does not meet this policy.",
      `For return questions, write to us through the Contact page or email ${contact.email}. This policy may be updated from time to time; the version on this page is the one that applies to your order.`,
    ],
  },
  privacy: {
    title: "Privacy",
    paragraphs: [
      "Amy’s Hairlab (“we”, “us”, “the house”) respects your privacy. This policy explains what personal information we collect when you shop with us, contact us, or visit our website, how we use it, and the choices available to you.",
      `We are based in Calabar, Cross River, Nigeria. For privacy questions, write to us through the Contact page or email ${contact.email}.`,
      "We may collect the information you give us when you place an order, create or update an account, join our newsletter, request a custom wig, or send a message. This can include your name, email address, phone number, delivery address, order details, payment confirmation details (never your full card number through our forms), measurements and style preferences for custom pieces, and any notes you share with us.",
      "When you browse our site, we may also receive technical information such as your device type, browser, and approximate location, as well as how you use our pages. This helps us keep the site working, understand demand for textures and lengths, and improve your experience.",
      "We use your information to process and deliver orders nationwide and internationally; confirm payments and prevent fraud; respond to enquiries and custom-wig requests; send order updates and, where you have opted in, news about new pieces or offers; improve our catalogue and service; and meet legal or accounting duties.",
      "We do not sell your personal information. We share it only when needed to run the house: with courier and logistics partners who deliver your order; with payment processors who handle your transaction securely; with trusted service providers who help us host the site, send email, or support operations, under appropriate confidentiality; and when the law requires disclosure, or to protect the rights, safety, and property of Amy’s Hairlab and our clients.",
      "We keep personal information only as long as it is needed for the purposes above—typically for order fulfilment, customer care, and legal record-keeping—then delete or anonymise it when it is no longer required.",
      `You may ask to see the personal information we hold about you, correct it, or request that we stop using it for marketing. You may also ask us to delete information where we are not required to keep it. To make a request, email ${contact.email} with enough detail for us to find your records. We will respond within a reasonable time.`,
      "Our website may use cookies or similar tools that are necessary for shopping (for example, remembering your bag or wishlist) and, where used, for understanding site performance. You can control cookies through your browser settings; turning some off may affect how the site works.",
      "Our site is not directed at children. We do not knowingly collect personal information from anyone under 18. If you believe a child has given us details, please contact us so we can remove them.",
      "We take reasonable technical and organisational steps to protect your information. No method of transmission or storage is completely secure; please use a strong password for any account and do not share it.",
      "Our website may link to third-party sites. Their privacy practices are their own; we encourage you to read their policies before sharing information with them.",
      "We may update this Privacy policy from time to time. The version on this page is the one that applies when you use our site or place an order. Continued use after a change means you accept the updated policy.",
      `If you have questions about how Amy’s Hairlab handles your information, contact us at ${contact.email} or through the Contact page.`,
    ],
  },
} as const;

export type PolicySlug = keyof typeof policies;

export function quoteDeliveryFee(
  subtotal: number,
  fee = deliveryFee,
  threshold = freeDeliveryThreshold,
) {
  if (subtotal <= 0) return 0;
  if (subtotal >= threshold) return 0;
  return fee;
}
