import { useState } from "react";
import {
  QrCode,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { verifyApi } from "../services/api";
import { mockApi } from "../services/mockData";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleVerify = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      // Try real backend first
      const res = await verifyApi.verify(code.trim());
      setResult(res.data);
    } catch (axiosErr) {
      // Fall back to mock
      try {
        const d = mockApi.verifyQr(code.trim());
        setResult(d);
      } catch {
        setError("Document non trouvé ou QR Code invalide.");
      }
    } finally {
      setLoading(false);
    }
  };

  const DEMO = [
    "CIN:MG-2001-0001|DOS:DOS-A1B2C3D4|SIG:ABC123XYZ",
    "CIN:MG-2001-0005|DOS:DOS-Q7R8S9T0|SIG:DEF456UVW",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-0)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(99,130,255,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "560px", position: "relative" }}>
        <button
          onClick={() => nav(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginBottom: "28px",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background:
                "linear-gradient(135deg, var(--accent), var(--purple))",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 20px rgba(99,130,255,0.3)",
            }}
          >
            <QrCode size={28} color="white" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              fontWeight: 800,
              marginBottom: "6px",
            }}
          >
            Vérification CIN
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Authentifiez un document en saisissant les données de son QR Code.
          </p>
        </div>

        <div className="card" style={{ marginBottom: "16px" }}>
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label className="form-label">Données QR Code</label>
            <textarea
              rows={3}
              placeholder="CIN:MG-XXXX-XXXX|DOS:DOS-XXXXXXXX|SIG:..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleVerify())
              }
              style={{
                resize: "vertical",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
              }}
            />
          </div>
          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            onClick={handleVerify}
            disabled={!code.trim() || loading}
          >
            {loading ? (
              <Loader
                size={17}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Search size={17} />
            )}
            {loading ? "Vérification..." : "Vérifier le document"}
          </button>
        </div>

        {/* Demo codes */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Codes de démonstration
          </div>
          {DEMO.map((d, i) => (
            <button
              key={i}
              onClick={() => setCode(d)}
              style={{
                display: "block",
                width: "100%",
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 12px",
                textAlign: "left",
                cursor: "pointer",
                marginBottom: "6px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <div
                className="mono"
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                  wordBreak: "break-all",
                }}
              >
                {d}
              </div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "var(--red-dim)",
              border: "1px solid rgba(255,77,109,0.2)",
              borderRadius: "var(--radius-md)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <XCircle size={20} color="var(--red)" />
            <span style={{ color: "var(--red)", fontWeight: 500 }}>
              {error}
            </span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className="card fade-in"
            style={{ borderColor: "rgba(0,214,143,0.3)" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
                padding: "12px",
                background: "var(--green-dim)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <CheckCircle size={20} color="var(--green)" />
              <span style={{ color: "var(--green)", fontWeight: 700 }}>
                Document authentifié avec succès
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1 }}>
                {[
                  {
                    label: "Citoyen",
                    val: `${result.citoyenPrenom || ""} ${result.citoyenNom || ""}`.trim(),
                  },
                  { label: "N° National", val: result.citoyenNumeroNational },
                  { label: "N° Dossier", val: result.numeroDossier },
                  {
                    label: "Type",
                    val: result.typeDemande?.replace(/_/g, " "),
                  },
                  { label: "Statut", val: result.statut?.replace(/_/g, " ") },
                  {
                    label: "Date dépôt",
                    val: result.dateDepot
                      ? new Date(result.dateDepot).toLocaleDateString("fr-FR")
                      : "—",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.77rem",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {r.label}
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {r.val || "—"}
                    </span>
                  </div>
                ))}
              </div>
              {result.qrCodeData && (
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <QRCodeSVG value={result.qrCodeData} size={110} level="H" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Shield size={12} color="var(--green)" />
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--green)",
                        fontWeight: 600,
                      }}
                    >
                      Signature valide
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
