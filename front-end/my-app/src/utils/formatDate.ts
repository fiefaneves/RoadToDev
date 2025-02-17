export function formatDate(dateString: string): string {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }