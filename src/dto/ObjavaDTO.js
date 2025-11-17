export const ObjavaDTO = (objava) => ({
  _id: objava._id,
  naslov: objava.naslov,
  sadrzaj: objava.sadrzaj,
  tip: objava.tip,
  status: objava.status,
  autor: objava.autor?.ime,
  odsjek: objava.odsjek,  // tipa string!
  platforma: objava.platforma,
  datum: objava.datum,
});
