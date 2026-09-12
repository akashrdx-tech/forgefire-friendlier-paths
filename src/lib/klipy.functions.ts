import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/klipy";

const schema = z.object({
  media: z.enum(["gifs", "stickers", "clips"]),
  query: z.string().max(80).optional(),
  page: z.number().int().min(1).max(20).optional(),
});

export type MediaItem = { id: string; url: string; preview: string; width?: number; height?: number };

function pickUrl(file: unknown): { url: string; preview: string } | null {
  if (!file || typeof file !== "object") return null;
  const map = file as Record<string, any>;
  const order = ["md", "sm", "hd", "xs", "400", "320", "240"];
  const keys = [...order.filter((k) => k in map), ...Object.keys(map)];
  let full: string | null = null;
  let preview: string | null = null;
  for (const k of keys) {
    const v = map[k];
    if (!v || typeof v !== "object") continue;
    const url: string | undefined = v.gif?.url ?? v.webp?.url ?? v.url;
    if (!url) continue;
    if (!full) full = url;
    if (!preview) preview = url;
    if (full && preview) break;
  }
  return full ? { url: full, preview: preview ?? full } : null;
}

export const searchMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }): Promise<{ items: MediaItem[]; error?: string }> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const klipyKey = process.env["KLIPY_API_KEY"];
    if (!lovableKey || !klipyKey) return { items: [], error: "not_configured" };

    const endpoint = data.query?.trim() ? "search" : "trending";
    const params = new URLSearchParams({
      customer_id: String((context as { userId?: string }).userId ?? "anon"),
      page: String(data.page ?? 1),
      per_page: "24",
    });
    if (data.query?.trim()) params.set("q", data.query.trim());

    const res = await fetch(`${GATEWAY}/${data.media}/${endpoint}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": klipyKey,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`KLIPY request failed [${res.status}]: ${body}`);
      return { items: [], error: `upstream_${res.status}` };
    }

    const json = (await res.json()) as any;
    if (!json?.result) return { items: [], error: "upstream_error" };

    const rows: any[] = json?.data?.data ?? [];
    const items: MediaItem[] = [];
    for (const row of rows) {
      const picked = pickUrl(row?.file);
      if (picked) items.push({ id: String(row.id ?? picked.url), ...picked });
    }
    return { items };
  });
