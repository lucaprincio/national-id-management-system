// Mock data for demo when backend is offline
export const MOCK_USER = {
  id: 1,
  nom: "Rakoto",
  prenom: "Jean",
  email: "admin@cin.gov.mg",
  role: "ADMIN",
  token: "mock-jwt-token",
};

export const MOCK_STATS = {
  totalCitoyens: 14832,
  cartesDelivrees: 12401,
  demandesEnAttente: 47,
  demandesValidees: 12401,
  demandesRejetees: 312,
  demandesEnCours: 89,
  dossiersEnRetard: 12,
  statistiquesMensuelles: [
    { mois: 1, nombre: 980 },
    { mois: 2, nombre: 1150 },
    { mois: 3, nombre: 870 },
    { mois: 4, nombre: 1320 },
    { mois: 5, nombre: 1100 },
    { mois: 6, nombre: 1450 },
    { mois: 7, nombre: 990 },
    { mois: 8, nombre: 1230 },
    { mois: 9, nombre: 1380 },
    { mois: 10, nombre: 1560 },
    { mois: 11, nombre: 1280 },
    { mois: 12, nombre: 1100 },
  ],
  repartitionRegion: {
    Analamanga: 4200,
    Atsinanana: 2100,
    Boeny: 1800,
    Betsiboka: 900,
    Menabe: 1200,
    "Atsimo-Andrefana": 1600,
    "Haute Matsiatra": 1400,
    Autres: 1632,
  },
};

let citoyens = [
  {
    id: 1,
    numeroNational: "MG-2001-0001",
    nom: "Rakoto",
    prenom: "Jean",
    dateNaissance: "1985-03-15",
    lieuNaissance: "Antananarivo",
    sexe: "M",
    adresse: "Lot II A 47, Antananarivo",
    region: "Analamanga",
    profession: "Enseignant",
    archive: false,
    dateEnregistrement: "2024-01-10T09:30:00",
  },
  {
    id: 2,
    numeroNational: "MG-2001-0002",
    nom: "Rabe",
    prenom: "Marie",
    dateNaissance: "1990-07-22",
    lieuNaissance: "Toamasina",
    sexe: "F",
    adresse: "Rue du Commerce 12, Toamasina",
    region: "Atsinanana",
    profession: "Infirmière",
    archive: false,
    dateEnregistrement: "2024-01-12T10:15:00",
  },
  {
    id: 3,
    numeroNational: "MG-2001-0003",
    nom: "Razafy",
    prenom: "Paul",
    dateNaissance: "1978-11-08",
    lieuNaissance: "Mahajanga",
    sexe: "M",
    adresse: "Av. de France 5, Mahajanga",
    region: "Boeny",
    profession: "Commerçant",
    archive: false,
    dateEnregistrement: "2024-01-15T14:00:00",
  },
  {
    id: 4,
    numeroNational: "MG-2001-0004",
    nom: "Rasoamahandry",
    prenom: "Claire",
    dateNaissance: "1995-02-28",
    lieuNaissance: "Fianarantsoa",
    sexe: "F",
    adresse: "Quartier Haut 3, Fianarantsoa",
    region: "Haute Matsiatra",
    profession: "Étudiante",
    archive: false,
    dateEnregistrement: "2024-01-18T11:45:00",
  },
  {
    id: 5,
    numeroNational: "MG-2001-0005",
    nom: "Randrianarisoa",
    prenom: "Luc",
    dateNaissance: "1982-06-14",
    lieuNaissance: "Toliara",
    sexe: "M",
    adresse: "Boulevard Lyautey 8, Toliara",
    region: "Atsimo-Andrefana",
    profession: "Pêcheur",
    archive: false,
    dateEnregistrement: "2024-01-20T08:30:00",
  },
];

let demandes = [
  {
    id: 1,
    numeroDossier: "DOS-A1B2C3D4",
    citoyenId: 1,
    citoyenNom: "Rakoto",
    citoyenPrenom: "Jean",
    citoyenNumeroNational: "MG-2001-0001",
    typeDemande: "NOUVELLE_CARTE",
    statut: "VALIDEE",
    agentNom: "Agent Dupont",
    qrCodeData: "CIN:MG-2001-0001|DOS:DOS-A1B2C3D4|SIG:ABC123XYZ",
    dateDepot: "2024-02-01T09:00:00",
    dateMiseAJour: "2024-02-05T14:30:00",
  },
  {
    id: 2,
    numeroDossier: "DOS-E5F6G7H8",
    citoyenId: 2,
    citoyenNom: "Rabe",
    citoyenPrenom: "Marie",
    citoyenNumeroNational: "MG-2001-0002",
    typeDemande: "RENOUVELLEMENT",
    statut: "EN_ATTENTE",
    agentNom: null,
    dateDepot: "2024-02-03T10:00:00",
    dateMiseAJour: "2024-02-03T10:00:00",
  },
  {
    id: 3,
    numeroDossier: "DOS-I9J0K1L2",
    citoyenId: 3,
    citoyenNom: "Razafy",
    citoyenPrenom: "Paul",
    citoyenNumeroNational: "MG-2001-0003",
    typeDemande: "DUPLICATA",
    statut: "EN_COURS",
    agentNom: "Agent Martin",
    dateDepot: "2024-02-05T11:30:00",
    dateMiseAJour: "2024-02-06T09:00:00",
  },
  {
    id: 4,
    numeroDossier: "DOS-M3N4O5P6",
    citoyenId: 4,
    citoyenNom: "Rasoamahandry",
    citoyenPrenom: "Claire",
    citoyenNumeroNational: "MG-2001-0004",
    typeDemande: "NOUVELLE_CARTE",
    statut: "REJETEE",
    agentNom: "Agent Dupont",
    motifRejet: "Documents incomplets",
    dateDepot: "2024-02-07T14:00:00",
    dateMiseAJour: "2024-02-08T10:00:00",
  },
  {
    id: 5,
    numeroDossier: "DOS-Q7R8S9T0",
    citoyenId: 5,
    citoyenNom: "Randrianarisoa",
    citoyenPrenom: "Luc",
    citoyenNumeroNational: "MG-2001-0005",
    typeDemande: "RENOUVELLEMENT",
    statut: "IMPRIMEE",
    agentNom: "Agent Leblanc",
    qrCodeData: "CIN:MG-2001-0005|DOS:DOS-Q7R8S9T0|SIG:DEF456UVW",
    dateDepot: "2024-02-10T08:00:00",
    dateMiseAJour: "2024-02-15T16:00:00",
  },
];

let users = [
  {
    id: 1,
    nom: "Rakoto",
    prenom: "Jean",
    email: "admin@cin.gov.mg",
    role: "ADMIN",
    actif: true,
    dateCreation: "2024-01-01T00:00:00",
  },
  {
    id: 2,
    nom: "Dupont",
    prenom: "Agent",
    email: "dupont@cin.gov.mg",
    role: "AGENT_VALIDATION",
    actif: true,
    dateCreation: "2024-01-05T00:00:00",
  },
  {
    id: 3,
    nom: "Martin",
    prenom: "Agent",
    email: "martin@cin.gov.mg",
    role: "AGENT_ENREGISTREMENT",
    actif: true,
    dateCreation: "2024-01-08T00:00:00",
  },
  {
    id: 4,
    nom: "Leblanc",
    prenom: "Sophie",
    email: "leblanc@cin.gov.mg",
    role: "SUPERVISEUR",
    actif: false,
    dateCreation: "2024-01-10T00:00:00",
  },
];

let nextId = 6;

export const mockApi = {
  login: (email, pass) => {
    if (email === "admin@cin.gov.mg" && pass === "admin123")
      return { ...MOCK_USER };
    throw new Error("Identifiants incorrects");
  },
  getStats: () => ({ ...MOCK_STATS }),
  getCitoyens: (search) =>
    search
      ? citoyens.filter(
          (c) =>
            !c.archive &&
            (c.nom.toLowerCase().includes(search.toLowerCase()) ||
              c.prenom.toLowerCase().includes(search.toLowerCase()) ||
              c.numeroNational.includes(search)),
        )
      : citoyens.filter((c) => !c.archive),
  createCitoyen: (data) => {
    const c = {
      id: nextId++,
      ...data,
      archive: false,
      dateEnregistrement: new Date().toISOString(),
    };
    citoyens.push(c);
    return c;
  },
  updateCitoyen: (id, data) => {
    const i = citoyens.findIndex((c) => c.id === id);
    if (i >= 0) citoyens[i] = { ...citoyens[i], ...data };
    return citoyens[i];
  },
  deleteCitoyen: (id) => {
    const i = citoyens.findIndex((c) => c.id === id);
    if (i >= 0) citoyens[i].archive = true;
  },
  getDemandes: () => [...demandes],
  createDemande: (data) => {
    const citoyen = citoyens.find((c) => c.id === data.citoyenId);
    const d = {
      id: nextId++,
      numeroDossier:
        "DOS-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      citoyenId: data.citoyenId,
      citoyenNom: citoyen?.nom,
      citoyenPrenom: citoyen?.prenom,
      citoyenNumeroNational: citoyen?.numeroNational,
      typeDemande: data.typeDemande,
      statut: "EN_ATTENTE",
      agentNom: null,
      dateDepot: new Date().toISOString(),
      dateMiseAJour: new Date().toISOString(),
    };
    demandes.push(d);
    return d;
  },
  updateDemandeStatus: (id, data) => {
    const i = demandes.findIndex((d) => d.id === id);
    if (i >= 0) {
      demandes[i].statut = data.statut;
      demandes[i].dateMiseAJour = new Date().toISOString();
      if (data.statut === "VALIDEE")
        demandes[i].qrCodeData =
          `CIN:${demandes[i].citoyenNumeroNational}|DOS:${demandes[i].numeroDossier}|SIG:${Math.random().toString(36).substring(2, 14).toUpperCase()}`;
    }
    return demandes[i];
  },
  getUsers: () => [...users],
  createUser: (data) => {
    const u = {
      id: nextId++,
      ...data,
      actif: true,
      dateCreation: new Date().toISOString(),
    };
    users.push(u);
    return u;
  },
  toggleUser: (id) => {
    const i = users.findIndex((u) => u.id === id);
    if (i >= 0) users[i].actif = !users[i].actif;
    return users[i];
  },
  verifyQr: (code) => {
    const d = demandes.find((d) => d.qrCodeData === code);
    if (!d) throw new Error("Document non trouvé");
    return d;
  },
};
