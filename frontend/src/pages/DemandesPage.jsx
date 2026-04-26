import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  ChevronDown,
  FileText,
  QrCode,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  RefreshCw,
  Loader,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { demandeApi, citoyenApi } from "../services/api";
import { mockApi } from "../services/mockData";
import toast from "react-hot-toast";

const STATUT_CONFIG = {
  EN_ATTENTE: { label: "En attente", cls: "badge-pending", icon: Clock },
  EN_COURS: { label: "En cours", cls: "badge-progress", icon: RefreshCw },
  VALIDEE: { label: "Validée", cls: "badge-valid", icon: CheckCircle },
  REJETEE: { label: "Rejetée", cls: "badge-rejected", icon: XCircle },
  IMPRIMEE: { label: "Imprimée", cls: "badge-printed", icon: Printer },
};
const TYPE_CONFIG = {
  NOUVELLE_CARTE: { label: "Nouvelle carte", color: "var(--accent)" },
  RENOUVELLEMENT: { label: "Renouvellement", color: "var(--teal)" },
  DUPLICATA: { label: "Duplicata", color: "var(--orange)" },
};

function CreateModal({ citoyens, onClose, onSave }) {
  const [form, setForm] = useState({
    citoyenId: "",
    typeDemande: "NOUVELLE_CARTE",
  });
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    if (!form.citoyenId) {
      toast.error("Sélectionnez un citoyen");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ maxWidth: "480px" }}>
        <div className="modal-header">
          <h2>Nouvelle demande CIN</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Citoyen *</label>
            <select
              value={form.citoyenId}
              onChange={(e) =>
                setForm((f) => ({ ...f, citoyenId: +e.target.value }))
              }
            >
              <option value="">— Sélectionner —</option>
              {citoyens.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.prenom} {c.nom} ({c.numeroNational})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type *</label>
            <select
              value={form.typeDemande}
              onChange={(e) =>
                setForm((f) => ({ ...f, typeDemande: e.target.value }))
              }
            >
              <option value="NOUVELLE_CARTE">Nouvelle carte</option>
              <option value="RENOUVELLEMENT">Renouvellement</option>
              <option value="DUPLICATA">Duplicata (perte / vol)</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : null}
            {saving ? "Création..." : "Créer la demande"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusModal({ demande, onClose, onUpdate }) {
  const [statut, setStatut] = useState(demande.statut);
  const [motif, setMotif] = useState("");
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(demande.id, { statut, motifRejet: motif });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ maxWidth: "480px" }}>
        <div className="modal-header">
          <h2>Mettre à jour le statut</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              padding: "10px 14px",
              background: "var(--bg-2)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Dossier
            </div>
            <div className="mono" style={{ color: "var(--accent-light)" }}>
              {demande.numeroDossier}
            </div>
            <div
              style={{ fontSize: "0.85rem", marginTop: "4px", fontWeight: 500 }}
            >
              {demande.citoyenPrenom} {demande.citoyenNom}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nouveau statut</label>
            <select value={statut} onChange={(e) => setStatut(e.target.value)}>
              {Object.entries(STATUT_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          {statut === "REJETEE" && (
            <div className="form-group">
              <label className="form-label">Motif de rejet</label>
              <textarea
                rows={3}
                placeholder="Expliquez le motif..."
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QrModal({ demande, onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box" style={{ maxWidth: "400px" }}>
        <div className="modal-header">
          <h2>QR Code du document</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div
          className="modal-body"
          style={{ alignItems: "center", textAlign: "center" }}
        >
          <div
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "var(--radius-md)",
              display: "inline-block",
            }}
          >
            <QRCodeSVG value={demande.qrCodeData} size={180} level="H" />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {demande.citoyenPrenom} {demande.citoyenNom}
            </div>
            <div
              className="mono"
              style={{ color: "var(--accent-light)", fontSize: "0.75rem" }}
            >
              {demande.numeroDossier}
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
              width: "100%",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                marginBottom: "4px",
                textTransform: "uppercase",
              }}
            >
              Données QR
            </div>
            <div
              className="mono"
              style={{
                fontSize: "0.67rem",
                wordBreak: "break-all",
                color: "var(--text-secondary)",
              }}
            >
              {demande.qrCodeData}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DemandesPage() {
  const [demandes, setDemandes] = useState([]);
  const [citoyens, setCitoyens] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dr, cr] = await Promise.all([
        demandeApi.getAll(),
        citoyenApi.getAll(),
      ]);
      setDemandes(dr.data);
      setCitoyens(cr.data);
      setUseMock(false);
    } catch {
      setDemandes(mockApi.getDemandes());
      setCitoyens(mockApi.getCitoyens());
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (form) => {
    try {
      if (useMock) {
        mockApi.createDemande(form);
        toast.success("Demande créée (démo)");
      } else {
        await demandeApi.create(form);
        toast.success("Demande créée");
      }
      load();
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      throw err;
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      if (useMock) {
        mockApi.updateDemandeStatus(id, data);
        toast.success("Statut mis à jour (démo)");
      } else {
        await demandeApi.updateStatus(id, data);
        toast.success("Statut mis à jour");
      }
      load();
      setModal(null);
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      throw err;
    }
  };

  const filtered =
    filter === "ALL" ? demandes : demandes.filter((d) => d.statut === filter);
  const counts = {};
  Object.keys(STATUT_CONFIG).forEach((k) => {
    counts[k] = demandes.filter((d) => d.statut === k).length;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Demandes CIN</div>
          <div className="page-subtitle">
            {demandes.length} demande(s)
            {useMock && (
              <span
                style={{
                  color: "var(--orange)",
                  marginLeft: "8px",
                  fontSize: "0.72rem",
                }}
              >
                ● démo
              </span>
            )}
          </div>
        </div>
        <button className="btn-primary" onClick={() => setModal("create")}>
          <Plus size={16} /> Nouvelle demande
        </button>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          { k: "ALL", label: `Toutes (${demandes.length})` },
          ...Object.entries(STATUT_CONFIG).map(([k, v]) => ({
            k,
            label: `${v.label} (${counts[k] || 0})`,
          })),
        ].map(({ k, label }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              padding: "7px 14px",
              borderRadius: "99px",
              border: "1px solid",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              background:
                filter === k
                  ? k === "ALL"
                    ? "var(--accent)"
                    : "var(--bg-3)"
                  : "var(--bg-2)",
              color:
                filter === k
                  ? k === "ALL"
                    ? "#fff"
                    : "var(--text-primary)"
                  : "var(--text-secondary)",
              borderColor:
                filter === k
                  ? k === "ALL"
                    ? "var(--accent)"
                    : "var(--border-accent)"
                  : "var(--border)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N° Dossier</th>
                <th>Citoyen</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Agent</th>
                <th>Date dépôt</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: "18px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <FileText size={36} style={{ opacity: 0.3 }} />
                      <h3>Aucune demande</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const sc = STATUT_CONFIG[d.statut];
                  const tc = TYPE_CONFIG[d.typeDemande];
                  return (
                    <tr key={d.id}>
                      <td>
                        <span
                          className="mono"
                          style={{ color: "var(--accent-light)" }}
                        >
                          {d.numeroDossier}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {d.citoyenPrenom} {d.citoyenNom}
                        </div>
                        <div
                          className="mono"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.72rem",
                          }}
                        >
                          {d.citoyenNumeroNational}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: tc?.color,
                            fontWeight: 600,
                          }}
                        >
                          {tc?.label}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${sc?.cls}`}>{sc?.label}</span>
                      </td>
                      <td
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.83rem",
                        }}
                      >
                        {d.agentNom || (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {d.dateDepot
                          ? new Date(d.dateDepot).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "flex-end",
                          }}
                        >
                          {d.qrCodeData && (
                            <button
                              className="btn-icon"
                              title="QR Code"
                              onClick={() => {
                                setSelected(d);
                                setModal("qr");
                              }}
                            >
                              <QrCode size={14} />
                            </button>
                          )}
                          <button
                            className="btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                            onClick={() => {
                              setSelected(d);
                              setModal("status");
                            }}
                          >
                            <ChevronDown size={13} /> Statut
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal === "create" && (
        <CreateModal
          citoyens={citoyens}
          onClose={() => setModal(null)}
          onSave={handleCreate}
        />
      )}
      {modal === "status" && selected && (
        <StatusModal
          demande={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
      {modal === "qr" && selected && (
        <QrModal
          demande={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
