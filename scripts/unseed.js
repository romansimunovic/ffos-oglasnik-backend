// Pokretanje: node scripts/unseed.js --mongo="<MONGO_URI>" --seedRunId=seed-123456789

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k,v] = a.split("=");
  if (a.startsWith("--")) return [a.replace(/^--/,'') , v ?? true];
  return [k,v];
}));

const MONGO_URI = argv.mongo || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI nije postavljen.");
  process.exit(1);
}

const SEED_RUN_ID = argv.seedRunId || argv.s || null;
const USERS_COLL = "korisniks";
const POSTS_COLL = "objavas";

console.log("Connecting to", MONGO_URI);
await mongoose.connect(MONGO_URI);
const db = mongoose.connection;
const usersColl = db.collection(USERS_COLL);
const postsColl = db.collection(POSTS_COLL);

try {
  let filter = { seed: true };
  if (SEED_RUN_ID) filter.seedRunId = SEED_RUN_ID;

  console.log("Deleting posts matching:", filter);
  const postsRes = await postsColl.deleteMany(filter);
  console.log("Deleted posts:", postsRes.deletedCount);

  console.log("Deleting users matching:", filter);
  const usersRes = await usersColl.deleteMany(filter);
  console.log("Deleted users:", usersRes.deletedCount);

  console.log("Unseed finished.");
} catch (err) {
  console.error("Unseed error:", err);
} finally {
  await mongoose.disconnect();
  process.exit(0);
}
