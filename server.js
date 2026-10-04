const express = require("express");
const path = require("path");
const { EdgeTTS } = require("@travisvn/edge-tts");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/generate", async (req, res) => {
  try {
    const text = (req.body.text || "").trim();

    if (!text) {
      return res.status(400).json({ error: "اكتب النص أولاً" });
    }

    const tts = new EdgeTTS();

    await tts.synthesize({
      text,
      voice: "ar-EG-ShakirNeural",
      rate: "+5%",
      volume: "+0%",
      pitch: "+0Hz"
    });

    const audio = await tts.toBuffer();

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=mg-voice.mp3"
    });

    res.send(audio);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "حصل خطأ أثناء إنشاء الصوت"
    });
  }
});

app.listen(PORT, () => {
  console.log(`MG Voice Pro running on port ${PORT}`);
});
