"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminShell } from "@/components/admin-shell";
import { api, type PriceAlertItem, type PriceAlertStatus, type AlertStats } from "@/lib/api";

const STATUS_LABELS: Record<PriceAlertStatus, string> = {
  PENDING:   "Pendiente",
  CONTACTED: "Contactado",
  CLOSED:    "Cerrado",
  EXPIRED:   "Expirado",
};

const STATUS_COLORS: Record<PriceAlertStatus, { bg: string; color: string; border: string }> = {
  PENDING:   { bg: "rgba(201,168,76,0.12)",  color: "var(--gold)",  border: "rgba(201,168,76,0.3)"  },
  CONTACTED: { bg: "rgba(52,152,219,0.12)",  color: "#3498DB",      border: "rgba(52,152,219,0.3)"  },
  CLOSED:    { bg: "rgba(46,204,113,0.12)",  color: "var(--green)", border: "rgba(46,204,113,0.3)"  },
  EXPIRED:   { bg: "rgba(100,100,100,0.1)",  color: "#888",         border: "rgba(100,100,100,0.2)" },
};

function fmtDate(s: string) {
  return new Date(s).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

function fmtPrice(n: number | null) {
  if (n === null) return "—";
  return "$" + n.toLocaleString("es-CL");
}

function StatusBadge({ status }: { status: PriceAlertStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span style={{
      padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatusModal({
  alert,
  onClose,
  onSaved,
}: {
  alert: PriceAlertItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState<PriceAlertStatus>(alert.status);
  const [note, setNote] = useState(alert.status_note ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    setSaving(true);
    setErr("");
    try {
      await api.updateAlertStatus(alert.id, status, note || undefined);
      onSaved();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8,
    padding: "9px 12px", color: "var(--text)", fontSize: 13, outline: "none", width: "100%",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14,
        padding: "28px 24px", maxWidth: 460, width: "100%",
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Actualizar estado</h3>
        <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 20 }}>
          {alert.name} · {alert.currency_code} · {alert.operation === "BUY" ? "Comprar" : "Vender"} · objetivo {fmtPrice(alert.target_price)}
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.7, display: "block", marginBottom: 6 }}>
            Estado
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value as PriceAlertStatus)} style={inputStyle}>
            {(Object.keys(STATUS_LABELS) as PriceAlertStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.7, display: "block", marginBottom: 6 }}>
            Nota interna (opcional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contactado el lunes a las 10am, aceptó precio..."
            style={{ ...inputStyle, height: 80, resize: "vertical" }}
          />
        </div>

        {err && <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>{err}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={save}
            disabled={saving}
            style={{
              flex: 1, background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.4)",
              color: "var(--gold)", padding: "10px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text-dim)", padding: "10px 18px", borderRadius: 8,
              fontSize: 13, cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PriceAlertsPage() {
  const [items, setItems]       = useState<PriceAlertItem[]>([]);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [stats, setStats]       = useState<AlertStats | null>(null);
  const [editing, setEditing]   = useState<PriceAlertItem | null>(null);

  const [filterStatus,    setFilterStatus]    = useState("");
  const [filterCurrency,  setFilterCurrency]  = useState("");
  const [filterOperation, setFilterOperation] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const f: { status?: string; currency?: string; operation?: string } = {};
    if (filterStatus)    f.status    = filterStatus;
    if (filterCurrency)  f.currency  = filterCurrency;
    if (filterOperation) f.operation = filterOperation;
    api.getAlerts(page, 50, f)
      .then((r) => { setItems(r.items); setTotal(r.total); setPages(r.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, filterStatus, filterCurrency, filterOperation]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.getAlertStats().then(setStats).catch(() => {});
  }, []);

  const inputStyle: React.CSSProperties = {
    background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8,
    padding: "8px 12px", color: "var(--text)", fontSize: 13, outline: "none", minWidth: 0,
  };

  return (
    <AdminShell>
      {editing && (
        <StatusModal
          alert={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); api.getAlertStats().then(setStats).catch(() => {}); }}
        />
      )}

      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Alertas de precio</h1>
          <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
            Solicitudes de aviso de clientes — {total} totales
          </p>
        </div>

        {/* Stats */}
        {stats && stats.total_pending > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20,
            padding: "14px 18px", background: "var(--gold-dim)",
            border: "1px solid rgba(201,168,76,0.25)", borderRadius: 10,
          }}>
            <span style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>
              🔔 {stats.total_pending} pendiente{stats.total_pending !== 1 ? "s" : ""}:
            </span>
            {stats.by_currency.map((s) => (
              <span key={s.currency} style={{ fontSize: 12, color: "var(--text-dim)" }}>
                {s.currency} ({s.count})
              </span>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{
          display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20,
          padding: "14px 16px", background: "var(--bg2)",
          border: "1px solid var(--border)", borderRadius: 10,
        }}>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            style={{ ...inputStyle, flex: "1 1 140px" }}
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="CONTACTED">Contactado</option>
            <option value="CLOSED">Cerrado</option>
            <option value="EXPIRED">Expirado</option>
          </select>

          <input
            type="text"
            placeholder="Moneda (USD, EUR...)"
            value={filterCurrency}
            onChange={(e) => { setFilterCurrency(e.target.value.toUpperCase()); setPage(1); }}
            style={{ ...inputStyle, flex: "1 1 140px" }}
          />

          <select
            value={filterOperation}
            onChange={(e) => { setFilterOperation(e.target.value); setPage(1); }}
            style={{ ...inputStyle, flex: "1 1 140px" }}
          >
            <option value="">Compra y venta</option>
            <option value="BUY">Comprar</option>
            <option value="SELL">Vender</option>
          </select>

          <button
            onClick={() => { setFilterStatus(""); setFilterCurrency(""); setFilterOperation(""); setPage(1); }}
            style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text-dim)", padding: "8px 14px", borderRadius: 8,
              fontSize: 13, cursor: "pointer",
            }}
          >
            Limpiar
          </button>
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "140px 120px 80px 90px 110px 110px 1fr 90px",
            gap: 10, padding: "10px 16px",
            background: "var(--bg3)", borderBottom: "1px solid var(--border)",
          }}>
            {["Fecha", "Cliente", "Moneda", "Op.", "Objetivo", "Ref. actual", "Estado / Nota", "Acción"].map((h) => (
              <span key={h} style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 500 }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)" }}>Cargando...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)" }}>Sin alertas para los filtros seleccionados</div>
          ) : (
            items.map((item) => {
              const refPrice = item.operation === "BUY" ? item.price_sell_ref : item.price_buy_ref;
              const diff = refPrice ? item.target_price - refPrice : null;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 120px 80px 90px 110px 110px 1fr 90px",
                    gap: 10, padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center", fontSize: 12,
                  }}
                >
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                    {fmtDate(item.created_at)}
                  </span>

                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
                    <a
                      href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 11, color: "#25D366", textDecoration: "none" }}
                    >
                      {item.whatsapp}
                    </a>
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.currency_code}</div>
                  </div>

                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: item.operation === "BUY" ? "#3498DB" : "#E67E22",
                  }}>
                    {item.operation === "BUY" ? "Comprar" : "Vender"}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{fmtPrice(item.target_price)}</div>
                    {item.amount && (
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        ~{item.amount.toLocaleString("es-CL")}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 12 }}>{fmtPrice(refPrice ?? null)}</div>
                    {diff !== null && (
                      <div style={{
                        fontSize: 10,
                        color: Math.abs(diff) < 10 ? "var(--green)" : "var(--text-faint)",
                      }}>
                        {diff > 0 ? "+" : ""}{diff.toLocaleString("es-CL")}
                      </div>
                    )}
                  </div>

                  <div>
                    <StatusBadge status={item.status} />
                    {item.status_note && (
                      <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 3 }}>
                        {item.status_note.slice(0, 60)}{item.status_note.length > 60 ? "…" : ""}
                      </div>
                    )}
                    {item.comment && (
                      <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3 }} title={item.comment}>
                        💬 {item.comment.slice(0, 50)}{item.comment.length > 50 ? "…" : ""}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setEditing(item)}
                    style={{
                      background: "var(--bg3)", border: "1px solid var(--border)",
                      color: "var(--text-dim)", padding: "6px 12px", borderRadius: 6,
                      fontSize: 11, cursor: "pointer", fontWeight: 500,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.4)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gold)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; }}
                  >
                    Actualizar
                  </button>
                </div>
              );
            })
          )}
        </div>

        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: "var(--bg2)", border: "1px solid var(--border)",
                color: page === 1 ? "var(--text-faint)" : "var(--text-dim)",
                padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Anterior
            </button>
            <span style={{ padding: "7px 16px", fontSize: 13, color: "var(--text-dim)" }}>
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              style={{
                background: "var(--bg2)", border: "1px solid var(--border)",
                color: page === pages ? "var(--text-faint)" : "var(--text-dim)",
                padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: page === pages ? "not-allowed" : "pointer",
              }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
