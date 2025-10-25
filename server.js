import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import cron from "node-cron";
import { fetchFFOSNews } from "./src/utils/fetchFFOSNews.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

// restart svakih 2 sata (za testiranje)
cron.schedule("0 */2 * * *", fetchFFOSNews);

app.listen(PORT, () => {
  console.log(` Server radi na portu ${PORT}`);
  fetchFFOSNews(); // odmah pokrećemo pri startu
});
