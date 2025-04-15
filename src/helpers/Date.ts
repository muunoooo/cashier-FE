export function formatDateToDate(dateString: string | undefined): string {
    if (!dateString) return "-";
  
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  }