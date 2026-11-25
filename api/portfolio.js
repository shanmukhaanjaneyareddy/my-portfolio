export default async function handler(req, res) {
  const rawUrl = process.env.VITE_SUPABASE_URL || "";
  const supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
  const supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: "Supabase environment variables missing on Vercel" });
  }

  const endpoint = `${supabaseUrl}/rest/v1/portfolio_config`;

  try {
    if (req.method === "GET") {
      const response = await fetch(`${endpoint}?id=eq.1&select=data`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });
      const rows = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: rows });
      }
      return res.status(200).json({ data: rows?.[0]?.data || null });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { data } = body || {};
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: 1,
          data,
          updated_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    const detail = err?.cause?.code || err?.cause?.message || err.message || "Proxy fetch failed";
    return res.status(500).json({
      error: `Proxy error: ${detail}`,
      urlChecked: supabaseUrl,
    });
  }
}