import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "install-prompt-dismissed";

export function InstallAppPrompt() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
      if (localStorage.getItem(DISMISS_KEY) !== "1") setOpen(true);
    };
    const onInstalled = () => {
      setOpen(false);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setOpen(false);
  };

  if (!deferred) return null;

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-40 gap-1.5 shadow-card"
        onClick={() => setOpen(true)}
      >
        <Download className="h-4 w-4" />
        Install app
      </Button>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-sm rounded-xl border border-border bg-card p-4 shadow-card sm:inset-x-auto sm:right-4">
      <button
        aria-label="Close"
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setOpen(false);
        }}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Install Shopify Research Tools</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add it to your home screen for faster access and alerts.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => void install()}>
              Install
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                localStorage.setItem(DISMISS_KEY, "1");
                setOpen(false);
              }}
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
