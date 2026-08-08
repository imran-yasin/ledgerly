/** Formats an integer-cent amount for display; business logic never uses floats. */
export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Parses a non-negative decimal currency value into integer cents.
 * Returns `null` instead of rounding malformed input.
 */
export function dollarsToCents(value: string | number) {
  const normalized = typeof value === "number" ? value.toFixed(2) : value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
