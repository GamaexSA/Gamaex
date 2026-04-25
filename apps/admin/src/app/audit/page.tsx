"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminShell } from "@/components/admin-shell";
import { api, type AuditItem } from "@/lib/api";

const AUDIT_ACTIONS = [
  "UPDATE_MARGINS", "SET_MANUAL_PRICES", "SWITCH_TO_AUTO", "SWITCH_TO_MANUAL",
  "FORCE_SYNC", "CREATE_CURRENCY", "UPDATE_CURRENCY", "TOGGLE_CURRENCY_ACTIVE",
  "UPDATE_DISPLAY_ORDER", "CREATE_ADMIN_USER", "UPDATE_ADMIN_USER",
  "DEACTIVATE_ADMIN_USER", "RESET_ADMIN_PASSWORD", "ADD_WA_NUMBER",
  "REMOVE_WA_NUMBER", "TOGGLE_WA_NUMBER", "CREATE_API_KEY", "REVOKE_API_KEY",
];

function fmtDate(s: string) {
  return new Date(s).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "medium" });
}

function actionColor(action: string): { bg: string; color: string; border: string } {
  if (action.startsWith("FORCE_SYNC") || action === "CRON_AUTO") {
    return { bg: "rgba(52,152,219,0.1)", color: "#3498DB", border: "rgba(52,152,219,0.3)" };
  }
  if (action.includes("MANUAL") || action.includes("SET_MANUAL") || action.includes("SWITCH_TO_MANUAL")) {
    return { bg: "rgba(243,156,18,0.1)", color: "var(--orange)", border: "rgba(243,156,18,0.3)" };
  }
  if (action.includes("AUTO") || action.includes("UPDATE_MARGINS")) {
    return { bg: "var(--green-dim)", color: "var(--green)", border: "rgba(46,204,113,0.3)" };
  }
  if (action.includes("CREATE") || action.includes("ADD")) {
    return { bg: "rgba(155,89,182,0.1)", color: "#9B59B6", border: "rgba(155,89,182,0.3)" };
  }
  if (action.includes("DEACTIVATE") || action.includes("REVOKE") || action.includes("DELETE")) {
    return { bg: "var(--red-dim)", color: "var(--red)", border: "rgba(231,76,60,0.3)" };
  }
  return { bg: "var(--gold-dim)", color: "var(--gold)", border: "rgba(201,168,76,0.25)" };
}

function JsonPreview({ data }: { data: unknown }) {
  if (data === null || data === undefined) return <span style={{ color: "var(--text-faint)" }}>—</span>;
  const str = JSON.stringify(data);
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 10, color: "var(--text-dim)",
        background: "var(--bg3)", padding: "2px 6px", borderRadius: 4,
        display: "inline-block", maxWidth: 200, overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "help",
        verticalAlign: "middle",
      }}
      title={JSON.stringify(data, null, 2)}
    >
      {str.length > 60 ? str.slice(0, 60) + "…" : str}
    </span>
  );
}

export default function AuditPage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterActor, setFilterActor] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const filters: { action?: string; entity?: string; actor?: string } = {};
    if (filterAction) filters.action = filterAction;
    if (filterEntity) filters.entity = filterEntity;
    if (filterActor) filters.actor = filterActor;
    api.getAuditLogs(page, 50, filters)
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
        setPages(r.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, filterAction, filterEntity, filterActor]);

  useEffect(() => { load(); }, [load]);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
    minWidth: 0,
  };

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Auditoría</h1>
          <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
            Registro inmutable de todos los cambios — {total} eventos totales
          </p>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleFilterSubmit}
          style={{
            display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20,
            padding: "16px", background: "var(--bg2)",
            border: "1px solid var(--border)", borderRadius: 10,
          }}
        >
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            style={{ ...inputStyle, flex: "1 1 160px" }}
          >
            <option value="">Todas las acciones</option>
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Entidad (quote_config, currency…)"
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            style={{ ...inputStyle, flex: "1 1 180px" }}
          />

          <input
            type="text"
            placeholder="Actor (user:..., system:...)"
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            style={{ ...inputStyle, flex: "1 1 180px" }}
          />

          <button
            type="submit"
            style={{
              background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.3)",
              color: "var(--gold)", padding: "8px 18px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={() => { setFilterAction(""); setFilterEntity(""); setFilterActor(""); setPage(1); }}
            style={{
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text-dim)", padding: "8px 14px", borderRadius: 8,
              fontSize: 13, cursor: "pointer",
            }}
          >
            Limpiar
          </button>
        </form>

        {/* Table */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "150px 1fr 120px 160px 1fr 1fr",
            gap: 10, padding: "10px 16px",
            background: "var(--bg3)", borderBottom: "1px solid var(--border)",
          }}>
            {["Fecha", "Acción", "Entidad", "Actor", "Antes", "Después"].map((h) => (
              <span key={h} style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 500 }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)" }}>Cargando...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)" }}>Sin registros para los filtros seleccionados</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr 120px 160px 1fr 1fr",
                  gap: 10, padding: "10px 16px",
                  borderBottom: "1px solid var(--border)",
                  alignItems: "start",
                  fontSize: 12,
                }}
              >
                <span className="font-mono" style={{ color: "var(--text-dim)", fontSize: 11 }}>
                  {fmtDate(item.created_at)}
                </span>
                {(() => {
                  const c = actionColor(item.action);
                  return (
                    <span style={{
                      padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                      display: "inline-block", whiteSpace: "nowrap",
                    }}>
                      {item.action}
                    </span>
                  );
                })()}
                <div>
                  <div style={{ fontWeight: 500, fontSize: 12 }}>{item.entity}</div>
                  <div className="font-mono" style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>{item.entity_id.slice(0, 16)}…</div>
                </div>
                <span style={{
                  fontSize: 11,
                  color: item.actor_ref.startsWith("user:") ? "var(--text)" : "var(--text-dim)",
                }}>
                  {item.actor_ref}
                </span>
                <JsonPreview data={item.before} />
                <JsonPreview data={item.after} />
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
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
