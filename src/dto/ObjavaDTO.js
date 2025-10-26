export function ObjavaDTO({ _id, naslov, opis, tip, autor, datum, link, aktivna }) {
  return Object.freeze({
    id: _id,
    naslov,
    opis,
    tip,
    autor,
    datum,
    link,
    aktivna,
  });
}
