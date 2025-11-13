# FFOS Oglasnik – Backend

Backend aplikacija za **FFOS Oglasnik**, razvijena u sklopu diplomskog studija Informacijskih tehnologija na Filozofskom fakultetu u Osijeku.  
**Mentor:** izv. prof. dr. sc. Tomislav Jakopec

---

## Preduvjeti

Prije pokretanja backend-a, provjerite imate li instalirano:

- Node.js ≥ 18  
- MongoDB (lokalno, port 27017)  
- Visual Studio Code  
- Git  

Provjera verzije:

```bash
node -v
npm -v
mongod --version
````

---

## Instalacija i pokretanje

### 1. Kloniranje repozitorija

```bash
git clone https://github.com/romansimunovic/ffos-oglasnik-backend.git
cd ffos-oglasnik-backend
```

Otvorite folder u Visual Studio Codeu.

---

### 2. Instalacija ovisnosti

```bash
npm install
```

---

### 3. Konfiguracija `.env` datoteke

U root folderu kreirajte datoteku `.env` sa sljedećim sadržajem:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ffos_oglasnik
JWT_SECRET=super_tajni_kljuc
```

> **Napomena:** `JWT_SECRET` zamijenite vlastitim tajnim ključem za produkciju.

---

### 4. Pokretanje MongoDB baze

Pokrenite MongoDB servis:

```bash
mongod
```

ili se povežite kroz **MongoDB Compass**.

---

### 5. Popunjavanje baze testnim podacima

```bash
node seedAdmin.js
node seedObjave.js
node seedOdsjeci.js
```

Ove skripte kreiraju administratorski račun, testne objave i odsjeke.

---

### 6. Pokretanje backend servera

```bash
npm run dev
```

Ako je sve u redu, vidjet ćete poruke:

```
MongoDB connected: ffos_oglasnik
Server running on port 5000
```

---

## Struktura projekta

```
ffos-oglasnik-backend/
├── controllers/   # Logika za API endpointove
├── models/        # Mongoose modeli
├── routes/        # Definicija ruta
├── middleware/    # Middleware funkcije (auth, error handling)
├── seed/          # Skripte za testne podatke
├── .env           # Konfiguracija okoliša
├── server.js      # Glavna datoteka servera
└── package.json
```

---

## API verzioniranje

Preporuka za budući razvoj:

* `/api/v1/...` – trenutna verzija API-ja
* `/api/v2/...` – nadogradnje i nove funkcionalnosti

---

## Dodatne napomene

* Za produkciju, osigurajte da MongoDB servis radi na produkcijskom serveru.
* Svaka nadogradnja backend dijela treba biti verzionirana.
* Sigurnost: čuvajte `.env` datoteku izvan verzioniranog repozitorija.

---

## Troubleshooting

* **MongoDB connection error**: Provjerite je li MongoDB servis pokrenut i port ispravan (`27017`).
* **Port already in use**: Promijenite `PORT` u `.env` datoteci ili zatvorite aplikaciju koja koristi isti port.
* **Node modules error**: Obavezno pokrenite `npm install` prije pokretanja servera.

---