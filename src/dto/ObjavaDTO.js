export const ObjavaDTO = (o) => ({
  id: o._id,
  naslov: o.naslov,
  sadrzaj: o.sadrzaj,
  tip: o.tip,
  autor: o.autor,
  datum: o.datum,
  status: o.status,
});
