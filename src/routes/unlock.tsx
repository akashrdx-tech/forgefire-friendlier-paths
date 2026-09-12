import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { verifyGatePassword } from "@/lib/gate.functions";
import { unlockGate } from "@/lib/gate-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Add account — Shopify Research Tools" },
      { name: "description", content: "Sign in with your account to open the private workspace." },
      { property: "og:title", content: "Add account — Shopify Research Tools" },
      {
        property: "og:description",
        content: "Sign in with your account to open the private workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UnlockPage,
});

function UnlockPage() {
  const navigate = useNavigate();
  const verifyKey = useServerFn(verifyGatePassword);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await verifyKey({ data: { email: email.trim(), password } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      unlockGate();
      void navigate({ to: "/auth" });
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface px-4 py-3">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <form
          onSubmit={handle}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface">
            <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7 5.4c4.1-3.8 7.2-9.4 7.2-16.8z"
              />
              <path
                fill="#FBBC05"
                d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.8-6.1z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.5 0 11.9-2.1 15.9-5.9l-7-5.4c-2 1.3-4.6 2.1-8.9 2.1-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-center text-xl font-bold">Add your account</h1>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Sign in to continue to the private room
          </p>

          <div className="mt-5 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="key">Password</Label>
              <Input
                id="key"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <Button type="submit" className="mt-5 w-full" disabled={busy}>
            Next
          </Button>
        </form>
      </main>
    </div>
  );
}
