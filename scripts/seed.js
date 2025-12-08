// scripts/seed.js
// Pokretanje: node scripts/seed.js --users=500 --posts=1000 --batch=200 --mongo="<MONGO_URI>"
import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

dotenv.config();
faker.setLocale("hr");

const argv = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.split("=");
    if (arg.startsWith("--")) return [arg.replace(/^--/, ""), v ?? true];
    return [k, v];
  })
);

const MONGO_URI = argv.mongo || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI nije dostavljen. Postavi .env ili proslijedi --mongo argument.");
  process.exit(1);
}

const NUM_USERS = parseInt(argv.users || argv.u || 500, 10);
const NUM_POSTS = parseInt(argv.posts || argv.p || 1000, 10);
const BATCH = parseInt(argv.batch || 200, 10);
const PLAIN_PASS = argv.pass || "Test1234!";
const SALT_ROUNDS = 10;

const USERS_COLL = "korisniks";
const POSTS_COLL = "objavas";

console.log(`Seed start: users=${NUM_USERS}, posts=${NUM_POSTS}, batch=${BATCH}`);
console.log(`Connecting to ${MONGO_URI} ...`);
await mongoose.connect(MONGO_URI, {});
const db = mongoose.connection;
const usersColl = db.collection(USERS_COLL);
const postsColl = db.collection(POSTS_COLL);

const hashedPass = await bcrypt.hash(PLAIN_PASS, SALT_ROUNDS);
console.log("Using password (for generated users):", PLAIN_PASS);

const seedRunId = `seed-${Date.now()}`;

function genUser(i) {
  const ime = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const domain = "example.com";
  const email = `seed+${seedRunId}+${i}@${domain}`;
  const now = new Date();
  return {
    ime,
    email,
    lozinka: hashedPass,
    uloga: "user",
    spremljeneObjave: [],
    isVerified: true,
    verificationCode: null,
    verificationExpires: null,
    avatar: null,
    createdAt: now,
    updatedAt: now,
    seed: true,
    seedRunId,
  };
}

const tipovi = ["radionice", "kvizovi", "projekti", "natječaji", "ostalo"];
function genPost(i, autorId) {
  const naslov = faker.lorem.words(faker.datatype.number({ min: 3, max: 7 }));
  const sadrzaj = faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 3 }), "\n\n");
  const tip = tipovi[faker.datatype.number({ min: 0, max: tipovi.length - 1 })];
  const now = new Date();
  const datum = faker.date.recent(90);
  return {
    naslov,
    sadrzaj,
    tip,
    odsjek: null,
    autor: autorId,
    status: "odobreno",
    datum,
    views: faker.datatype.number({ min: 0, max: 300 }),
    saves: 0,
    pinned: false,
    urgentno: false,
    createdAt: now,
    updatedAt: now,
    seed: true,
    seedRunId,
  };
}

async function insertBatches(total, batchSize, genFn, collection, label) {
  let done = 0;
  let counter = 0;
  while (done < total) {
    const toDo = Math.min(batchSize, total - done);
    const docs = [];
    for (let i = 0; i < toDo; i++) {
      docs.push(genFn(counter++));
    }
    try {
      await collection.insertMany(docs, { ordered: false });
    } catch (err) {
      console.warn(`${label} batch insert warning:`, err.message);
    }
    done += toDo;
    process.stdout.write(`\r${label}: ${done}/${total}`);
    await new Promise((r) => setTimeout(r, 50));
  }
  console.log(`\n${label} insertion finished.`);
}

try {
  console.log("Inserting users...");
  await insertBatches(NUM_USERS, BATCH, genUser, usersColl, "Users");

  console.log("Fetching user ids...");
  const userCursor = usersColl.find({ seed: true, seedRunId }, { projection: { _id: 1 } });
  const userIds = [];
  while (await userCursor.hasNext()) {
    const d = await userCursor.next();
    userIds.push(d._id);
  }
  console.log(`Found ${userIds.length} seeded users.`);

  if (userIds.length === 0) throw new Error("No seeded users found, aborting posts creation.");

  console.log("Inserting posts...");
  let postCounter = 0;
  await insertBatches(NUM_POSTS, BATCH, () => {
    const autorId = userIds[faker.datatype.number({ min: 0, max: userIds.length - 1 })];
    return genPost(postCounter++, autorId);
  }, postsColl, "Posts");

  console.log("Seeding completed successfully.");
  console.log(`seedRunId = ${seedRunId}`);
} catch (err) {
  console.error("Seeding error:", err);
} finally {
  await mongoose.disconnect();
  console.log("Disconnected.");
  process.exit(0);
}
