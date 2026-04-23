"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminShell } from "@/components/admin-shell";
import { api, type AdminUser } from "@/lib/api";

type EditState = {
  user: AdminUser | null; // null = creación
  name: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "OPERATOR";
};

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
}

function Input({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, color: "var(--text-dim)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 }}>{label}</label>
      <input
        type={type}
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
        }}
      />
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [resetModal, setResetModal] = useState<{ id: string; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api.getUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function openCreate() {
    setEdit({ user: null, name: "", email: "", password: "", role: "OPERATOR" });
  }

  function openEdit(u: AdminUser) {
    setEdit({ user: u, name: u.name, email: u.email, password: "", role: u.role });
  }

  async function handleSave() {
    if (!edit) return;
    setSaving(true);
    try {
      if (edit.user === null) {
        await api.createUser({ email: edit.email, name: edit.name, password: edit.password, role: edit.role });
        showToast(`Usuario ${edit.name} creado correctamente`);
      } else {
        await api.updateUser(edit.user.id, { email: edit.email, name: edit.name, role: edit.role });
        showToast(`${edit.name} actualizado`);
      }
      setEdit(null);
      load();
    } catch (e) {
      showToast("Error: " + (e instanceof Error ? e.message : "desconocido"));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(u: AdminUser) {
    try {
      await api.toggleUser(u.id);
      showToast(`${u.name} ${u.is_active ? "desactivado" : "activado"}`);
      load();
    } catch (e) {
      showToast("Error: " + (e instanceof Error ? e.message : "desconocido"));
    }
  }

  async function handleResetPassword() {
    if (!resetModal || !newPassword) return;
    setSaving(true);
    try {
      await api.resetPassword(resetModal.id, newPassword);
      showToast(`Contraseña de ${resetModal.name} actualizada`);
      setResetModal(null);
      setNewPassword("");
    } catch (e) {
      showToast("Error: " + (e instanceof Error ? e.message : "desconocido"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Usuarios</h1>
            <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
              Gestión de cuentas de administrador
            </p>
          </div>
          <button
            onClick={openCreate}
            style={{
              background: "var(--gold)", color: "#1a1a1a",
              border: "none", borderRadius: 8,
              padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            + Nuevo usuario
          </button>
        </div>

        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 1000,
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "12px 18px", fontSize: 13,
            color: "var(--text)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}>
            {toast}
          </div>
        )}

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 130px 150px 100px 160px",
            gap: 10, padding: "10px 16px",
            background: "var(--bg3)", borderBottom: "1px solid var(--border)",
          }}>
            {["Nombre", "Email", "Rol", "Último acceso", "Estado", "Acciones"].map((h) => (
              <span key={h} style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 500 }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)" }}>Cargando...</div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 130px 150px 100px 160px",
                  gap: 10,
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                  alignItems: "center",
                  opacity: u.is_active ? 1 : 0.45,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>

                <div style={{ fontSize: 12, color: "var(--text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>

                <span style={{
                  display: "inline-flex", alignItems: "center",
                  fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600,
                  background: u.role === "SUPER_ADMIN" ? "var(--gold-dim)" : "var(--bg3)",
                  color: u.role === "SUPER_ADMIN" ? "var(--gold)" : "var(--text-dim)",
                  border: `1px solid ${u.role === "SUPER_ADMIN" ? "rgba(201,168,76,0.3)" : "var(--border)"}`,
                  letterSpacing: 0.4,
                }}>
                  {u.role === "SUPER_ADMIN" ? "Super Admin" : "Operador"}
                </span>

                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{fmtDate(u.last_login_at)}</span>

                <button
                  onClick={() => { void handleToggle(u); }}
                  style={{
                    background: u.is_active ? "var(--green-dim)" : "var(--bg3)",
                    border: `1px solid ${u.is_active ? "rgba(46,204,113,0.3)" : "var(--border)"}`,
                    color: u.is_active ? "var(--green)" : "var(--text-dim)",
                    padding: "4px 10px", borderRadius: 20,
                    fontSize: 11, fontWeight: 500, cursor: "pointer",
                  }}
                >
                  {u.is_active ? "Activo" : "Inactivo"}
                </button>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => openEdit(u)}
                    style={{
                      background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.3)",
                      color: "var(--gold)", padding: "5px 10px", borderRadius: 6,
                      fontSize: 11, fontWeight: 500, cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => { setResetModal({ id: u.id, name: u.name }); setNewPassword(""); }}
                    style={{
                      background: "var(--bg3)", border: "1px solid var(--border)",
                      color: "var(--text-dim)", padding: "5px 8px", borderRadius: 6,
                      fontSize: 11, cursor: "pointer",
                    }}
                    title="Cambiar contraseña"
                  >
                    🔑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal crear/editar */}
      {edit && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setEdit(null); }}
        >
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 400 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {edit.user === null ? "Nuevo usuario" : `Editar: ${edit.user.name}`}
              </div>
              <button onClick={() => setEdit(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            <Input label="Nombre" value={edit.name} onChange={(v) => setEdit((p) => p ? { ...p, name: v } : p)} placeholder="Eduardo" />
            <Input label="Email" value={edit.email} onChange={(v) => setEdit((p) => p ? { ...p, email: v } : p)} type="email" placeholder="eduardo@gamaex.cl" />
            {edit.user === null && (
              <Input label="Contraseña" value={edit.password} onChange={(v) => setEdit((p) => p ? { ...p, password: v } : p)} type="password" placeholder="Mínimo 8 caracteres" />
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, color: "var(--text-dim)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5 }}>Rol</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["SUPER_ADMIN", "OPERATOR"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setEdit((p) => p ? { ...p, role: r } : p)}
                    style={{
                      flex: 1, padding: "9px",
                      borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      border: `1px solid ${edit.role === r ? "rgba(201,168,76,0.4)" : "var(--border)"}`,
                      background: edit.role === r ? "var(--gold-dim)" : "var(--bg3)",
                      color: edit.role === r ? "var(--gold)" : "var(--text-dim)",
                    }}
                  >
                    {r === "SUPER_ADMIN" ? "Super Admin" : "Operador"}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 6 }}>
                {edit.role === "SUPER_ADMIN" ? "Acceso total: puede gestionar usuarios, precios y configuración." : "Solo puede editar precios y márgenes."}
              </div>
            </div>

            <button
              onClick={() => { void handleSave(); }}
              disabled={saving}
              style={{
                width: "100%",
                background: saving ? "var(--bg3)" : "var(--gold)",
                color: saving ? "var(--text-dim)" : "#1a1a1a",
                border: "none", borderRadius: 8,
                padding: "12px", fontSize: 14, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Guardando..." : (edit.user === null ? "Crear usuario" : "Guardar cambios")}
            </button>
          </div>
        </div>
      )}

      {/* Modal reset contraseña */}
      {resetModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setResetModal(null); }}
        >
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 360 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Cambiar contraseña — {resetModal.name}</div>
              <button onClick={() => setResetModal(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>
            <Input label="Nueva contraseña" value={newPassword} onChange={setNewPassword} type="password" placeholder="Mínimo 8 caracteres" />
            <button
              onClick={() => { void handleResetPassword(); }}
              disabled={saving || newPassword.length < 8}
              style={{
                width: "100%",
                background: saving || newPassword.length < 8 ? "var(--bg3)" : "var(--gold)",
                color: saving || newPassword.length < 8 ? "var(--text-dim)" : "#1a1a1a",
                border: "none", borderRadius: 8,
                padding: "12px", fontSize: 14, fontWeight: 600,
                cursor: saving || newPassword.length < 8 ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
