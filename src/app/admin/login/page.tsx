"use client";

import { useState } from "react";
import { login } from "./actions";
import Image from "next/image";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Se redirect() foi chamado no servidor, a navegação ocorre automaticamente
    } catch {
      setError("Erro ao conectar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Norte Tecnologia"
              width={160}
              height={48}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-white text-xl font-semibold text-center mb-1">
            Acesso Administrativo
          </h1>
          <p className="text-[#6b7280] text-sm text-center mb-8">
            Entre com suas credenciais para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#d1d5db] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@nortetecnologia.com"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#d1d5db] mb-1.5"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#ffd600] focus:ring-1 focus:ring-[#ffd600] transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ffd600] text-[#0a0a0a] font-semibold py-3 rounded-lg hover:bg-[#e6c000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#4b5563] text-xs mt-6">
          Norte Tecnologia — Painel Administrativo
        </p>
      </div>
    </div>
  );
}
