import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Produit, Categorie } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8081/api/products';
  
  // Données fictives pour la démo
  private produitsData: Produit[] = [
    {
      id: 1,
      nom: 'Tomates Bio Premium',
      description: 'Tomates fraîches cultivées biologiquement, récoltées manuellement',
      prix: 45000,
      prixOriginal: 60000,
      reduction: 25,
      categorie: 'Fruits & Légumes',
      image: 'assets/images/produits/tomates.webp',
      vendeur: 'Ferme Verte',
      note: 4.8,
      nombreAvis: 245,
      stock: 150,
      unite: 'kg',
      estBio: true,
      estDeSaison: true,
      dateRecolte: '2026-04-10'
    },
    {
      id: 2,
      nom: 'Oignons Frais',
      description: 'Oignons rouges et blancs frais du marché local',
      prix: 25000,
      categorie: 'Fruits & Légumes',
      image: 'assets/images/produits/oignons.webp',
      vendeur: 'Marché Frais',
      note: 4.5,
      nombreAvis: 128,
      stock: 200,
      unite: 'kg'
    },
    {
      id: 3,
      nom: 'Pommes Gala',
      description: 'Pommes douces et croquantes, délicieuses pour les enfants',
      prix: 55000,
      prixOriginal: 65000,
      reduction: 15,
      categorie: 'Fruits & Légumes',
      image: 'assets/images/produits/pommes.webp',
      vendeur: 'Verger du Soleil',
      note: 4.7,
      nombreAvis: 312,
      stock: 300,
      unite: 'kg'
    },
    {
      id: 4,
      nom: 'Carottes Bio',
      description: 'Carottes biologiques, riches en vitamines',
      prix: 35000,
      categorie: 'Fruits & Légumes',
      image: 'assets/images/produits/carottes.webp',
      vendeur: 'Ferme Bio Côté',
      note: 4.6,
      nombreAvis: 189,
      stock: 250,
      unite: 'kg',
      estBio: true
    }
  ];

  private categoriesData: Categorie[] = [
    { id: 1, nom: 'Fruits & Légumes', description: 'Produits frais', icone: '<img width="24" height="24" src="assets/icones/fruit_et_legume.webp" alt="legume" class="inline-block align-middle mr-1"/>' },
    { id: 2, nom: 'Produits Laitiers', description: 'Lait, fromage, yaourt', icone: '<img width="24" height="24" src="assets/icones/lait.webp" alt="lait" class="inline-block align-middle mr-1"/>' },
    { id: 3, nom: 'Produits Secs', description: 'Riz, pâtes, épices', icone: '<img width="24" height="24" src="assets/icones/produit_sec.webp" alt="produits secs" class="inline-block align-middle mr-1"/>' },
    { id: 4, nom: 'Bio & Écologique', description: 'Produits biologiques et éco-responsables', icone: '<img width="24" height="24" src="assets/icones/produit_bio.webp" alt="bio" class="inline-block align-middle mr-1"/>' }
  ];

  private produitsSubject = new BehaviorSubject<Produit[]>(this.produitsData);
  public produits$ = this.produitsSubject.asObservable();

  constructor(private http: HttpClient) {}

  obtenirTousProduits(): Observable<Produit[]> {
    return this.produits$;
  }

  obtenirProduitParId(id: number): Observable<Produit | undefined> {
    return new Observable(observer => {
      const produit = this.produitsData.find(p => p.id === id);
      observer.next(produit);
      observer.complete();
    });
  }

  rechercherProduits(terme: string): Observable<Produit[]> {
    return new Observable(observer => {
      const resultats = this.produitsData.filter(p => 
        p.nom.toLowerCase().includes(terme.toLowerCase()) ||
        p.description.toLowerCase().includes(terme.toLowerCase())
      );
      observer.next(resultats);
      observer.complete();
    });
  }

  filtrerParCategorie(categorie: string): Observable<Produit[]> {
    return new Observable(observer => {
      const resultats = this.produitsData.filter(p => p.categorie === categorie);
      observer.next(resultats);
      observer.complete();
    });
  }

  obtenirCategories(): Observable<Categorie[]> {
    return new Observable(observer => {
      observer.next(this.categoriesData);
      observer.complete();
    });
  }

  obtenirProduitsPopulaires(): Observable<Produit[]> {
    return new Observable(observer => {
      const populaires = this.produitsData.sort((a, b) => b.nombreAvis - a.nombreAvis).slice(0, 8);
      observer.next(populaires);
      observer.complete();
    });
  }

  obtenirProduitsEnReduction(): Observable<Produit[]> {
    return new Observable(observer => {
      const enReduction = this.produitsData.filter(p => p.reduction && p.reduction > 0);
      observer.next(enReduction);
      observer.complete();
    });
  }
}
