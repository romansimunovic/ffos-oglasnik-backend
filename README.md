# FFOS Oglasnik – Backend

Ovo je repozitorij namijenjen backend dijelu projekta "Digitalni oglasnik" Filozofskog fakulteta u Osijeku (FFOS Oglasnik), izrađen u sklopu Projektnog rada na drugoj godini diplomskog studija Informacijskih tehnologija Filozofskog fakulteta u Osijeku.

Sustav je razvijen u Node.js i Express tehnologiji te pruža REST API za upravljanje oglasima, korisnicima i autentifikacijom. Podaci se pohranjuju u MongoDB Atlas bazi, uz podršku za JWT autentifikaciju i povezivanje s React frontend aplikacijom.

Mentor projekta: izv. prof. dr. sc. Tomislav Jakopec
Članovi tima: Franjo Čopčić, Roman Šimunović, Lucija Sabljak

## Preduvjeti

- Node.js (verzija 18+)
- MongoDB (lokalno, default port 27017)
- Visual Studio Code
- Git

Provjerite verzije:
node -v
npm -v
mongod --version



## Instalacija i pokretanje

1. Klonirati repozitorij:
    ```
    git clone https://github.com/romansimunovic/ffos-oglasnik-backend.git
    ```
2. Otvoriti folder u VS Code.
3. Instalirati ovisnosti:
    ```
    npm install
    ```
4. Napraviti `.env` datoteku u rootu projekta i zalijepiti:
    ```
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/ffos_oglasnik
    JWT_SECRET=super_tajni_kljuc
    ```
5. Pokrenuti MongoDB servis:
    ```
    mongod
    ```
   ili kroz MongoDB Compass (Connect).

6. Napuniti bazu testnim podacima:
    ```
    node seedAdmin.js
    node seedObjave.js
    node seedOdsjeci.js
    ```
7. Pokrenuti razvojni server:
    ```
    npm run dev
    ```

**Ako je uspješno:**
- MongoDB povezan (`ffos_oglasnik`)
- Server radi na portu 5000