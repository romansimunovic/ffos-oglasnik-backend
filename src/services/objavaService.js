import Objava from "../models/Objava.js";
import { ObjavaDTO } from "../dto/ObjavaDTO.js";

export const getAllObjave = async (tip = "sve", odsjekId, sortBy = "newest") => {
  const query = { status: "odobreno" };
  if (tip && tip !== "sve") query.tip = tip;
  if (odsjekId) query.odsjek = odsjekId;
  const sort = sortBy === "oldest" ? { datum: 1 } : { datum: -1 };

  const objave = await Objava.find(query)
    .populate("autor", "ime")
    .populate("odsjek", "naziv")
    .sort(sort);

  return objave.map((o) => ObjavaDTO(o));
};

export const getObjavaById = async (id) => {
  if (!id) return null;
  const objava = await Objava.findById(id)
    .populate("autor", "ime")
    .populate("odsjek", "naziv");
  return objava ? ObjavaDTO(objava) : null;
};

export const createObjava = async (data) => {
  const novaObjava = new Objava({
    naslov: data.naslov?.trim(),
    sadrzaj: data.sadrzaj?.trim(),
    tip: data.tip || "ostalo",
    odsjek: data.odsjek || null,
    autor: data.autor, // moraš postaviti iz tokena u kontroleru!
    status: "na čekanju",
    datum: new Date(),
    platforma: data.platforma || "web",
    link: data.link || null
  });

  const saved = await novaObjava.save();
  return ObjavaDTO(await saved.populate("autor", "ime").populate("odsjek", "naziv"));
};

export const updateObjavaStatus = async (id, status) => {
  if (!id || !status) return null;
  const updated = await Objava.findByIdAndUpdate(
    id, { status }, { new: true }
  ).populate("autor", "ime").populate("odsjek", "naziv");
  return updated ? ObjavaDTO(updated) : null;
};

export const getAllObjaveForAdmin = async () => {
  const objave = await Objava.find({})
    .populate("autor", "ime")
    .populate("odsjek", "naziv")
    .sort({ datum: -1 });
  return objave.map((o) => ObjavaDTO(o));
};

export const deleteObjava = async (id) => {
  if (!id) return null;
  const deleted = await Objava.findByIdAndDelete(id);
  return deleted ? ObjavaDTO(deleted) : null;
};

export const getSpremljeneObjave = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "spremljeneObjave",
        populate: { path: "odsjek", select: "naziv" }
      });

    if (!user) return res.status(404).json([]);

    const result = user.spremljeneObjave.map(objava => ({
      _id: objava._id,
      naslov: objava.naslov,
      sadrzaj: objava.sadrzaj,
      tip: objava.tip,
      status: objava.status,
      autor: objava.autor?.ime || objava.autor || "Nepoznato",
      odsjek: objava.odsjek
        ? { _id: objava.odsjek._id, naziv: objava.odsjek.naziv }
        : null,
      platforma: objava.platforma,
      link: objava.link || null,
      datum: objava.datum,
    }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Greška dohvaćanja spremljenih objava.", error: err.message });
  }
};
