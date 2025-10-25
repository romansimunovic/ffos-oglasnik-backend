export function OglasDTO({ _id, naslov, opis, kategorija, kontakt, slika, createdAt }) {
  return Object.freeze({
    id: _id,
    naslov,
    opis,
    kategorija,
    kontakt,
    slika,
    createdAt
  });
}
