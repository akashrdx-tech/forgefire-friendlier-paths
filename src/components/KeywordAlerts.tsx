import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { setFaviconBadge } from "@/lib/favicon-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NICHES = [
  "leather wallet",
  "yoga mat",
  "skincare serum",
  "gaming chair",
  "pet grooming kit",
  "resistance bands",
  "led strip lights",
  "car phone holder",
  "ceramic mug",
  "kitchen organizer",
  "hair straightener",
  "camping lantern",
];

const TEMPLATES = [
  (k: string, n: number) => `New keyword found: "${k}" — best rating this week (${n} new data points)`,
  (k: string, n: number) => `"${k}" is trending up — ${n} fresh SERP updates available`,
  (k: string, n: number) => `Low competition alert: "${k}" scored A+ across ${n} stores`,
  (k: string, n: number) => `Volume spike on "${k}" — ${n} new reports added`,
  (k: string, n: number) => `Top pick: "${k}" has the best profit rating (${n} signals)`,
];

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h;
}

type Alert = { id: string; text: string; when: string };

export function KeywordAlerts() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const load = useCallback(async () => {
    if (!session?.user) {
      setAlerts([]);
      return;
    }
    const { data } = await supabase
      .from("messages")
      .select("sender_id, created_at")
      .eq("receiver_id", session.user.id)
      .is("read_at", null)
      .eq("deleted_for_everyone", false)
      .order("created_at", { ascending: false })
      .limit(200);

    const bySender = new Map<string, { count: number; last: string }>();
    for (const row of data ?? []) {
      const prev = bySender.get(row.sender_id);
      if (prev) prev.count += 1;
      else bySender.set(row.sender_id, { count: 1, last: row.created_at });
    }

    setAlerts(
      Array.from(bySender.entries()).map(([senderId, info]) => {
        const h = hash(senderId);
        const keyword = NICHES[h % NICHES.length] ?? "shopify keyword";
        const template = TEMPLATES[(h >> 4) % TEMPLATES.length] ?? TEMPLATES[0]!;
        return {
          id: senderId,
          keyword,
          text: template(keyword, info.count),
          when: new Date(info.last).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      }),
    );
  }, [session?.user?.id]);

  useEffect(() => {
    setFaviconBadge(alerts.length);
  }, [alerts.length]);

  useEffect(() => {
    void load();
    if (!session?.user) return;
    const channel = supabase
      .channel(`keyword-alerts-${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${session.user.id}`,
        },
        () => void load(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [session?.user?.id, load]);

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Keyword alerts" className="relative">
          <Bell className="h-5 w-5" />
          {alerts.length > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
              {alerts.length}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Keyword alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {alerts.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">No new alerts.</p>
        ) : (
          alerts.map((a) => (
            <DropdownMenuItem
              key={a.id}
              className="items-start gap-2 whitespace-normal py-2.5"
              onSelect={() => void navigate({ to: "/room" })}
            >
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="flex-1 text-xs leading-snug">
                {a.text}
                <span className="mt-1 block text-[10px] text-muted-foreground">{a.when}</span>
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
