import * as authService from "../services/authService.js";

export const registracija = async (req, res) => {
  try {
    const result = await authService.registracija(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const prijava = async (req, res) => {
  try {
    const result = await authService.prijava(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
