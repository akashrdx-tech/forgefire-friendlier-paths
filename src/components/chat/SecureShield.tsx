import { useEffect, useRef, useState } from "react";
import { EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

/**
 * Blacks out the conversation whenever the screen could be captured:
 * window hidden/blurred, print dialog, screen-capture API, capture shortcuts.
 * Also disables text selection, copy, drag and the context menu.
 */
export function SecureShield({ active }: { active: boolean }) {
  const [blocked, setBlocked] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active || typeof document === "undefined") {
      setBlocked(false);
      return;
    }

    document.body.classList.add("secure-room-on");

    const flash = (message: string) => {
      setBlocked(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setBlocked(false), 1600);
      toast.error(message);
    };

    const onVisibility = () => setBlocked(document.visibilityState !== "visible");
    const onBlur = () => setBlocked(true);
    const onFocus = () => setBlocked(false);

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key;
      const capture =
        k === "PrintScreen" ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && ["3", "4", "5", "S", "s"].includes(k)) ||
        ((e.metaKey || e.ctrlKey) && (k === "p" || k === "P"));
      if (!capture) return;
      e.preventDefault();
      void navigator.clipboard?.writeText(" ").catch(() => undefined);
      flash("Screenshots are blocked in this secure room.");
    };

    const stop = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("contextmenu", stop);
    document.addEventListener("copy", stop);
    document.addEventListener("cut", stop);
    document.addEventListener("dragstart", stop);

    const beforePrint = () => setBlocked(true);
    const afterPrint = () => setBlocked(false);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    // Refuse in-page screen recording requests while the secure room is on.
    const media = navigator.mediaDevices as (MediaDevices & { getDisplayMedia?: unknown }) | undefined;
    const originalDisplayMedia = media?.getDisplayMedia?.bind(navigator.mediaDevices);
    if (media && originalDisplayMedia) {
      media.getDisplayMedia = async () => {
        flash("Screen recording is blocked in this secure room.");
        throw new DOMException("Screen capture blocked", "NotAllowedError");
      };
    }

    return () => {
      document.body.classList.remove("secure-room-on");
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("contextmenu", stop);
      document.removeEventListener("copy", stop);
      document.removeEventListener("cut", stop);
      document.removeEventListener("dragstart", stop);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      if (media && originalDisplayMedia) media.getDisplayMedia = originalDisplayMedia;
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [active]);

  if (!active || !blocked) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-background text-center">
      <EyeOff className="h-10 w-10 text-muted-foreground" />
      <p className="text-sm font-semibold">Content hidden</p>
      <p className="max-w-xs px-6 text-xs text-muted-foreground">
        This is a secure room. The conversation is hidden while the screen may be captured.
      </p>
      <span className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" /> Secure room active
      </span>
    </div>
  );
}
