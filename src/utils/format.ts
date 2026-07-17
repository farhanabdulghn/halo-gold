export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatGram(value: number, fractionDigits = 4): string {
  const formatted = value.toLocaleString("id-ID", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${formatted} gram`;
}

/** Strips everything except digits, returning a safe integer for currency input fields. */
export function parseNominalInput(rawValue: string): number {
  const digitsOnly = rawValue.replace(/[^0-9]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
}
