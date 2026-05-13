import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface ProduitFavori {
  id: number;
  nom: string;
  prix: number;
  image: string;
  vendeur: string;
  categorie: string;
  dateAjout: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FavorisService {
  private readonly STORAGE_KEY = 'agrima_favoris';
  private favorisSubject = new BehaviorSubject<ProduitFavori[]>([]);
  public favoris$ = this.favorisSubject.asObservable();

  constructor() {
    this.chargerFavoris();
  }

  private chargerFavoris(): void {
    const favorisJson = localStorage.getItem(this.STORAGE_KEY);
    if (favorisJson) {
      try {
        const favoris = JSON.parse(favorisJson);
        // Convertir les dates string en objets Date
        const favorisAvecDates = favoris.map((fav: any) => ({
          ...fav,
          dateAjout: new Date(fav.dateAjout)
        }));
        this.favorisSubject.next(favorisAvecDates);
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        this.favorisSubject.next([]);
      }
    }
  }

  private sauvegarderFavoris(favoris: ProduitFavori[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favoris));
  }

  ajouterAuxFavoris(produit: Omit<ProduitFavori, 'dateAjout'>): void {
    const favorisActuels = this.favorisSubject.value;
    const existeDeja = favorisActuels.some(fav => fav.id === produit.id);

    if (!existeDeja) {
      const nouveauFavori: ProduitFavori = {
        ...produit,
        dateAjout: new Date()
      };

      const nouveauxFavoris = [...favorisActuels, nouveauFavori];
      this.favorisSubject.next(nouveauxFavoris);
      this.sauvegarderFavoris(nouveauxFavoris);
    }
  }

  retirerDesFavoris(produitId: number): void {
    const favorisActuels = this.favorisSubject.value;
    const nouveauxFavoris = favorisActuels.filter(fav => fav.id !== produitId);
    this.favorisSubject.next(nouveauxFavoris);
    this.sauvegarderFavoris(nouveauxFavoris);
  }

  estEnFavoris(produitId: number): boolean {
    return this.favorisSubject.value.some(fav => fav.id === produitId);
  }

  getFavoris(): ProduitFavori[] {
    return this.favorisSubject.value;
  }

  getNombreFavoris(): Observable<number> {
    return this.favoris$.pipe(
      map(favoris => favoris.length)
    );
  }

  viderFavoris(): void {
    this.favorisSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  basculerFavori(produit: Omit<ProduitFavori, 'dateAjout'>): void {
    if (this.estEnFavoris(produit.id)) {
      this.retirerDesFavoris(produit.id);
    } else {
      this.ajouterAuxFavoris(produit);
    }
  }
}