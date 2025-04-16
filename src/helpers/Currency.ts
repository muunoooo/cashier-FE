export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatToRupiah(value: string | number): string {
  const number =
    typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
  if (isNaN(number)) return "";
  return "Rp " + number.toLocaleString("id-ID");
}

export function parseRupiahString(value: string): number {
  const raw = value.replace(/\D/g, "");
  return parseInt(raw) || 0;
}
