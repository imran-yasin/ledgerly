import { hash } from "@node-rs/argon2";
import { z } from "zod";
import { apiError, validationError } from "@/lib/api/response";
import { checkRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db/prisma";

const registrationSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8, "Use at least 8 characters.").max(128),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit({ key: `register:${ip}`, max: 5, windowSec: 60 })) {
    return apiError(429, "RATE_LIMITED", "Too many attempts. Please wait a minute.");
  }

  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error.flatten());

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) return apiError(409, "EMAIL_UNAVAILABLE", "Unable to create this account. Try signing in instead.");

  const passwordHash = await hash(parsed.data.password, { memoryCost: 19_456, timeCost: 2, parallelism: 1 });
  await prisma.user.create({ data: { email, passwordHash } });

  return Response.json({ data: { email } }, { status: 201 });
}
