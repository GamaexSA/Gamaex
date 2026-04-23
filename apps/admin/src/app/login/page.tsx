"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 380,
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 36,
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, color: "var(--gold)", marginBottom: 6 }}>
            GAMAEX
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: 1, textTransform: "uppercase" }}>
            Panel de administración
          </div>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", marginBottom: 6, letterSpacing: 0.5 }}>
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              style={{
                width: "100%",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px",
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", marginBottom: 6, letterSpacing: 0.5 }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: "100%",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px",
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: 16,
              padding: "10px 14px",
              background: "var(--red-dim)",
              border: "1px solid rgba(231,76,60,0.3)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--red)",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "var(--bg3)" : "var(--gold)",
              color: loading ? "var(--text-dim)" : "#1a1a1a",
              border: "none",
              borderRadius: 8,
              padding: "13px",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              letterSpacing: 0.5,
            }}
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        <p style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center", marginTop: 20 }}>
          Acceso restringido · Solo personal autorizado
        </p>
      </div>
    </div>
  );
}
