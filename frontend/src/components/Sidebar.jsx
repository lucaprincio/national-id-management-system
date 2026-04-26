import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  LogOut,
  User,
  QrCode,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/citoyens", icon: Users, label: "Citoyens" },
  { to: "/demandes", icon: FileText, label: "Demandes CIN" },
  {
    to: "/utilisateurs",
    icon: Shield,
    label: "Utilisateurs",
    roles: ["ADMIN"],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    nav("/login");
  };

  const roleBadge = {
    ADMIN: "Administrateur",
    AGENT_ENREGISTREMENT: "Agent Enreg.",
    AGENT_VALIDATION: "Agent Valid.",
    SUPERVISEUR: "Superviseur",
  };

  return (
    <aside
      style={{
        width: "var(--sidebar-w)",
        background: "var(--bg-1)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              background:
                "linear-gradient(135deg, var(--accent), var(--purple))",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 12px rgba(99,130,255,0.3)",
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
              }}
            >
              CIN System
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Madagascar
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "8px 10px 4px",
            fontWeight: 600,
          }}
        >
          Navigation
        </div>
        {NAV.filter((n) => !n.roles || n.roles.includes(user?.role)).map(
          ({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                transition: "all var(--transition)",
                background: isActive ? "var(--accent-dim)" : "transparent",
                color: isActive
                  ? "var(--accent-light)"
                  : "var(--text-secondary)",
                border: isActive
                  ? "1px solid var(--border-accent)"
                  : "1px solid transparent",
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {isActive && <ChevronRight size={14} />}
                </>
              )}
            </NavLink>
          ),
        )}

        <div
          style={{
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "16px 10px 4px",
            fontWeight: 600,
          }}
        >
          Outils
        </div>
        <NavLink
          to="/verify"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            textDecoration: "none",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            transition: "all var(--transition)",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-2)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <QrCode size={17} />
          <span>Vérifier QR Code</span>
        </NavLink>
      </nav>

      {/* User card */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        <div
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                background:
                  "linear-gradient(135deg, var(--accent-dim), var(--purple-dim))",
                border: "1px solid var(--border-accent)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User size={16} color="var(--accent-light)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.prenom} {user?.nom}
              </div>
              <div
                style={{ fontSize: "0.72rem", color: "var(--accent-light)" }}
              >
                {roleBadge[user?.role]}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "8px",
              fontSize: "0.82rem",
            }}
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
}
