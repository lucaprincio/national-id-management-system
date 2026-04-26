import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const TITLES = {
  "/dashboard": "Tableau de bord",
  "/citoyens": "Gestion des Citoyens",
  "/demandes": "Demandes CIN",
  "/utilisateurs": "Gestion des Utilisateurs",
};

export default function Layout() {
  const loc = useLocation();
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "var(--sidebar-w)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            height: "60px",
            background: "var(--bg-1)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            {TITLES[loc.pathname] || "CIN System"}
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "var(--green)",
                borderRadius: "50%",
                boxShadow: "0 0 8px var(--green)",
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Système en ligne
            </span>
          </div>
        </header>
        <div
          style={{ flex: 1, padding: "28px", overflowX: "hidden" }}
          className="fade-in"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
