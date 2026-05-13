import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ProduitProducteur {
  id: number;
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  stock: number;
  statut: 'Actif' | 'Brouillon' | 'Archivé';
  dateCreation: string;
  ventes: number;
  revenus: number;
  image: string;
  note: number;
  unite: string;
}

export interface CommandeProducteur {
  id: number;
  numeroCommande: string;
  client: string;
  montant: number;
  statut: 'Nouvelle' | 'Confirmée' | 'Préparée' | 'Expédiée' | 'Livrée' | 'Annulée';
  dateCommande: string;
  dateLivraison?: string;
  articles: number;
  adresseLivraison: string;
}

export interface StatistiquesProducteur {
  totalVentes: number;
  revenuTotal: number;
  commandesEnCours: number;
  produitsActifs: number;
  tauxConversion: number;
  noteMoyenne: number;
  visitesAujourdhui: number;
  nouvellesCommandes: number;
}

export interface AnalytiquesProducteur {
  periodes: string[];
  ventes: number[];
  revenus: number[];
  commandes: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProducteurService {
  private apiUrl = '/api/producteur';

  private produitsSubject = new BehaviorSubject<ProduitProducteur[]>([]);
  public produits$ = this.produitsSubject.asObservable();

  private commandesSubject = new BehaviorSubject<CommandeProducteur[]>([]);
  public commandes$ = this.commandesSubject.asObservable();

  private statistiquesSubject = new BehaviorSubject<StatistiquesProducteur | null>(null);
  public statistiques$ = this.statistiquesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initialiserDonnees();
  }

  // Initialiser avec des données de démo
  private initialiserDonnees(): void {
    const produits: ProduitProducteur[] = [
      {
        id: 1,
        nom: 'Tomates Bio Premium',
        description: 'Tomates fraîches cultivées biologiquement',
        prix: 45000,
        categorie: 'Fruits et Légumes',
        stock: 150,
        statut: 'Actif',
        dateCreation: '2026-03-15',
        ventes: 342,
        revenus: 15390000,
        image: 'assets/images/tomates.webp',
        note: 4.8,
        unite: 'kg'
      },
      {
        id: 2,
        nom: 'Oignons Rouges',
        description: 'Oignons rouges frais du terroir',
        prix: 25000,
        categorie: 'Fruits et Légumes',
        stock: 200,
        statut: 'Actif',
        dateCreation: '2026-02-20',
        ventes: 215,
        revenus: 5375000,
        image: 'assets/images/oignons.webp',
        note: 4.5,
        unite: 'kg'
      },
      {
        id: 3,
        nom: 'Carottes Biologiques',
        description: 'Carottes douces et nutritives',
        prix: 35000,
        categorie: 'Fruits et Légumes',
        stock: 180,
        statut: 'Actif',
        dateCreation: '2026-01-10',
        ventes: 298,
        revenus: 10430000,
        image: 'assets/images/carottes.webp',
        note: 4.6,
        unite: 'kg'
      },
      {
        id: 4,
        nom: 'Salades Vertes',
        description: 'Salades fraîches cueillies le jour',
        prix: 15000,
        categorie: 'Fruits et Légumes',
        stock: 250,
        statut: 'Actif',
        dateCreation: '2026-04-01',
        ventes: 87,
        revenus: 1305000,
        image: 'assets/images/salades.webp',
        note: 4.7,
        unite: 'unité'
      }
    ];

    const commandes: CommandeProducteur[] = [
      {
        id: 1001,
        numeroCommande: 'CMD-2026-001',
        client: 'Restaurant Le Gourmet',
        montant: 450000,
        statut: 'Confirmée',
        dateCommande: '2026-04-19',
        dateLivraison: '2026-04-22',
        articles: 12,
        adresseLivraison: 'Yaounde, Cameroon'
      },
      {
        id: 1002,
        numeroCommande: 'CMD-2026-002',
        client: 'Supermarché Carrefour',
        montant: 850000,
        statut: 'Préparée',
        dateCommande: '2026-04-18',
        dateLivraison: '2026-04-21',
        articles: 25,
        adresseLivraison: 'Douala, Cameroon'
      },
      {
        id: 1003,
        numeroCommande: 'CMD-2026-003',
        client: 'Marché Central',
        montant: 320000,
        statut: 'Nouvelle',
        dateCommande: '2026-04-20',
        articles: 8,
        adresseLivraison: 'Yaounde, Cameroon'
      },
      {
        id: 1004,
        numeroCommande: 'CMD-2026-004',
        client: 'Familles Kondo',
        montant: 125000,
        statut: 'Expédiée',
        dateCommande: '2026-04-17',
        dateLivraison: '2026-04-20',
        articles: 5,
        adresseLivraison: 'Bamenda, Cameroon'
      }
    ];

    const stats: StatistiquesProducteur = {
      totalVentes: 942,
      revenuTotal: 32500000,
      commandesEnCours: 2,
      produitsActifs: 4,
      tauxConversion: 8.2,
      noteMoyenne: 4.65,
      visitesAujourdhui: 312,
      nouvellesCommandes: 5
    };

    this.produitsSubject.next(produits);
    this.commandesSubject.next(commandes);
    this.statistiquesSubject.next(stats);
  }

  // Récupérer tous les produits
  obtenirProduits(): Observable<ProduitProducteur[]> {
    return this.produits$;
  }

  // Récupérer un produit spécifique
  obtenirProduit(id: number): Observable<ProduitProducteur> {
    return new Observable(observer => {
      this.produitsSubject.value.forEach(p => {
        if (p.id === id) {
          observer.next(p);
        }
      });
      observer.complete();
    });
  }

  // Créer un nouveau produit
  creerProduit(produit: ProduitProducteur): Observable<ProduitProducteur> {
    return new Observable(observer => {
      produit.id = Math.max(...this.produitsSubject.value.map(p => p.id)) + 1;
      produit.dateCreation = new Date().toISOString().split('T')[0];
      const produits = [...this.produitsSubject.value, produit];
      this.produitsSubject.next(produits);
      observer.next(produit);
      observer.complete();
    });
  }

  // Mettre à jour un produit
  mettreAJourProduit(id: number, produit: Partial<ProduitProducteur>): Observable<ProduitProducteur> {
    return new Observable(observer => {
      const produits = this.produitsSubject.value.map(p => 
        p.id === id ? { ...p, ...produit } : p
      );
      this.produitsSubject.next(produits);
      const updated = produits.find(p => p.id === id)!;
      observer.next(updated);
      observer.complete();
    });
  }

  // Supprimer un produit
  supprimerProduit(id: number): Observable<void> {
    return new Observable(observer => {
      const produits = this.produitsSubject.value.filter(p => p.id !== id);
      this.produitsSubject.next(produits);
      observer.next();
      observer.complete();
    });
  }

  // Récupérer les commandes
  obtenirCommandes(): Observable<CommandeProducteur[]> {
    return this.commandes$;
  }

  // Mettre à jour le statut d'une commande
  mettreAJourStatutCommande(id: number, statut: CommandeProducteur['statut']): Observable<CommandeProducteur> {
    return new Observable(observer => {
      const commandes = this.commandesSubject.value.map(c => 
        c.id === id ? { ...c, statut } : c
      );
      this.commandesSubject.next(commandes);
      const updated = commandes.find(c => c.id === id)!;
      observer.next(updated);
      observer.complete();
    });
  }

  // Récupérer les statistiques
  obtenirStatistiques(): Observable<StatistiquesProducteur | null> {
    return this.statistiques$;
  }

  // Obtenir les analytiques
  obtenirAnalytiques(periode: 'semaine' | 'mois' | 'annee' = 'mois'): Observable<AnalytiquesProducteur> {
    return new Observable(observer => {
      let periodes: string[] = [];
      let ventes: number[] = [];
      let revenus: number[] = [];
      let commandes: number[] = [];

      if (periode === 'semaine') {
        periodes = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        ventes = [120, 145, 98, 167, 189, 156, 98];
        revenus = [4320000, 5220000, 3528000, 6012000, 6804000, 5616000, 3528000];
        commandes = [8, 9, 6, 11, 12, 10, 7];
      } else if (periode === 'mois') {
        periodes = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        ventes = [456, 512, 489, 485];
        revenus = [16416000, 18432000, 17604000, 17448000];
        commandes = [32, 36, 34, 35];
      } else {
        periodes = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
        ventes = [687, 712, 695, 942, 0, 0, 0, 0, 0, 0, 0, 0];
        revenus = [24732000, 25632000, 25020000, 32500000, 0, 0, 0, 0, 0, 0, 0, 0];
        commandes = [47, 49, 48, 65, 0, 0, 0, 0, 0, 0, 0, 0];
      }

      observer.next({ periodes, ventes, revenus, commandes });
      observer.complete();
    });
  }

  // Extraire initiales pour avatar
  extraireInitiales(nom: string): string {
    return nom.split(' ').map(m => m[0]).join('').toUpperCase().slice(0, 2);
  }

  // Formater devise
  formaterDevise(montant: number): string {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(montant);
  }
}
