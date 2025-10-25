export function VijestDTO({ _id, naslov, opis, izvor, link, datum }) {
  return Object.freeze({
    id: _id,
    naslov,
    opis,
    izvor,
    link,
    datum
  });
}
