/**
 * Secure room: best-effort protection against screenshots, screen recording
 * and casual copying of the conversation.
 *
 * A browser cannot forbid the operating system from taking a picture of the
 * screen, so the room defends itself instead: the content is blacked out the
 * moment the window loses focus, is hidden, is printed, is captured through
 * the screen-capture API, or a capture shortcut is pressed.
 */

const KEY = (uid: string) => `srt-secure-room-${uid}`;

export function isSecureRoom(userId: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY(userId)) === "1";
}

export function setSecureRoom(userId: string, on: boolean) {
  if (typeof window === "undefined") return;
  if (on) localStorage.setItem(KEY(userId), "1");
  else localStorage.removeItem(KEY(userId));
  window.dispatchEvent(new Event("srt-secure-room"));
}
