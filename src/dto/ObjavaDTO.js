export const ObjavaDTO = (objava) => ({
  _id: objava._id,          // 👈 dodaj ovo
  naslov: objava.naslov,
  sadrzaj: objava.sadrzaj,
  tip: objava.tip,
  status: objava.status,
  autor: objava.autor,
  odsjek: objava.odsjek?.naziv || null,
  datum: objava.datum,
});
