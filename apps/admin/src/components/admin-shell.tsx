"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { api, type AdminUser } from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/currencies", label: "Monedas", icon: "💱" },
  { href: "/users", label: "Usuarios", icon: "👥" },
  { href: "/audit", label: "Auditoría", icon: "📋" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }

    api.me()
      .then(setUser)
      .catch(() => { router.replace("/login"); })
      .finally(() => setReady(true));
  }, [router]);

  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", color: "var(--text-dim)", fontSize: 13 }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: "var(--bg2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
      }}>
        <div style={{ padding: "0 8px", marginBottom: 28 }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2, color: "var(--gold)" }}>GAMAEX</div>
          <div style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Panel de administración</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--gold)" : "var(--text-dim)",
                  background: active ? "var(--gold-dim)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 15 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
          <div style={{ padding: "0 8px", marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{user?.email}</div>
            <div style={{
              display: "inline-block",
              marginTop: 4,
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 20,
              background: "var(--gold-dim)",
              color: "var(--gold)",
              letterSpacing: 0.5,
            }}>
              {user?.role}
            </div>
          </div>
          <button
            onClick={() => { api.logout(); router.replace("/login"); }}
            style={{
              width: "100%",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-dim)",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              transition: "all 0.15s",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflow: "auto", background: "var(--bg)" }}>
        {children}
      </main>
    </div>
  );
}
