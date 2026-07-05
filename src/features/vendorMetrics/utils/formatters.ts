export function formatCentsToDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
export function formatCompactCents(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1000) return `$${(dollars / 1000).toFixed(1)}k`;
  return `$${dollars.toFixed(2)}`;
}
export function formatCompactNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING_PAYMENT: "Pendiente de pago",
    PAID: "Pagado",
    RECEIVED: "Recibido",
    PREPARING: "En preparación",
    READY: "Listo",
    PICKED_UP: "Recogido",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  };
  return labels[status] || status;
}
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING_PAYMENT: "#E53E3E",
    PAID: "#3182CE",
    RECEIVED: "#805AD5",
    PREPARING: "#D69E2E",
    READY: "#38A169",
    PICKED_UP: "#2B6CB0",
    COMPLETED: "#276749",
    CANCELLED: "#718096",
  };
  return colors[status] || "#A0AEC0";
}
