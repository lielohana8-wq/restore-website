export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Cloud-Id");
  if (req.method === "OPTIONS") return res.status(200).end();

  const API = "https://jsonblob.com/api/jsonBlob";
  const id = req.headers["x-cloud-id"] || process.env.CLOUD_ID || "";

  try {
    if (req.method === "GET") {
      if (!id) return res.json({});
      const r = await fetch(`${API}/${id}`, { headers: { Accept: "application/json" } });
      if (!r.ok) return res.json({});
      return res.json(await r.json());
    }
    if (req.method === "POST") {
      const body = JSON.stringify(req.body);
      if (id) {
        await fetch(`${API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body });
        return res.json({ id, ok: true });
      } else {
        const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body });
        const loc = r.headers.get("location") || "";
        const newId = loc.split("/").pop();
        return res.json({ id: newId, ok: true, isNew: true });
      }
    }
  } catch (e) { return res.status(500).json({ error: e.message }); }
  return res.status(405).end();
}
