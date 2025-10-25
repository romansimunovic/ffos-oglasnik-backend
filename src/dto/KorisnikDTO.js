export const KorisnikDTO = ({ _id, ime, email, uloga }) => {
  return Object.freeze({
    id: _id,
    ime,
    email,
    uloga
  });
};
