"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export function useRegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      await axios.post("/api/auth/register", {
        email: form.get("email"),
        password: form.get("password"),
      });
      router.push("/login");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error?.message ?? "Registration failed."
        : "Registration failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { error, loading, showPassword, setShowPassword, handleSubmit };
}
