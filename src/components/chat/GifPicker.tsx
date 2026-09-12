import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { searchMedia, type MediaItem } from "@/lib/klipy.functions";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const EMOJI_STICKERS = [
  "😀","😂","🥹","😍","😎","🤩","🥳","😭","😡","🤯","🥶","🤒","🤗","🤫","🤔","🙄",
  "😴","🤤","😈","👻","💀","👽","🤖","🎃","❤️","🧡","💛","💚","💙","💜","🖤","💔",
  "💯","🔥","✨","🎉","🎊","🎁","🌈","☀️","🌙","⭐","⚡","❄️","🌸","🌻","🍀","🍎",
  "🍕","🍔","🍟","🍩","🍫","🍿","☕","🍵","⚽","🏀","🎮","🎧","🎸","🚗","✈️","🚀",
  "👍","👎","👏","🙏","💪","🤝","🫶","🤞","✌️","👋","🫡","🤙","💃","🕺","🐶","🐱",
];

type Tab = "gifs" | "stickers" | "emoji";

export function GifPicker({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPick: (payload: { kind: "gif" | "sticker"; content: string }) => void;
}) {
  const [tab, setTab] = useState<Tab>("gifs");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const run = useServerFn(searchMedia);

  useEffect(() => {
    if (!open || tab === "emoji") return;
    let active = true;
    setLoading(true);
    setProblem(null);
    const t = setTimeout(async () => {
      try {
        const res = await run({ data: { media: tab, query: query.trim() || undefined } });
        if (!active) return;
        setItems(res.items);
        setProblem(res.error ?? (res.items.length ? null : "empty"));
      } catch {
        if (active) setProblem("failed");
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [open, tab, query]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] overflow-hidden p-0">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Stickers &amp; GIFs</SheetTitle>
        </SheetHeader>

        <div className="flex gap-1 px-4 pt-3">
          {(
            [
              ["gifs", "GIFs"],
              ["stickers", "Stickers"],
              ["emoji", "Emoji"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                tab === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab !== "emoji" && (
          <div className="relative px-4 pt-3">
            <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tab}`}
              className="pl-9"
            />
          </div>
        )}

        <div className="mt-3 h-[calc(70vh-9.5rem)] overflow-y-auto px-4 pb-6">
          {tab === "emoji" ? (
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
              {EMOJI_STICKERS.map((e) => (
                <button
                  key={e}
                  onClick={() => onPick({ kind: "sticker", content: e })}
                  className="rounded-lg py-2 text-3xl transition-transform hover:scale-110"
                  aria-label={`Send ${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : items.length ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => onPick({ kind: tab === "gifs" ? "gif" : "sticker", content: it.url })}
                  className="overflow-hidden rounded-lg bg-muted"
                >
                  <img src={it.preview} alt="" loading="lazy" className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <p className="px-2 py-10 text-center text-sm text-muted-foreground">
              {problem === "not_configured"
                ? "GIF library is not connected yet. The Emoji tab works right away."
                : "Nothing found — try another word, or use the Emoji tab."}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
