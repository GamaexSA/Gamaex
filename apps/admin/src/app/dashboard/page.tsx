"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminShell } from "@/components/admin-shell";
import { api, type PublicRatesResponse } from "@/lib/api";

function StatusBadge({ status }: { status: "ok" | "degraded" | "stale" | string }) {
  const cfg = {
    ok:       { bg: "var(--green-dim)",  border: "rgba(46,204,113,0.3)",  color: "var(--green)",  label: "Sistema OK" },
    degraded: { bg: "rgba(243,156,18,0.1)", border: "rgba(243,156,18,0.3)", color: "var(--orange)", label: "Degradado" },
    stale:    { bg: "var(--red-dim)",    border: "rgba(231,76,60,0.3)",   color: "var(--red)",    label: "Sin sync" },
  }[status] ?? { bg: "var(--bg3)", border: "var(--border)", color: "var(--text-dim)", label: status };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function fmtCLP(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(s: string) {
  if (!s) return "—";
  return new Date(s).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

const REFRESH_INTERVAL = 60;

export default function DashboardPage() {
  const [data, setData] = useState<PublicRatesResponse | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState("");
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  const loadRates = useCallback(() => {
    api.getRates().then(setData).catch(console.error);
    setCountdown(REFRESH_INTERVAL);
  }, []);

  useEffect(() => { loadRates(); }, [loadRates]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { loadRates(); return REFRESH_INTERVAL; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [loadRates]);

  async function handleForceSync() {
    setSyncing(true);
    setMsg("");
    try {
      const res = await api.forceSyncAll();
      setMsg(`Sync completado: ${res.updated} actualizadas, ${res.skipped} omitidas.`);
      loadRates();
    } catch (e) {
      setMsg("Error al sincronizar: " + (e instanceof Error ? e.message : "desconocido"));
    } finally {
      setSyncing(false);
    }
  }

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Dashboard</h1>
            {data && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <StatusBadge status={data.system_status} />
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  Última sync: {fmtDate(data.last_sync_at)}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                  · auto-refresh en {countdown}s
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => { void handleForceSync(); }}
            disabled={syncing}
            style={{
              background: syncing ? "var(--bg3)" : "var(--gold-dim)",
              border: `1px solid ${syncing ? "var(--border)" : "rgba(201,168,76,0.4)"}`,
              color: syncing ? "var(--text-dim)" : "var(--gold)",
              padding: "9px 20px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: syncing ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {syncing ? "Sincronizando..." : "⟳ Sync ahora"}
          </button>
        </div>

        {msg && (
          <div style={{
            marginBottom: 20, padding: "10px 16px",
            background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8,
            fontSize: 13, color: "var(--text-dim)",
          }}>
            {msg}
          </div>
        )}

        {/* Stats */}
        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Monedas activas", value: String(data.rates.length), sub: "con precios" },
              { label: "Auto", value: String(data.rates.filter(r => r.mode === "AUTO").length), sub: "modo automático" },
              { label: "Manual", value: String(data.rates.filter(r => r.mode === "MANUAL").length), sub: "modo manual" },
              { label: "Cache TTL", value: `${data.cache_ttl_seconds}s`, sub: "para web pública" },
              { label: "Precio más alto", value: `$${data.rates.reduce((max, r) => r.sell > max ? r.sell : max, 0).toLocaleString("es-CL", { maximumFractionDigits: 0 })}`, sub: "venta máxima (CLP)" },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "16px 18px",
              }}>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6 }}>{label}</div>
                <div className="font-mono" style={{ fontSize: 26, fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabla de tasas */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr 80px 110px 110px 80px",
            gap: 12,
            padding: "10px 16px",
            background: "var(--bg3)",
            borderBottom: "1px solid var(--border)",
          }}>
            {["", "Divisa", "Modo", "Compra (CLP)", "Venta (CLP)", "Actualizado"].map((h) => (
              <span key={h} style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 500 }}>{h}</span>
            ))}
          </div>

          {!data ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>Cargando...</div>
          ) : data.rates.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>
              Sin precios configurados — ir a <strong style={{ color: "var(--gold)" }}>Monedas</strong> para establecer precios manuales
            </div>
          ) : (
            data.rates.map((r) => (
              <div key={r.code} style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 80px 110px 110px 80px",
                gap: 12,
                padding: "11px 16px",
                borderBottom: "1px solid var(--border)",
                alignItems: "center",
              }}>
                <span style={{ fontSize: 20 }}>{r.flag_emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{r.code}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500,
                  background: r.mode === "MANUAL" ? "rgba(243,156,18,0.1)" : "var(--green-dim)",
                  color: r.mode === "MANUAL" ? "var(--orange)" : "var(--green)",
                  border: `1px solid ${r.mode === "MANUAL" ? "rgba(243,156,18,0.3)" : "rgba(46,204,113,0.3)"}`,
                  textAlign: "center",
                }}>
                  {r.mode}
                </span>
                <span className="font-mono" style={{ fontSize: 13, color: "var(--green)", fontWeight: 500 }}>
                  ${fmtCLP(r.buy)}
                </span>
                <span className="font-mono" style={{ fontSize: 13, fontWeight: 500 }}>
                  ${fmtCLP(r.sell)}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  {r.last_updated ? new Date(r.last_updated).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : "—"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
