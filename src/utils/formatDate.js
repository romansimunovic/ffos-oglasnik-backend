export function formatDate(date) {
  return new Date(date).toLocaleString("hr-HR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
