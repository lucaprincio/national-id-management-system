import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  Shield,
  ToggleLeft,
  ToggleRight,
  Save,
  Loader,
} from "lucide-react";
import { userApi } from "../services/api";
import { mockApi } from "../services/mockData";
import toast from "react-hot-toast";

const ROLES = {
  ADMIN: {
    label: "Administrateur",
    color: "var(--gold)",
    bg: "var(--gold-dim)",
  },
  AGENT_ENREGISTREMENT: {
    label: "Agent Enregistrement",
    color: "var(--accent-light)",
    bg: "var(--accent-dim)",
  },
  AGENT_VALIDATION: {
    label: "Agent Validation",
    color: "var(--teal)",
    bg: "rgba(0,201,212,0.12)",
  },
  SUPERVISEUR: {
    label: "Superviseur",
    color: "var(--purple)",
    bg: "var(--purple-dim)",
  },
};

function UserModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    role: "AGENT_ENREGISTREMENT",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSave = async () => {
    if (!form.nom || !form.email || !form.motDePasse) {
      toast.error("Remplissez tous les champs");
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
      <div className="modal-box" style={{ maxWidth: "500px" }}>
        <div className="modal-header">
          <h2>Créer un utilisateur</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                placeholder="Prénom"
                value={form.prenom}
                onChange={(e) => set("prenom", e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              placeholder="nom@cin.gov.mg"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <input
              type="password"
              placeholder="Min. 8 caractères"
              value={form.motDePasse}
              onChange={(e) => set("motDePasse", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Rôle *</label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              {Object.entries(ROLES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
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
            ) : (
              <Save size={15} />
            )}
            {saving ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UtilisateursPage() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
      setUseMock(false);
    } catch {
      setUsers(mockApi.getUsers());
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
        mockApi.createUser(form);
        toast.success("Utilisateur créé (démo)");
      } else {
        await userApi.create(form);
        toast.success("Utilisateur créé");
      }
      load();
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
      throw err;
    }
  };

  const handleToggle = async (u) => {
    try {
      if (useMock) {
        mockApi.toggleUser(u.id);
      } else {
        await userApi.toggleStatus(u.id);
      }
      toast.success(u.actif ? "Compte désactivé" : "Compte activé");
      load();
    } catch {
      toast.error("Erreur");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Utilisateurs</div>
          <div className="page-subtitle">
            {users.length} utilisateur(s)
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
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus size={16} /> Nouvel utilisateur
        </button>
      </div>

      {/* Role summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {Object.entries(ROLES).map(([k, v]) => {
          const count = users.filter((u) => u.role === k).length;
          return (
            <div key={k} className="card" style={{ padding: "14px 18px" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                {v.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: v.color,
                }}
              >
                {count}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j}>
                          <div
                            className="skeleton"
                            style={{ height: "18px" }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.map((u) => {
                    const role = ROLES[u.role];
                    return (
                      <tr key={u.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                background: role?.bg || "var(--bg-3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Shield
                                size={15}
                                color={role?.color || "var(--text-muted)"}
                              />
                            </div>
                            <div
                              style={{ fontWeight: 600, fontSize: "0.875rem" }}
                            >
                              {u.prenom} {u.nom}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            fontSize: "0.83rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {u.email}
                        </td>
                        <td>
                          <span
                            style={{
                              background: role?.bg,
                              color: role?.color,
                              padding: "3px 10px",
                              borderRadius: "99px",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {role?.label}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${u.actif ? "badge-active" : "badge-inactive"}`}
                          >
                            {u.actif ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {u.dateCreation
                            ? new Date(u.dateCreation).toLocaleDateString(
                                "fr-FR",
                              )
                            : "—"}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              onClick={() => handleToggle(u)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "none",
                                border: "none",
                                color: u.actif ? "var(--red)" : "var(--green)",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                padding: "6px 10px",
                                borderRadius: "var(--radius-sm)",
                              }}
                            >
                              {u.actif ? (
                                <ToggleRight size={18} />
                              ) : (
                                <ToggleLeft size={18} />
                              )}
                              {u.actif ? "Désactiver" : "Activer"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <UserModal onClose={() => setModal(false)} onSave={handleCreate} />
      )}
    </div>
  );
}
