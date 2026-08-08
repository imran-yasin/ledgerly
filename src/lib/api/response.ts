import { NextResponse } from "next/server";

export function apiError(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function validationError(details: unknown) {
  return apiError(422, "VALIDATION_ERROR", "Please correct the highlighted fields.", details);
}
