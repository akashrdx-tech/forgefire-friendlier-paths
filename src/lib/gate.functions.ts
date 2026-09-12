import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FIXED_KEY = "rdxsardarrdx@11";

export const getGateStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { isSet: true };
});

export const verifyGatePassword = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(1).max(64),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (data.password !== FIXED_KEY) {
      return { ok: false as const, error: "Wrong password." };
    }
    return { ok: true as const };
  });
