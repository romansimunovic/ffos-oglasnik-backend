# FFOS Oglasnik – Backend

Backend aplikacija za **FFOS Oglasnik**, razvijena u sklopu diplomskog studija Informacijskih tehnologija na Filozofskom fakultetu u Osijeku.  
**Mentor:** izv. prof. dr. sc. Tomislav Jakopec

---

## Preduvjeti

Prije pokretanja backend-a, provjeriti da su instalirani sljedeći alati:

- Node.js ≥ 18  
- MongoDB (lokalno, port 27017)  
- Visual Studio Code  
- Git  

Provjeriti verzije:

```bash
node -v
npm -v
mongod --version
````

---

## Instalacija i pokretanje

### 1. Klonirati repozitorij

```bash
git clone https://github.com/romansimunovic/ffos-oglasnik-backend.git
cd ffos-oglasnik-backend
```

Otvoriti folder u Visual Studio Codeu.

---

### 2. Instalacija ovisnosti

```bash
npm install
```

---

### 3. Konfiguracija `.env` datoteke

U root folderu kreirati datoteku **.env**.

> **Napomena:** `JWT_SECRET` zamijeniti vlastitim tajnim ključem za produkciju.

---

### 4. Pokrenuti MongoDB bazu

Pokreni MongoDB servis:

```bash
mongod
```

ili se povezati preko desktop app **MongoDB Compass**.

---

### 5. Ako želimo testirati admin funkcionalnost, ići ćemo preko seedera, u terminalu VSC ćemo napisati:

```bash
node seedAdmin.js
```

---

### 6. Pokreni backend server

```bash
npm run dev
```

---

## Troubleshooting

* **MongoDB connection error**: Provjerite je li MongoDB servis pokrenut i port ispravan (`27017`).
* **Port already in use**: Promijenite `PORT` u `.env` datoteci ili zatvorite aplikaciju koja koristi isti port.
* **Node modules error**: Obavezno pokrenite `npm install` prije pokretanja servera.

---
