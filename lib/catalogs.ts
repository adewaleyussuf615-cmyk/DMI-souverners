export const PRODUCT_CATALOGS = [
  "Affordable Gifts",
  "Apparel & Wearables",
  "Awards & Recognition",
  "Bags & Pouches",
  "Beauty Products",
  "Car Accessories",
  "Client Appreciation Gifts",
  "Conference & Event Gifts",
  "Customized Corporate Gift Sets",
  "Door Gifts",
  "Employee Recognition Gifts",
  "Executive & Luxury Gifts",
  "Gadgets & Electronics",
  "Lifestyle & Household Items",
  "Premium & Luxury Gift Collections",
  "Promotional Merchandise",
  "Stationery",
  "Travel Accessories",
] as const;

const CANONICAL_CATALOGS = new Map<string, string>(
  PRODUCT_CATALOGS.map((catalog) => [
    catalog.toLowerCase(),
    catalog,
  ])
);

const CATALOG_ALIASES: Record<string, string> = {
  "client appreciation gift": "Client Appreciation Gifts",
  "employee recognition": "Employee Recognition Gifts",
  "employee recognition gift": "Employee Recognition Gifts",
};

export function normalizeCatalog(value: unknown) {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

  if (!normalized) {
    return "";
  }

  const key = normalized.toLowerCase();

  return (
    CATALOG_ALIASES[key] ??
    CANONICAL_CATALOGS.get(key) ??
    normalized
  );
}