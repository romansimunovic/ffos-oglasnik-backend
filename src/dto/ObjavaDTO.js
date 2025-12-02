const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ObjavaDTO = (objava) => ({
  _id: objava._id,
  naslov: objava.naslov,
  sadrzaj: objava.sadrzaj,
  tip: capitalize(objava.tip), // <-- OVDJE
  status: objava.status,
  autor: objava.autor || null,
  autorId: objava.autor?._id || null,
  autorIme: objava.autor?.ime || null,
  autorAvatar: objava.autor?.avatar || null,
  odsjek: objava.odsjek,
  platforma: objava.platforma,
  datum: objava.datum,
  views: objava.views || 0,
  saves: objava.saves || 0,
});
