# FFOS Oglasnik – Backend

Ovo je repozitorij namijenjen backend dijelu projekta "Digitalni oglasnik" Filozofskog fakulteta u Osijeku (FFOS Oglasnik), izrađen u sklopu Projektnog rada na drugoj godini diplomskog studija Informacijskih tehnologija Filozofskog fakulteta u Osijeku.

Sustav je razvijen u Node.js i Express tehnologiji te pruža REST API za upravljanje oglasima, korisnicima i autentifikacijom. Podaci se pohranjuju u MongoDB Atlas bazi, uz podršku za JWT autentifikaciju i povezivanje s React frontend aplikacijom.

Mentor projekta: izv. prof. dr. sc. Tomislav Jakopec
Članovi tima: Franjo Čopčić, Roman Šimunović, Lucija Sabljak

FFOS Oglasnik – Backend

Ovaj dio projekta predstavlja backend aplikaciju za FFOS Oglasnik, razvijen u sklopu diplomskog studija Informacijskih tehnologija na Filozofskom fakultetu u Osijeku.
Mentor projekta: izv. prof. dr. sc. Tomislav Jakopec

Preduvjeti

Prije pokretanja backend-a, provjerite imate li instalirano:

Node.js ≥ 18

MongoDB (lokalno, port 27017)

Visual Studio Code

Git

Provjera verzije:

node -v
npm -v
mongod --version

Instalacija i pokretanje

Kloniranje repozitorija

git clone https://github.com/romansimunovic/ffos-oglasnik-backend.git
cd ffos-oglasnik-backend


Instalacija ovisnosti

npm install


Konfiguracija .env datoteke
Kreirajte .env u root folderu i dodajte:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ffos_oglasnik
JWT_SECRET=super_tajni_kljuc


Pokretanje MongoDB baze

mongod


ili se povežite kroz MongoDB Compass.

Popunjavanje baze testnim podacima

node seedAdmin.js
node seedObjave.js
node seedOdsjeci.js


Pokretanje backend servera

npm run dev


Ako je sve u redu, vidjet ćete poruke o uspješnoj povezanosti s bazom i portu 5000.

Dodatne napomene

Za produkciju, osigurajte MongoDB servis na produkcijskom serveru.

Backend podržava verzioniranje API-ja (npr. /api/v1/, /api/v2/).