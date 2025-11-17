export const ObjavaDTO = (objava) => ({
  _id: objava._id,
  naslov: objava.naslov,
  sadrzaj: objava.sadrzaj,
  tip: objava.tip,
  status: objava.status,
  autor: objava.autor?.ime,
  odsjek: objava.odsjek ? { _id: objava.odsjek._id, naziv: objava.odsjek.naziv } : null,
  platforma: objava.platforma,
  link: objava.link || null,
  datum: objava.datum,
});
