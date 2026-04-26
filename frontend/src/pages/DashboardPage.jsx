import { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  AlertTriangle,
  TrendingUp,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { dashboardApi } from "../services/api";
import { mockApi } from "../services/mockData";

const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];
const PIE_COLORS = [
  "#6382ff",
  "#00d68f",
  "#ff8c42",
  "#b06bff",
  "#00c9d4",
  "#f0a500",
  "#ff4d6d",
  "#4a5568",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
      }}
    >
      <p
        style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          marginBottom: "4px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          color: "var(--accent-light)",
        }}
      >
        {payload[0].value.toLocaleString()} demandes
      </p>
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [source, setSource] = useState("");

  const load = async () => {
    setStats(null);
    try {
      const res = await dashboardApi.getStats();
      setStats(res.data);
      setSource("backend");
    } catch {
      setStats(mockApi.getStats());
      setSource("demo");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!stats)
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: "100px", borderRadius: "var(--radius-lg)" }}
            />
          ))}
        </div>
        <div
          className="skeleton"
          style={{ height: "320px", borderRadius: "var(--radius-lg)" }}
        />
      </div>
    );

  const statCards = [
    {
      label: "Total Citoyens",
      value: stats.totalCitoyens?.toLocaleString(),
      icon: Users,
      color: "var(--accent)",
      bg: "var(--accent-dim)",
      sub: "Enregistrés",
    },
    {
      label: "Cartes Délivrées",
      value: stats.cartesDelivrees?.toLocaleString(),
      icon: CreditCard,
      color: "var(--green)",
      bg: "var(--green-dim)",
      sub: "CIN actives",
    },
    {
      label: "En Attente",
      value: stats.demandesEnAttente?.toLocaleString(),
      icon: Clock,
      color: "var(--orange)",
      bg: "var(--orange-dim)",
      sub: "À traiter",
    },
    {
      label: "Dossiers en retard",
      value: stats.dossiersEnRetard?.toLocaleString(),
      icon: AlertTriangle,
      color: "var(--red)",
      bg: "var(--red-dim)",
      sub: "Dépassement délai",
    },
  ];

  const barData = (stats.statistiquesMensuelles || []).map((s) => ({
    mois: MONTHS[s.mois - 1],
    nombre: s.nombre,
  }));
  const pieData = Object.entries(stats.repartitionRegion || {}).map(
    ([name, value]) => ({ name, value }),
  );

  return (
    <div>
      {/* Source indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: "16px",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            color: source === "backend" ? "var(--green)" : "var(--orange)",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background:
                source === "backend" ? "var(--green)" : "var(--orange)",
              boxShadow:
                source === "backend"
                  ? "0 0 8px var(--green)"
                  : "0 0 8px var(--orange)",
            }}
          />
          {source === "backend"
            ? "Données en direct — Spring Boot"
            : "Mode démo — données simulées"}
        </div>
        <button className="btn-icon" onClick={load} title="Rafraîchir">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {statCards.map((s, i) => (
          <div
            key={i}
            className="stat-card fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className="stat-icon"
              style={{ background: s.bg, color: s.color }}
            >
              <s.icon size={22} />
            </div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>
                {s.value ?? "—"}
              </div>
              <div
                style={{
                  fontSize: "0.73rem",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "En cours",
            value: stats.demandesEnCours,
            icon: RefreshCw,
            color: "var(--accent-light)",
          },
          {
            label: "Validées",
            value: stats.demandesValidees,
            icon: CheckCircle,
            color: "var(--green)",
          },
          {
            label: "Rejetées",
            value: stats.demandesRejetees,
            icon: XCircle,
            color: "var(--red)",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="card"
            style={{ display: "flex", alignItems: "center", gap: "14px" }}
          >
            <s.icon size={20} color={s.color} />
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: s.color,
                }}
              >
                {(s.value ?? 0).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <TrendingUp size={18} color="var(--accent)" />
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Demandes mensuelles — 2024
            </h3>
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={barData}
                margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="mois"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(99,130,255,0.06)" }}
                />
                <Bar
                  dataKey="nombre"
                  fill="var(--accent)"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: "240px" }}>
              <p>Aucune donnée mensuelle</p>
            </div>
          )}
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <MapPin size={18} color="var(--accent)" />
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Répartition par région
            </h3>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [v.toLocaleString(), "Citoyens"]}
                  contentStyle={{
                    background: "var(--bg-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                  }}
                />
                <Legend
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "0.73rem",
                    color: "var(--text-secondary)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: "240px" }}>
              <p>Aucune donnée régionale</p>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="card">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: "16px",
          }}
        >
          Aperçu des statuts
        </h3>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            {
              label: "En attente",
              val: stats.demandesEnAttente,
              cls: "badge-pending",
            },
            {
              label: "En cours",
              val: stats.demandesEnCours,
              cls: "badge-progress",
            },
            {
              label: "Validées",
              val: stats.demandesValidees,
              cls: "badge-valid",
            },
            {
              label: "Rejetées",
              val: stats.demandesRejetees,
              cls: "badge-rejected",
            },
            {
              label: "Imprimées",
              val: stats.cartesDelivrees,
              cls: "badge-printed",
            },
          ].map((s) => (
            <span
              key={s.label}
              className={`badge ${s.cls}`}
              style={{ fontSize: "0.82rem", padding: "5px 14px", gap: "8px" }}
            >
              {s.label}
              <span
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                {(s.val ?? 0).toLocaleString()}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
