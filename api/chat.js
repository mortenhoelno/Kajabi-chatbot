import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Kun POST er støttet" });
    }

    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Mangler melding" });

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        input: [
          {
            role: "system",
            content: "Du er en varm coach som hjelper folk med sunn vektnedgang. Svar alltid kort, konkret og på norsk."
          },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await r.json();
    const reply = data?.output_text || "Beklager, jeg fikk ikke svar.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverfeil" });
  }
}
