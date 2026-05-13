import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Commande } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8084/api/orders';
  private readonly STORAGE_KEY = 'agrima_commandes';
  
  private commandesSubject = new BehaviorSubject<Commande[]>([]);
  public commandes$ = this.commandesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.chargerCommandesLocales();
  }

  private chargerCommandesLocales(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Re-convertir les dates string en objets Date
        const orders = data.map((c: any) => ({
          ...c,
          dateCommande: new Date(c.dateCommande)
        }));
        this.commandesSubject.next(orders);
      } catch (e) {
        this.initDefaultOrders();
      }
    } else {
      this.initDefaultOrders();
    }
  }

  private initDefaultOrders(): void {
    const defaultOrders: Commande[] = [
      {
        id: 1,
        numero: 'AGR-2024-001',
        dateCommande: new Date('2024-05-01T10:30:00'),
        statut: 'Livrée',
        montantTotal: 15500,
        fraisLivraison: 500,
        adresseLivraison: 'Douala, Akwa, Rue Pau',
        modeLivraison: 'Standard',
        clientId: 1,
        producteurId: 10,
        articles: [
          { id: 101, produitId: 1, nom: 'Tomates Bio', prix: 1200, quantite: 5, image: 'assets/images/produits/tomate.webp' },
          { id: 102, produitId: 2, nom: 'Carottes du Nord', prix: 800, quantite: 3, image: 'assets/images/produits/carotte.webp' }
        ]
      },
      {
        id: 2,
        numero: 'AGR-2024-045',
        dateCommande: new Date(),
        statut: 'En attente',
        montantTotal: 8500,
        fraisLivraison: 500,
        adresseLivraison: 'Douala, Akwa, Rue Pau',
        modeLivraison: 'Rapide',
        clientId: 1,
        producteurId: 12,
        articles: [
          { id: 103, produitId: 5, nom: 'Bananes Douces', prix: 2500, quantite: 2, image: 'assets/images/produits/banane.webp' }
        ]
      }
    ];
    this.sauvegarderCommandes(defaultOrders);
  }

  private sauvegarderCommandes(commandes: Commande[]): void {
    this.commandesSubject.next(commandes);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(commandes));
  }

  ajouterCommande(commande: Commande): void {
    const current = this.commandesSubject.value;
    const updated = [commande, ...current];
    this.sauvegarderCommandes(updated);
  }

  obtenirMesCommandes(): Observable<Commande[]> {
    return this.commandes$;
  }

  getCommandes(): Observable<Commande[]> {
    return this.obtenirMesCommandes();
  }

  // Méthode pour créer une commande (Locale + API)
  creerCommande(commande: Commande): Observable<Commande> {
    this.ajouterCommande(commande);
    return of(commande);
  }

  creerCommandeAPI(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande);
  }

  suivreCommande(numero: string): Observable<Commande | undefined> {
    const cmd = this.commandesSubject.value.find(c => c.numero === numero);
    return of(cmd);
  }
}
