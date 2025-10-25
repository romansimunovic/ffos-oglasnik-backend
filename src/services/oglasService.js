import Oglas from "../models/Oglas.js";

export const getAll = async () => await Oglas.find().sort({ createdAt: -1 });
export const create = async (data) => await Oglas.create(data);
export const remove = async (id) => await Oglas.findByIdAndDelete(id);
export const update = async (id, data) => await Oglas.findByIdAndUpdate(id, data, { new: true });
