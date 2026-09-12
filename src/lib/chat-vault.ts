import { supabase } from "@/integrations/supabase/client";

/**
 * Chat recovery PIN ("restore chat").
 *
 * The PIN is never stored in plain text: only a SHA-256 hash salted with the
 * user id is kept. Until the PIN is entered on a device, the app renders every
 * conversation as empty.
 */

const UNLOCK_KEY = (uid: string) => `srt-vault-open-${uid}`;

export async function hashPin(pin: string, userId: string) {
  const data = new TextEncoder().encode(`srt-vault:${userId}:${pin.trim()}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type VaultState = {
  /** the user has created a recovery PIN */
  hasPin: boolean;
  /** this device has unlocked the backup */
  unlocked: boolean;
  hint: string | null;
};

export function isUnlockedLocally(userId: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(UNLOCK_KEY(userId)) === "1";
}

export function setUnlockedLocally(userId: string, open: boolean) {
  if (typeof window === "undefined") return;
  if (open) localStorage.setItem(UNLOCK_KEY(userId), "1");
  else localStorage.removeItem(UNLOCK_KEY(userId));
  window.dispatchEvent(new Event("srt-vault"));
}

export async function loadVault(userId: string): Promise<VaultState> {
  const { data } = await supabase
    .from("chat_vault")
    .select("pin_hash, hint")
    .eq("user_id", userId)
    .maybeSingle();

  const hasPin = Boolean(data?.pin_hash);
  if (!hasPin) setUnlockedLocally(userId, false);
  return {
    hasPin,
    unlocked: hasPin && isUnlockedLocally(userId),
    hint: data?.hint ?? null,
  };
}

export async function createPin(userId: string, pin: string, hint: string) {
  const pin_hash = await hashPin(pin, userId);
  const { error } = await supabase
    .from("chat_vault")
    .upsert({ user_id: userId, pin_hash, hint: hint.trim() || null, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  setUnlockedLocally(userId, true);
}

export async function verifyPin(userId: string, pin: string) {
  const { data } = await supabase
    .from("chat_vault")
    .select("pin_hash")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data?.pin_hash) return false;
  const ok = data.pin_hash === (await hashPin(pin, userId));
  if (ok) setUnlockedLocally(userId, true);
  return ok;
}

export async function removePin(userId: string) {
  await supabase.from("chat_vault").delete().eq("user_id", userId);
  setUnlockedLocally(userId, false);
}
