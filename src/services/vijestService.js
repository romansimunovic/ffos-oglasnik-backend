import Vijest from "../models/Vijest.js";

export const getAll = async () => await Vijest.find().sort({ datum: -1 });
export const create = async (data) => await Vijest.create(data);
export const remove = async (id) => await Vijest.findByIdAndDelete(id);
