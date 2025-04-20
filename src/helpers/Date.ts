export function formatDateToDate(dateString: string | undefined): string {
  if (!dateString) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatIndonesianDateTime(dateString: string | Date): string {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${formattedDate}, ${hours}.${minutes} WIB`;
}
