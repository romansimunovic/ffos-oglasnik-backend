import Korisnik from "../models/Korisnik.js";

export const getAll = async () => await Korisnik.find();
export const create = async (data) => await Korisnik.create(data);
export const remove = async (id) => await Korisnik.findByIdAndDelete(id);
