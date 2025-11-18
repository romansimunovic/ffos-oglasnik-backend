import express from "express";
import axios from "axios";
const router = express.Router();

// POST /api/translate
router.post("/", async (req, res) => {
  const { text, to } = req.body;
  try {
    const resp = await axios.post(
      "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=" + to + "&q=" + encodeURIComponent(text)
    );
    // resp.data is e.g. [[[translated,"original",null,null,1]],...]
    const translated = resp.data[0][0][0];
    res.json({ translated });
  } catch (err) {
    res.status(500).json({ error: "Translation failed." });
  }
});

export default router;
