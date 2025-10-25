export function errorHandler(err, req, res, next) {
  console.error("❌ Greška:", err.message);
  res.status(500).json({
    message: "Došlo je do pogreške na serveru.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}
