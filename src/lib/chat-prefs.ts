export type PatternKind = "none" | "dots" | "grid" | "waves" | "hearts" | "stars" | "diagonal";

export type ChatTheme = {
  id: string;
  name: string;
  /** flat colour or gradient for the whole chat canvas */
  bg: string;
  pattern: PatternKind;
  /** header + composer surface */
  surface: string;
  surfaceFg: string;
  bubbleOut: string;
  bubbleOutFg: string;
  bubbleIn: string;
  bubbleInFg: string;
  dark?: boolean;
};

function theme(
  id: string,
  name: string,
  bg: string,
  pattern: PatternKind,
  surface: string,
  surfaceFg: string,
  bubbleOut: string,
  bubbleOutFg: string,
  bubbleIn: string,
  bubbleInFg: string,
  dark = false,
): ChatTheme {
  return { id, name, bg, pattern, surface, surfaceFg, bubbleOut, bubbleOutFg, bubbleIn, bubbleInFg, dark };
}

const L = "oklch(0.24 0.03 250)";
const W = "oklch(1 0 0)";
const LW = "oklch(0.97 0.01 250)";

export const CHAT_THEMES: ChatTheme[] = [
  theme("default", "Emerald", "oklch(0.96 0.012 150)", "dots", W, L, "oklch(0.87 0.08 155)", "oklch(0.24 0.04 165)", W, L),
  theme("midnight", "Midnight", "oklch(0.22 0.03 260)", "dots", "oklch(0.26 0.03 260)", LW, "oklch(0.44 0.11 265)", LW, "oklch(0.3 0.03 260)", LW, true),
  theme("sunset", "Sunset", "linear-gradient(180deg, oklch(0.93 0.07 45), oklch(0.94 0.05 20))", "none", "oklch(0.98 0.02 40)", "oklch(0.28 0.06 45)", "oklch(0.82 0.11 55)", "oklch(0.28 0.06 45)", W, "oklch(0.28 0.04 45)"),
  theme("ocean", "Ocean", "linear-gradient(180deg, oklch(0.94 0.04 230), oklch(0.96 0.03 200))", "waves", "oklch(0.98 0.015 225)", "oklch(0.24 0.05 250)", "oklch(0.8 0.09 235)", "oklch(0.24 0.06 250)", W, "oklch(0.24 0.04 250)"),
  theme("rose", "Rose", "oklch(0.96 0.025 350)", "hearts", "oklch(0.99 0.012 350)", "oklch(0.28 0.06 350)", "oklch(0.84 0.09 350)", "oklch(0.28 0.07 350)", W, "oklch(0.26 0.04 340)"),
  theme("graphite", "Graphite", "oklch(0.17 0.005 250)", "none", "oklch(0.21 0.005 250)", LW, "oklch(0.36 0.01 250)", "oklch(0.97 0 0)", "oklch(0.25 0.005 250)", "oklch(0.95 0 0)", true),
  theme("sand", "Sand", "oklch(0.95 0.02 85)", "dots", "oklch(0.98 0.012 85)", "oklch(0.3 0.05 85)", "oklch(0.86 0.07 95)", "oklch(0.3 0.05 85)", W, "oklch(0.28 0.03 85)"),
  theme("violet", "Violet", "linear-gradient(180deg, oklch(0.94 0.05 300), oklch(0.96 0.03 320))", "stars", "oklch(0.98 0.02 300)", "oklch(0.26 0.07 300)", "oklch(0.8 0.11 300)", "oklch(0.26 0.07 300)", W, "oklch(0.26 0.04 300)"),
  theme("forest", "Forest", "oklch(0.24 0.04 155)", "dots", "oklch(0.28 0.04 155)", "oklch(0.96 0.01 155)", "oklch(0.42 0.09 155)", "oklch(0.97 0.01 155)", "oklch(0.3 0.03 155)", "oklch(0.96 0.01 155)", true),
  theme("mono", "Paper", "oklch(0.99 0 0)", "none", W, "oklch(0.2 0 0)", "oklch(0.9 0 0)", "oklch(0.2 0 0)", "oklch(0.96 0 0)", "oklch(0.2 0 0)"),
  theme("bubblegum", "Bubblegum", "linear-gradient(160deg, oklch(0.93 0.06 350), oklch(0.94 0.06 300))", "hearts", "oklch(0.98 0.02 340)", "oklch(0.28 0.06 340)", "oklch(0.83 0.12 340)", "oklch(0.24 0.07 340)", W, "oklch(0.26 0.04 340)"),
  theme("neon", "Neon Night", "linear-gradient(180deg, oklch(0.2 0.05 285), oklch(0.22 0.06 320))", "grid", "oklch(0.24 0.05 290)", LW, "oklch(0.55 0.19 320)", "oklch(0.99 0.01 320)", "oklch(0.28 0.04 290)", LW, true),
  theme("mint", "Mint", "oklch(0.96 0.03 175)", "dots", "oklch(0.99 0.015 175)", "oklch(0.25 0.05 180)", "oklch(0.86 0.09 175)", "oklch(0.24 0.05 180)", W, "oklch(0.24 0.03 190)"),
  theme("lavender", "Lavender", "oklch(0.95 0.035 290)", "none", "oklch(0.98 0.02 290)", "oklch(0.28 0.06 290)", "oklch(0.85 0.08 290)", "oklch(0.26 0.06 290)", W, "oklch(0.26 0.04 290)"),
  theme("coffee", "Coffee", "oklch(0.93 0.025 65)", "diagonal", "oklch(0.97 0.015 65)", "oklch(0.3 0.05 55)", "oklch(0.8 0.07 65)", "oklch(0.26 0.05 55)", W, "oklch(0.27 0.03 55)"),
  theme("sky", "Sky", "linear-gradient(180deg, oklch(0.93 0.05 235), oklch(0.98 0.02 215))", "none", "oklch(0.98 0.02 230)", "oklch(0.24 0.05 240)", "oklch(0.83 0.1 240)", "oklch(0.22 0.06 245)", W, "oklch(0.24 0.04 240)"),
  theme("cherry", "Cherry", "oklch(0.24 0.06 20)", "hearts", "oklch(0.28 0.06 20)", "oklch(0.97 0.01 20)", "oklch(0.48 0.16 20)", "oklch(0.99 0.01 20)", "oklch(0.31 0.04 20)", "oklch(0.96 0.01 20)", true),
  theme("aurora", "Aurora", "linear-gradient(160deg, oklch(0.22 0.05 200), oklch(0.26 0.08 160))", "waves", "oklch(0.25 0.05 190)", LW, "oklch(0.5 0.13 165)", "oklch(0.99 0.01 165)", "oklch(0.29 0.04 200)", LW, true),
  theme("peach", "Peach", "oklch(0.95 0.04 40)", "dots", "oklch(0.98 0.02 40)", "oklch(0.3 0.06 40)", "oklch(0.87 0.09 45)", "oklch(0.28 0.06 40)", W, "oklch(0.28 0.03 40)"),
  theme("lime", "Lime", "oklch(0.96 0.05 130)", "grid", "oklch(0.98 0.03 130)", "oklch(0.28 0.06 140)", "oklch(0.87 0.13 130)", "oklch(0.25 0.07 140)", W, "oklch(0.26 0.03 140)"),
  theme("slate", "Slate", "oklch(0.93 0.008 240)", "none", "oklch(0.98 0.005 240)", "oklch(0.25 0.02 245)", "oklch(0.85 0.03 245)", "oklch(0.24 0.03 245)", W, "oklch(0.24 0.02 245)"),
  theme("gold", "Midnight Gold", "oklch(0.2 0.02 90)", "stars", "oklch(0.24 0.02 90)", "oklch(0.96 0.02 90)", "oklch(0.55 0.11 90)", "oklch(0.16 0.03 90)", "oklch(0.27 0.02 90)", "oklch(0.95 0.02 90)", true),
  theme("space", "Deep Space", "linear-gradient(180deg, oklch(0.16 0.03 275), oklch(0.2 0.05 255))", "stars", "oklch(0.21 0.03 270)", LW, "oklch(0.42 0.12 275)", LW, "oklch(0.25 0.03 270)", LW, true),
  theme("candy", "Candy", "linear-gradient(160deg, oklch(0.95 0.05 200), oklch(0.95 0.06 330))", "dots", "oklch(0.98 0.02 320)", "oklch(0.26 0.05 320)", "oklch(0.85 0.1 200)", "oklch(0.24 0.06 230)", W, "oklch(0.26 0.04 320)"),
  theme("ink", "Ink", "oklch(0.15 0 0)", "grid", "oklch(0.19 0 0)", "oklch(0.96 0 0)", "oklch(0.32 0 0)", "oklch(0.98 0 0)", "oklch(0.23 0 0)", "oklch(0.95 0 0)", true),
  theme("teal", "Teal", "oklch(0.95 0.03 195)", "waves", "oklch(0.98 0.015 195)", "oklch(0.24 0.05 200)", "oklch(0.84 0.09 195)", "oklch(0.22 0.05 200)", W, "oklch(0.24 0.03 200)"),
  theme("messenger", "Messenger", "oklch(1 0 0)", "none", W, "oklch(0.2 0.02 250)", "linear-gradient(135deg, oklch(0.62 0.2 255), oklch(0.55 0.22 285))", "oklch(0.99 0.01 260)", "oklch(0.95 0.005 250)", "oklch(0.2 0.02 250)"),
  theme("messenger-dark", "Messenger Dark", "oklch(0.17 0.01 260)", "none", "oklch(0.21 0.015 260)", "oklch(0.97 0.005 260)", "linear-gradient(135deg, oklch(0.6 0.2 255), oklch(0.52 0.22 290))", "oklch(0.99 0.01 260)", "oklch(0.27 0.015 260)", "oklch(0.97 0.005 260)", true),
  theme("instagram", "Instagram", "oklch(1 0 0)", "none", W, "oklch(0.2 0.02 300)", "linear-gradient(135deg, oklch(0.66 0.19 30), oklch(0.58 0.24 340), oklch(0.55 0.22 285))", "oklch(0.99 0.01 340)", "oklch(0.96 0.005 300)", "oklch(0.2 0.02 300)"),
  theme("instagram-dark", "Instagram Dark", "oklch(0.15 0.01 300)", "none", "oklch(0.19 0.015 300)", "oklch(0.97 0.005 300)", "linear-gradient(135deg, oklch(0.64 0.2 30), oklch(0.56 0.24 340), oklch(0.53 0.22 285))", "oklch(0.99 0.01 340)", "oklch(0.25 0.015 300)", "oklch(0.97 0.005 300)", true),
  theme("telegram", "Telegram", "linear-gradient(160deg, oklch(0.93 0.05 235), oklch(0.95 0.04 260))", "none", "oklch(0.99 0.01 235)", "oklch(0.22 0.04 250)", "oklch(0.88 0.07 200)", "oklch(0.24 0.05 230)", W, "oklch(0.24 0.03 240)"),
  theme("snap", "Snap", "oklch(0.99 0.03 100)", "none", "oklch(1 0.02 100)", "oklch(0.2 0.02 100)", "linear-gradient(135deg, oklch(0.92 0.17 105), oklch(0.88 0.16 95))", "oklch(0.2 0.03 100)", W, "oklch(0.22 0.02 100)"),
];


export function patternCss(kind: PatternKind, fg: string): { backgroundImage?: string; backgroundSize?: string } {
  const c = `color-mix(in oklch, ${fg} 12%, transparent)`;
  switch (kind) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle at 1px 1px, ${c} 1px, transparent 0)`,
        backgroundSize: "22px 22px",
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
        backgroundSize: "28px 28px, 28px 28px",
      };
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${c} 0 2px, transparent 2px 14px)`,
        backgroundSize: "auto",
      };
    case "waves":
      return {
        backgroundImage: `radial-gradient(circle at 12px 24px, transparent 10px, ${c} 11px, transparent 12px)`,
        backgroundSize: "24px 24px",
      };
    case "hearts":
      return {
        backgroundImage: `radial-gradient(circle at 6px 8px, ${c} 4px, transparent 5px), radial-gradient(circle at 13px 8px, ${c} 4px, transparent 5px)`,
        backgroundSize: "38px 38px",
      };
    case "stars":
      return {
        backgroundImage: `radial-gradient(circle at 6px 6px, ${c} 1.4px, transparent 2px), radial-gradient(circle at 26px 20px, ${c} 1px, transparent 1.6px)`,
        backgroundSize: "40px 40px",
      };
    default:
      return {};
  }
}

export type ThreadPrefs = {
  themeId: string;
  customBg?: string | undefined;
  customOut?: string | undefined;
  fontScale?: number | undefined;
  /** storage path in the chat-media bucket for a custom wallpaper */
  wallpaperPath?: string | undefined;
  /** 0 – 80: how much the wallpaper is dimmed so text stays readable */
  wallpaperDim?: number | undefined;
  /** 0 – 10 px blur on the wallpaper */
  wallpaperBlur?: number | undefined;
  /** hide the theme's decorative pattern */
  noPattern?: boolean | undefined;
};


const THREAD_KEY = (me: string, peer: string) => `srt-theme-${me}-${peer}`;
const NICK_KEY = (me: string) => `srt-nicknames-${me}`;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getThreadPrefs(me: string, peer: string): ThreadPrefs {
  return read<ThreadPrefs>(THREAD_KEY(me, peer), { themeId: "default", fontScale: 1 });
}

export function saveThreadPrefs(me: string, peer: string, prefs: ThreadPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THREAD_KEY(me, peer), JSON.stringify(prefs));
}

export function themeById(id: string) {
  return CHAT_THEMES.find((t) => t.id === id) ?? CHAT_THEMES[0]!;
}

export function resolveTheme(prefs: ThreadPrefs): ChatTheme {
  const base = themeById(prefs.themeId);
  return {
    ...base,
    ...(prefs.customBg ? { bg: prefs.customBg } : {}),
    ...(prefs.customOut ? { bubbleOut: prefs.customOut } : {}),
  };
}

export function getNicknames(me: string): Record<string, string> {
  return read<Record<string, string>>(NICK_KEY(me), {});
}

export function setNickname(me: string, peer: string, nickname: string) {
  if (typeof window === "undefined") return;
  const all = getNicknames(me);
  if (nickname.trim()) all[peer] = nickname.trim();
  else delete all[peer];
  localStorage.setItem(NICK_KEY(me), JSON.stringify(all));
  window.dispatchEvent(new Event("srt-nicknames"));
}
