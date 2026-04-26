import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  KeyRound,
  Server,
  Cpu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import { mockApi } from "../services/mockData";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "admin@cin.gov.mg",
    motDePasse: "Admin123!",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("backend"); // 'backend' | 'demo'
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "demo") {
        await new Promise((r) => setTimeout(r, 500));
        const user = mockApi.login(
          form.email,
          form.motDePasse === "Admin123!" ? "admin123" : form.motDePasse,
        );
        login(user);
        toast.success("Connecté en mode démo");
      } else {
        const res = await authApi.login({
          email: form.email,
          motDePasse: form.motDePasse,
        });
        login({ ...res.data, token: res.data.token });
        toast.success("Connexion réussie");
      }
      nav("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Identifiants incorrects";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg-0)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(99,130,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(176,107,255,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
        }}
      />

      {/* Left panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          borderRight: "1px solid var(--border)",
          position: "relative",
        }}
      >
        <div className="fade-in" style={{ maxWidth: "420px", width: "100%" }}>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                background:
                  "linear-gradient(135deg, var(--accent), var(--purple))",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(99,130,255,0.35)",
              }}
            >
              <Shield size={26} color="white" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                }}
              >
                CIN Madagascar
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Système de Gestion
              </div>
            </div>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "8px",
            }}
          >
            Bienvenue
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "28px",
              fontSize: "0.9rem",
            }}
          >
            Connectez-vous à votre espace administratif sécurisé.
          </p>

          {/* Mode switcher */}
          <div
            style={{
              display: "flex",
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "4px",
              marginBottom: "24px",
              gap: "4px",
            }}
          >
            {[
              { id: "backend", label: "Backend réel", icon: Server },
              { id: "demo", label: "Mode démo", icon: Cpu },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setMode(id);
                  setForm({
                    email: "admin@cin.gov.mg",
                    motDePasse: id === "demo" ? "admin123" : "Admin123!",
                  });
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: mode === id ? "var(--accent)" : "transparent",
                  color: mode === id ? "#fff" : "var(--text-muted)",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  style={{ paddingLeft: "40px" }}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.motDePasse}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, motDePasse: e.target.value }))
                  }
                  style={{ paddingLeft: "40px", paddingRight: "40px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                justifyContent: "center",
                padding: "13px",
                marginTop: "4px",
                fontSize: "0.95rem",
                borderRadius: "var(--radius-md)",
              }}
            >
              {loading ? (
                <Loader
                  size={18}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <KeyRound size={18} />
              )}
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Credentials hint */}
          <div
            style={{
              marginTop: "20px",
              padding: "12px 16px",
              background:
                mode === "backend"
                  ? "rgba(0,214,143,0.08)"
                  : "var(--accent-dim)",
              border: `1px solid ${mode === "backend" ? "rgba(0,214,143,0.2)" : "var(--border-accent)"}`,
              borderRadius: "var(--radius-sm)",
            }}
          >
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {mode === "backend" ? (
                <>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>
                    Backend Spring Boot :
                  </span>
                  <br />
                  admin@cin.gov.mg /{" "}
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    Admin123!
                  </span>
                </>
              ) : (
                <>
                  <span
                    style={{ color: "var(--accent-light)", fontWeight: 700 }}
                  >
                    Mode démo (sans backend) :
                  </span>
                  <br />
                  admin@cin.gov.mg /{" "}
                  <span style={{ fontFamily: "var(--font-mono)" }}>
                    admin123
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          width: "460px",
          background: "var(--bg-1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(99,130,255,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="fade-in"
          style={{
            position: "relative",
            textAlign: "center",
            maxWidth: "340px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {[
              { label: "Citoyens", value: "14,832", color: "var(--accent)" },
              {
                label: "Cartes délivrées",
                value: "12,401",
                color: "var(--green)",
              },
              { label: "En attente", value: "47", color: "var(--orange)" },
              { label: "En retard", value: "12", color: "var(--red)" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--bg-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            Gestion Sécurisée des CIN
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.84rem",
              lineHeight: 1.7,
            }}
          >
            Plateforme unifiée pour l'enregistrement, le traitement et la
            délivrance des Cartes d'Identité Nationales à Madagascar.
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            {[
              "JWT Auth",
              "BCrypt",
              "2FA TOTP",
              "QR Verify",
              "RBAC",
              "H2/JPA",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "var(--bg-3)",
                  border: "1px solid var(--border)",
                  borderRadius: "99px",
                  padding: "4px 11px",
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
