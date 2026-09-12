import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPin, verifyPin, type VaultState } from "@/lib/chat-vault";

/**
 * Restore screen shown when the chat backup is locked. Until the recovery PIN
 * is created / entered, every conversation stays empty.
 */
export function VaultGate({
  userId,
  vault,
  onUnlocked,
}: {
  userId: string;
  vault: VaultState;
  onUnlocked: () => void;
}) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [hint, setHint] = useState("");
  const [busy, setBusy] = useState(false);

  const creating = !vault.hasPin;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (creating) {
        if (pin.trim().length < 4) {
          toast.error("Use at least 4 digits.");
          return;
        }
        if (pin !== confirmPin) {
          toast.error("The two PINs do not match.");
          return;
        }
        await createPin(userId, pin, hint);
        toast.success("Backup created. Your chats are restored.");
        onUnlocked();
      } else {
        const ok = await verifyPin(userId, pin);
        if (!ok) {
          toast.error("Wrong recovery PIN.");
          return;
        }
        toast.success("Chats restored from backup.");
        onUnlocked();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setPin("");
      setConfirmPin("");
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="rounded-full bg-primary/10 p-3 text-primary">
            {creating ? <ShieldCheck className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </span>
          <h2 className="text-base font-semibold">
            {creating ? "Create a recovery PIN" : "Restore your chats"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {creating
              ? "Your chat backup is protected by a PIN. Until you set one, all conversations stay empty on this device."
              : "Enter your recovery PIN to restore the chat backup on this device."}
          </p>
          {!creating && vault.hint ? (
            <p className="text-[11px] text-muted-foreground">Hint: {vault.hint}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="vault-pin">Recovery PIN</Label>
          <Input
            id="vault-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••"
          />
        </div>

        {creating ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="vault-confirm">Confirm PIN</Label>
              <Input
                id="vault-confirm"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="••••••"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vault-hint">Hint (optional)</Label>
              <Input
                id="vault-hint"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Something only you understand"
              />
            </div>
          </>
        ) : null}

        <Button type="submit" className="w-full" disabled={busy}>
          {creating ? "Create backup PIN" : "Restore chats"}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Nobody can recover this PIN for you. Keep it safe.
        </p>
      </form>
    </div>
  );
}
