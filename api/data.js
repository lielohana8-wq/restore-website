export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Cloud-Id");
  if (req.method === "OPTIONS") return res.status(200).end();

  const API = "https://jsonblob.com/api/jsonBlob";
  const id = req.headers["x-cloud-id"] || process.env.CLOUD_ID || "";

  try {
    if (req.method === "GET") {
      if (!id) return res.status(200).json({});
      const r = await fetch(`${API}/${id}`, {
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      });
      if (!r.ok) return res.status(200).json({});
      const data = await r.json();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      if (id) {
        const r = await fetch(`${API}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body
        });
        return res.status(200).json({ id, ok: r.ok });
      } else {
        const r = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body
        });
        const loc = r.headers.get("location") || r.headers.get("Location") || "";
        const newId = loc.split("/").pop();
        if (newId && newId.length > 5) {
          return res.status(200).json({ id: newId, ok: true, isNew: true });
        }
        return res.status(200).json({ ok: false, error: "no id returned", headers: Object.fromEntries(r.headers.entries()) });
      }
    }
  } catch (e) {
    return res.status(500).json({ error: String(e), ok: false });
  }
  return res.status(405).json({ error: "method not allowed" });
}
