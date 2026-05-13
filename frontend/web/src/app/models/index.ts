export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixOriginal?: number;
  reduction?: number;
  categorie: string;
  image: string;
  images?: string[];
  vendeur: string;
  note: number;
  nombreAvis: number;
  stock: number;
  unite?: string;
  estBio?: boolean;
  estDeSaison?: boolean;
  dateRecolte?: string;
}

export interface Categorie {
  id: number;
  nom: string;
  description: string;
  icone?: string;
  parent?: Categorie;
  sousCategories?: Categorie[];
}

export interface Vendeur {
  id: number;
  nom: string;
  description: string;
  logo?: string;
  note: number;
  nombreEvaluations: number;
  adresse?: string;
  telephone?: string;
}

export interface Article {
  id: number;
  produitId: number;
  nom: string;
  prix: number;
  quantite: number;
  image: string;
}

export interface Commande {
  id: number;
  numero: string;
  dateCommande: Date;
  statut: string;
  montantTotal: number;
  fraisLivraison: number;
  articles: Article[];
  adresseLivraison: string;
  modeLivraison: string;
  clientId: number;
  producteurId: number;
}

export interface Avis {
  id: number;
  note: number;
  commentaire: string;
  auteur: string;
  date: Date;
  verifieAchat: boolean;
}

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  role: string;
}
