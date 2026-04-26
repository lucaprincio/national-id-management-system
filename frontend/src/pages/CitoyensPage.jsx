import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  User,
  Save,
  Eye,
  Loader,
} from "lucide-react";
import { citoyenApi } from "../services/api";
import { mockApi } from "../services/mockData";
import toast from "react-hot-toast";

const EMPTY = {
  numeroNational: "",
  nom: "",
  prenom: "",
  dateNaissance: "",
  lieuNaissance: "",
  sexe: "M",
  adresse: "",
  region: "",
  profession: "",
};
const REGIONS = [
  "Analamanga",
  "Atsinanana",
  "Boeny",
  "Betsiboka",
  "Menabe",
  "Atsimo-Andrefana",
  "Haute Matsiatra",
  "Diana",
  "Sava",
  "Alaotra-Mangoro",
  "Bongolava",
  "Itasy",
  "Vakinankaratra",
  "Amoroni'i Mania",
  "Fitovinany",
  "Matsiatra Ambony",
  "Anosy",
  "Androy",
  "Atsimo-Atsinanana",
  "Melaky",
  "Sofia",
  "Vatovavy",
];

// Try real API, fall back to mock
async function apiOr(apiFn, mockFn) {
  try {
    const r = await apiFn();
    return r.data;
  } catch {
    return mockFn();
  }
}

function CitoyenModal({ citoyen, onClose, onSave }) {
  const [form, setForm] = useState(
    citoyen
      ? {
          ...citoyen,
          dateNaissance: citoyen.dateNaissance?.slice(0, 10) || "",
        }
      : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (
      !form.numeroNational ||
      !form.nom ||
      !form.prenom ||
      !form.dateNaissance ||
      !form.lieuNaissance ||
      !form.adresse
    ) {
      toast.error("Remplissez tous les champs obligatoires");
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
      <div className="modal-box">
        <div className="modal-header">
          <h2>{citoyen ? "Modifier le citoyen" : "Enregistrer un citoyen"}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">N° National *</label>
              <input
                placeholder="MG-AAAA-NNNN"
                value={form.numeroNational}
                onChange={(e) => set("numeroNational", e.target.value)}
                disabled={!!citoyen}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sexe *</label>
              <select
                value={form.sexe}
                onChange={(e) => set("sexe", e.target.value)}
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                placeholder="Nom de famille"
                value={form.nom}
                onChange={(e) => set("nom", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input
                placeholder="Prénom(s)"
                value={form.prenom}
                onChange={(e) => set("prenom", e.target.value)}
              />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Date de naissance *</label>
              <input
                type="date"
                value={form.dateNaissance}
                onChange={(e) => set("dateNaissance", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lieu de naissance *</label>
              <input
                placeholder="Ville / Commune"
                value={form.lieuNaissance}
                onChange={(e) => set("lieuNaissance", e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Adresse *</label>
            <input
              placeholder="Lot, rue, quartier, ville"
              value={form.adresse}
              onChange={(e) => set("adresse", e.target.value)}
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Région</label>
              <select
                value={form.region || ""}
                onChange={(e) => set("region", e.target.value)}
              >
                <option value="">— Sélectionner —</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Profession</label>
              <input
                placeholder="Profession actuelle"
                value={form.profession || ""}
                onChange={(e) => set("profession", e.target.value)}
              />
            </div>
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
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ citoyen, onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <div className="modal-header">
          <h2>Fiche citoyen</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "14px",
              background: "var(--bg-2)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "var(--accent-dim)",
                border: "2px solid var(--border-accent)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={24} color="var(--accent-light)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                }}
              >
                {citoyen.prenom} {citoyen.nom}
              </div>
              <div
                className="mono"
                style={{ color: "var(--accent-light)", fontSize: "0.8rem" }}
              >
                {citoyen.numeroNational}
              </div>
            </div>
            <span className="badge badge-active" style={{ marginLeft: "auto" }}>
              {citoyen.sexe === "M" ? "Masculin" : "Féminin"}
            </span>
          </div>
          {[
            {
              label: "Date de naissance",
              val: citoyen.dateNaissance
                ? new Date(citoyen.dateNaissance).toLocaleDateString("fr-FR")
                : "—",
            },
            { label: "Lieu de naissance", val: citoyen.lieuNaissance },
            { label: "Adresse", val: citoyen.adresse },
            { label: "Région", val: citoyen.region || "—" },
            { label: "Profession", val: citoyen.profession || "—" },
            {
              label: "Enregistré le",
              val: citoyen.dateEnregistrement
                ? new Date(citoyen.dateEnregistrement).toLocaleDateString(
                    "fr-FR",
                  )
                : "—",
            },
          ].map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {r.label}
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                {r.val}
              </span>
            </div>
          ))}
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

export default function CitoyensPage() {
  const [citoyens, setCitoyens] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await citoyenApi.getAll(q || undefined);
      setCitoyens(res.data);
      setUseMock(false);
    } catch {
      setCitoyens(mockApi.getCitoyens(q));
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (form) => {
    try {
      if (modal === "create") {
        if (useMock) {
          mockApi.createCitoyen(form);
          toast.success("Citoyen enregistré (démo)");
        } else {
          await citoyenApi.create(form);
          toast.success("Citoyen enregistré");
        }
      } else {
        if (useMock) {
          mockApi.updateCitoyen(selected.id, form);
          toast.success("Mis à jour (démo)");
        } else {
          await citoyenApi.update(selected.id, form);
          toast.success("Citoyen mis à jour");
        }
      }
      load(search);
      setModal(null);
      setSelected(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'enregistrement",
      );
      throw err;
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Archiver ${c.prenom} ${c.nom} ?`)) return;
    try {
      if (useMock) {
        mockApi.deleteCitoyen(c.id);
      } else {
        await citoyenApi.delete(c.id);
      }
      toast.success("Citoyen archivé");
      load(search);
    } catch {
      toast.error("Erreur lors de l'archivage");
    }
  };

  const filtered = search
    ? citoyens.filter(
        (c) =>
          c.nom?.toLowerCase().includes(search.toLowerCase()) ||
          c.prenom?.toLowerCase().includes(search.toLowerCase()) ||
          c.numeroNational?.includes(search),
      )
    : citoyens;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Citoyens</div>
          <div className="page-subtitle">
            {citoyens.length} enregistré(s)
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
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                load(e.target.value);
              }}
              style={{ width: "220px" }}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setSelected(null);
              setModal("create");
            }}
          >
            <Plus size={16} /> Nouveau citoyen
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N° National</th>
                <th>Nom complet</th>
                <th>Date naissance</th>
                <th>Région</th>
                <th>Profession</th>
                <th>Enregistré le</th>
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
                      <User size={36} style={{ opacity: 0.3 }} />
                      <h3>Aucun citoyen trouvé</h3>
                      <p style={{ fontSize: "0.83rem" }}>
                        {search
                          ? "Modifiez votre recherche."
                          : "Enregistrez le premier citoyen."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span
                        className="mono"
                        style={{ color: "var(--accent-light)" }}
                      >
                        {c.numeroNational}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {c.prenom} {c.nom}
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {c.dateNaissance
                        ? new Date(c.dateNaissance).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td>
                      {c.region || (
                        <span style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {c.profession || "—"}
                    </td>
                    <td
                      style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
                    >
                      {c.dateEnregistrement
                        ? new Date(c.dateEnregistrement).toLocaleDateString(
                            "fr-FR",
                          )
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
                        <button
                          className="btn-icon"
                          title="Voir"
                          onClick={() => {
                            setSelected(c);
                            setModal("view");
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Modifier"
                          onClick={() => {
                            setSelected(c);
                            setModal("edit");
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn-danger"
                          title="Archiver"
                          onClick={() => handleDelete(c)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === "create" || modal === "edit") && (
        <CitoyenModal
          citoyen={modal === "edit" ? selected : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal === "view" && selected && (
        <DetailModal citoyen={selected} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
