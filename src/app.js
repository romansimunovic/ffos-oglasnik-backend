import express from "express";
import cors from "cors";

import oglasRoutes from "./routes/oglasRoutes.js";
import korisnikRoutes from "./routes/korisnikRoutes.js";
import vijestRoutes from "./routes/vijestRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/oglasi", oglasRoutes);
app.use("/api/korisnici", korisnikRoutes);
app.use("/api/vijesti", vijestRoutes);

app.get("/", (req, res) => {
  res.send("FFOS Oglasnik backend uspješno pokrenut!");
});

export default app;
