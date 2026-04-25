"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AdminShell } from "@/components/admin-shell";
import { api, type Currency } from "@/lib/api";

type EditMode = "margins" | "manual";

interface EditState {
  currency: Currency;
  mode: EditMode;
  buyMargin: string;
  sellMargin: string;
  manualBuy: string;
  manualSell: string;
}

function fmtCLP(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, color: "var(--text-dim)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 }}>{label}</label>
      <input
        type="number"
        step="0.01"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "10px 12px",
          color: "var(--text)",
          fontSize: 14,
          outline: "none",
          fontFamily: "var(--font-mono, 'DM Mono', monospace)",
        }}
      />
    </div>
  );
}

type SortKey = "name" | "buy" | "sell" | "mode";
type SortDir = "asc" | "desc";

function sortCurrencies(list: Currency[], key: SortKey, dir: SortDir): Currency[] {
  return [...list].sort((a, b) => {
    let va: string | number = 0;
    let vb: string | number = 0;
    if (key === "name") { va = a.name; vb = b.name; }
    else if (key === "mode") { va = a.quote_config?.mode ?? ""; vb = b.quote_config?.mode ?? ""; }
    else if (key === "buy") { va = a.quote_config?.current_buy ?? -1; vb = b.quote_config?.current_buy ?? -1; }
    else if (key === "sell") { va = a.quote_config?.current_sell ?? -1; vb = b.quote_config?.current_sell ?? -1; }
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search, setSearch] = useState("");

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = search
    ? currencies.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()),
      )
    : currencies;

  const sorted = sortCurrencies(filtered, sortKey, sortDir);
  const sortIcon = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  const load = useCallback(() => {
    setLoading(true);
    api.getCurrencies()
      .then(setCurrencies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const interval = setInterval(load, 90_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setEdit(null);
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { void handleSaveRef.current(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function openEdit(c: Currency) {
    const mode: EditMode = c.quote_config?.mode === "MANUAL" ? "manual" : "margins";
    setEdit({
      currency: c,
      mode,
      buyMargin: String(c.quote_config?.buy_margin ?? 0),
      sellMargin: String(c.quote_config?.sell_margin ?? 0),
      manualBuy: String(c.quote_config?.manual_buy ?? c.quote_config?.current_buy ?? ""),
      manualSell: String(c.quote_config?.manual_sell ?? c.quote_config?.current_sell ?? ""),
    });
  }

  async function handleSave() {
    if (!edit) return;
    setSaving(true);
    try {
      const code = edit.currency.code;
      if (edit.mode === "margins") {
        await api.updateMargins(code, parseFloat(edit.buyMargin), parseFloat(edit.sellMargin));
      } else {
        await api.setManualPrices(code, parseFloat(edit.manualBuy), parseFloat(edit.manualSell));
      }
      showToast(`${code} actualizado correctamente`);
      setEdit(null);
      load();
    } catch (e) {
      showToast("Error: " + (e instanceof Error ? e.message : "desconocido"));
    } finally {
      setSaving(false);
    }
  }

  async function handleSwitchAuto(code: string) {
    try {
      await api.switchToAuto(code);
      showToast(`${code} → modo AUTO`);
      load();
    } catch (e) {
      showToast("Error: " + (e instanceof Error ? e.message : "desconocido"));
    }
  }

  async function handleToggle(code: string) {
    try {
      await api.toggleActive(code);
      load();
    } catch (e) {
      showToast("Error: " + (e instanceof Error ? e.message : "desconocido"));
    }
  }

  async function handleForceSync(code: string) {
    setSyncing(code);
    try {
      const res = await api.forceSync(code);
      showToast(`Sync ${code}: ${res.updated} actualizada`);
      load();
    } catch (e) {
      showToast("Error: " + (e instanceof Error ? e.message : "desconocido"));
    } finally {
      setSyncing(null);
    }
  }

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Monedas</h1>
            <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
              Gestión de tasas, márgenes y precios manuales
            </p>
          </div>
          <input
            type="text"
            placeholder="Buscar moneda o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 14px",
              color: "var(--text)",
              fontSize: 13,
              outline: "none",
              width: 220,
            }}
          />
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 1000,
            background: "var(--bg2)",
            border: `1px solid ${toast.startsWith("Error") ? "rgba(231,76,60,0.4)" : "rgba(46,204,113,0.3)"}`,
            borderRadius: 10, padding: "12px 18px", fontSize: 13,
            color: toast.startsWith("Error") ? "var(--red)" : "var(--green)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}>
            {toast.startsWith("Error") ? "⚠ " : "✓ "}{toast}
          </div>
        )}

        {/* Table */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid", gridTemplateColumns: "36px 1fr 90px 120px 120px 100px 90px 120px",
            gap: 10, padding: "10px 16px",
            background: "var(--bg3)", borderBottom: "1px solid var(--border)",
          }}>
            {([
              ["", null],
              ["Moneda", "name"],
              ["Modo", "mode"],
              ["Compra", "buy"],
              ["Venta", "sell"],
              ["Alerta", null],
              ["Activa", null],
              ["Acciones", null],
            ] as [string, SortKey | null][]).map(([h, k]) => (
              <span
                key={h}
                onClick={k ? () => toggleSort(k) : undefined}
                style={{
                  fontSize: 11, color: k ? "var(--text)" : "var(--text-dim)",
                  textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 500,
                  cursor: k ? "pointer" : "default",
                  userSelect: "none",
                }}
              >
                {h}{k ? sortIcon(k) : ""}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)" }}>Cargando...</div>
          ) : (
            sorted.map((c) => {
              const qc = c.quote_config;
              const isManual = qc?.mode === "MANUAL";
              const hasAlert = qc?.price_alert_active;

              const lastUpdated = qc?.last_synced_at
                ? new Date(qc.last_synced_at).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
                : null;

              return (
                <div
                  key={c.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr 90px 120px 120px 100px 90px 120px",
                    gap: 10,
                    padding: "11px 16px",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center",
                    opacity: c.is_active ? 1 : 0.45,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{c.flag_emoji}</span>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{c.code}</div>
                  </div>

                  <span style={{
                    fontSize: 11, padding: "3px 8px", borderRadius: 20, fontWeight: 500, textAlign: "center",
                    background: isManual ? "rgba(243,156,18,0.1)" : "var(--green-dim)",
                    color: isManual ? "var(--orange)" : "var(--green)",
                    border: `1px solid ${isManual ? "rgba(243,156,18,0.3)" : "rgba(46,204,113,0.3)"}`,
                  }}>
                    {qc?.mode ?? "—"}
                  </span>

                  <div>
                    <div className="font-mono" style={{ fontSize: 13, color: "var(--green)", fontWeight: 500 }}>
                      ${fmtCLP(qc?.current_buy ?? null)}
                    </div>
                    {!isManual && qc?.buy_margin != null && (
                      <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>
                        margen {qc.buy_margin >= 0 ? "+" : ""}{qc.buy_margin}
                      </div>
                    )}
                    {lastUpdated && (
                      <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 1 }}>{lastUpdated}</div>
                    )}
                  </div>

                  <div>
                    <div className="font-mono" style={{ fontSize: 13, fontWeight: 500 }}>
                      ${fmtCLP(qc?.current_sell ?? null)}
                    </div>
                    {!isManual && qc?.sell_margin != null && (
                      <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>
                        margen {qc.sell_margin >= 0 ? "+" : ""}{qc.sell_margin}
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: 11 }}>
                    {hasAlert ? (
                      <span style={{ color: "var(--orange)" }} title={qc?.price_alert_reason ?? ""}>⚠ Alerta</span>
                    ) : (
                      <span style={{ color: "var(--text-faint)" }}>—</span>
                    )}
                  </span>

                  <button
                    onClick={() => { void handleToggle(c.code); }}
                    style={{
                      background: c.is_active ? "var(--green-dim)" : "var(--bg3)",
                      border: `1px solid ${c.is_active ? "rgba(46,204,113,0.3)" : "var(--border)"}`,
                      color: c.is_active ? "var(--green)" : "var(--text-dim)",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {c.is_active ? "Activa" : "Inactiva"}
                  </button>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => openEdit(c)}
                      style={{
                        background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.3)",
                        color: "var(--gold)", padding: "5px 10px", borderRadius: 6,
                        fontSize: 11, fontWeight: 500, cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => { void handleForceSync(c.code); }}
                      disabled={syncing === c.code}
                      style={{
                        background: "var(--bg3)", border: "1px solid var(--border)",
                        color: syncing === c.code ? "var(--text-faint)" : "var(--text-dim)",
                        padding: "5px 8px", borderRadius: 6,
                        fontSize: 12, cursor: syncing === c.code ? "not-allowed" : "pointer",
                      }}
                      title="Forzar sync"
                    >
                      {syncing === c.code ? "..." : "⟳"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {edit && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setEdit(null); }}
        >
          <div style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: 16, padding: 28, width: "100%", maxWidth: 400,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {edit.currency.flag_emoji} {edit.currency.name} ({edit.currency.code})
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                  Base actual: ${fmtCLP(edit.currency.quote_config?.last_base_price ?? null)}
                </div>
              </div>
              <button
                onClick={() => setEdit(null)}
                style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 20, cursor: "pointer" }}
              >×</button>
            </div>

            {/* Mode tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {(["margins", "manual"] as EditMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setEdit((prev) => prev ? { ...prev, mode: m } : prev)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    border: `1px solid ${edit.mode === m ? "rgba(201,168,76,0.4)" : "var(--border)"}`,
                    background: edit.mode === m ? "var(--gold-dim)" : "var(--bg3)",
                    color: edit.mode === m ? "var(--gold)" : "var(--text-dim)",
                    cursor: "pointer",
                  }}
                >
                  {m === "margins" ? "AUTO + Márgenes" : "Manual"}
                </button>
              ))}
            </div>

            {edit.mode === "margins" ? (
              <>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.5 }}>
                  Precio final = base + margen. Márgenes en CLP (pueden ser negativos).
                </div>
                <Input label="Margen compra (CLP)" value={edit.buyMargin} onChange={(v) => setEdit((p) => p ? { ...p, buyMargin: v } : p)} placeholder="-5" />
                <Input label="Margen venta (CLP)" value={edit.sellMargin} onChange={(v) => setEdit((p) => p ? { ...p, sellMargin: v } : p)} placeholder="8" />
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 14, lineHeight: 1.5 }}>
                  Precio fijo en CLP. El cron no modifica estos valores.
                </div>
                <Input label="Precio compra (CLP)" value={edit.manualBuy} onChange={(v) => setEdit((p) => p ? { ...p, manualBuy: v } : p)} placeholder="940" />
                <Input label="Precio venta (CLP)" value={edit.manualSell} onChange={(v) => setEdit((p) => p ? { ...p, manualSell: v } : p)} placeholder="952" />
              </>
            )}

            {edit.currency.quote_config?.mode === "MANUAL" && edit.mode === "margins" && (
              <button
                onClick={() => { void handleSwitchAuto(edit.currency.code); setEdit(null); }}
                style={{
                  width: "100%", marginBottom: 12, background: "var(--bg3)",
                  border: "1px solid var(--border)", color: "var(--text-dim)",
                  padding: "9px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                }}
              >
                Volver a AUTO
              </button>
            )}

            <button
              onClick={() => { void handleSave(); }}
              disabled={saving}
              style={{
                width: "100%",
                background: saving ? "var(--bg3)" : "var(--gold)",
                color: saving ? "var(--text-dim)" : "#1a1a1a",
                border: "none",
                borderRadius: 8,
                padding: "12px",
                fontSize: 14,
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}{!saving && <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 8 }}>⌘↵</span>}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
