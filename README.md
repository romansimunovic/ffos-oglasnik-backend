# 🎓 FFOS Oglasnik – Backend

Backend dio web aplikacije **FFOS Oglasnik**, razvijen u Node.js (Express) s MongoDB bazom podataka.  
Projekt je razvijen u sklopu kolegija **Projektni rad**, 2. godina diplomskog studija Informacijskih tehnologija na Filozofskom fakultetu u Osijeku.

---

## 👨‍🏫 Mentor

**izv. prof. dr. sc. Tomislav Jakopec**  
Odsjek za informacijske znanosti  
Filozofski fakultet Osijek

---

## 👥 Autori

- **Lucija Sabljak**
- **Franjo Čopčić**
- **Roman Šimunović**

---

## 📝 Opis projekta

Backend API omogućava:

- autentikaciju korisnika i admina (JWT)
- CRUD operacije za objave
- upravljanje korisnicima
- upravljanje odsjecima i obavijestima
- upload avatara i dokumenata
- seediranje testnih podataka (korisnici i objave)

Frontend aplikacija komunicira s ovim backend-om preko REST API-ja.

---

## 🚀 Tehnologije

- Node.js + Express
- MongoDB Atlas / lokalni MongoDB
- Mongoose
- JWT autentikacija
- Multer (upload slika)
- dotenv (env varijable)
- Render (deploy)

---

# 📦 Instalacija i pokretanje

## 1️⃣ Kloniranje repozitorija

```bash
git clone <URL_TVOG_BACKEND_REPOZITORIJA>
cd ffos-oglasnik-backend
````

## 2️⃣ Instalacija ovisnosti

```bash
npm install
```

---

# ⚙️ Postavljanje environment varijabli

U root folderu kreiraj **.env**:

```env
PORT=5000
MONGO_URI=<tvoj_mongo_atlas_uri>
JWT_SECRET=55tDUUjy12

ADMIN_EMAIL=admin@ffos.hr
ADMIN_NAME=FFOS Admin
ADMIN_PASSWORD=55tDUUjy12

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Za produkciju na Renderu:

```env
FRONTEND_URL=https://tvoj-frontend-vercel.url
NODE_ENV=production
```

---

# ▶️ Pokretanje servera

### Development

```bash
npm run dev
```

Server radi na:

👉 [http://localhost:5000](http://localhost:5000)

---

# 🧑‍💼 Admin korisnik

Pri prvom pokretanju server automatski kreira admin korisnika:

```
Email: admin@ffos.hr
Lozinka: 55tDUUjy12
```

---

# 🧪 Seeder skripte

U folderu `src/scripts/` nalaze se:

* `seed.js` → generira testne korisnike i objave
* `unseed.js` → briše generirane podatke

### Primjeri

Generiranje 500 korisnika i 1000 objava:

```bash
node src/scripts/seed.js --users=500 --posts=1000 --batch=200 --mongo="<MONGO_URI>"
```

Brisanje svih seeded podataka:

```bash
node src/scripts/unseed.js --mongo="<MONGO_URI>"
```

Brisanje po seedRunId:

```bash
node src/scripts/unseed.js --mongo="<MONGO_URI>" --seedRunId=seed-1731512664371
```

---

# 🌐 Deployment (Render)

1. Poveži backend repozitorij s Renderom
2. Build command:

```bash
npm install
```

3. Start command:

```bash
npm start
```

4. Postavi Environment Variables:

```
PORT
MONGO_URI
JWT_SECRET
FRONTEND_URL
NODE_ENV
ADMIN_EMAIL
ADMIN_NAME
ADMIN_PASSWORD
```

Render automatski pokreće server i održava ga online.

---

# ❗ Troubleshooting

### MongoDB Connection Error

* Provjeri MONGO_URI
* IP whitelist u Atlasu: `0.0.0.0/0`
* MongoDB servis radi (ako lokalno)

### CORS error

* FRONTEND_URL mora odgovarati URL-u frontenda (`http://localhost:5173` ili Vercel domena)

### Port 5000 zauzet

```bash
npx kill-port 5000
```

### Nedostaju folderi (uploads)

* Backend automatski kreira `/uploads/avatars`

---

# 📜 Licenca

Projekt izrađen u akademske i edukacijske svrhe na Filozofskom fakultetu u Osijeku.

```
