export const ObjavaDTO = (objava) => ({
  _id: objava._id,
  naslov: objava.naslov,
  sadrzaj: objava.sadrzaj,
  tip: objava.tip,
  status: objava.status,

  // cijeli autor objekt (ako je populate)
  autor: objava.autor || null,

  // dodatna polja koja frontend koristi
  autorId: objava.autor?._id || null,
  autorIme: objava.autor?.ime || null,
  autorAvatar: objava.autor?.avatar || null,

  odsjek: objava.odsjek,         // string ili populated objekt - frontend to već hendla
  platforma: objava.platforma,
  datum: objava.datum,
});
