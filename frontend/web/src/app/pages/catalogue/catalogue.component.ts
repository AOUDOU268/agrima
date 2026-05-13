import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { Produit, Categorie } from '../../models/index';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="container mx-auto px-4 py-auto">
        <h1 class="text-3xl font-bold mb-8">Catalogue des Produits</h1>

        <div class="grid grid-cols-12 gap-8">
          <!-- Sidebar Filtres -->
          <div class="col-span-2">
            <div class="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-32 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <h3 class="font-black text-lg mb-6 flex items-center gap-2">
                <img src="assets/icones/chercher.webp" class="w-5 h-5" alt="filter">
                Filtres
              </h3>

              <!-- Recherche -->
              <div class="mb-6">
                <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Rechercher</label>
                <input 
                  type="text" 
                  [(ngModel)]="rechercheTerm"
                  placeholder="Un produit..."
                  (keyup)="appliquerFiltres()"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#008a5d] focus:outline-none transition-all font-medium text-xs">
              </div>

              <!-- Catégories -->
              <div class="mb-6">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Catégories</h4>
                <div class="space-y-2">
                  <label *ngFor="let cat of categories" class="flex items-center group cursor-pointer">
                    <input type="checkbox" 
                           [checked]="categoriesSelectionnees.includes(cat.nom)" 
                           (change)="toggleCategorie(cat.nom)"
                           class="w-4 h-4 rounded border-gray-300 text-[#008a5d] focus:ring-[#008a5d]">
                    <span class="ml-3 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{{cat.nom}}</span>
                  </label>
                </div>
              </div>

              <!-- Prix -->
              <div class="mb-6">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Prix (FCFA)</h4>
                <div class="space-y-2">
                  <label class="flex items-center group cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#008a5d] focus:ring-[#008a5d]">
                    <span class="ml-3 text-xs font-medium text-gray-600 group-hover:text-gray-900">0 - 50</span>
                  </label>
                  <label class="flex items-center group cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#008a5d] focus:ring-[#008a5d]">
                    <span class="ml-3 text-xs font-medium text-gray-600 group-hover:text-gray-900">50 - 200</span>
                  </label>
                  <label class="flex items-center group cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#008a5d] focus:ring-[#008a5d]">
                    <span class="ml-3 text-xs font-medium text-gray-600 group-hover:text-gray-900">200+</span>
                  </label>
                </div>
              </div>

              <!-- Filtres Spéciaux -->
              <div class="mb-6">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Spécial</h4>
                <div class="space-y-2">
                  <label class="flex items-center group cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#008a5d] focus:ring-[#008a5d]">
                    <span class="ml-3 text-xs font-medium text-gray-600 group-hover:text-gray-900 flex items-center gap-2">
                      <img src="assets/icones/produit_bio.webp" class="w-4 h-4" alt="bio"> Produits Bio
                    </span>
                  </label>
                  <label class="flex items-center group cursor-pointer">
                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#008a5d] focus:ring-[#008a5d]">
                    <span class="ml-3 text-xs font-medium text-gray-600 group-hover:text-gray-900 flex items-center gap-2">
                      <img src="assets/icones/de_saison.webp" class="w-4 h-4" alt="season"> De Saison
                    </span>
                  </label>
                </div>
              </div>

              <!-- Note -->
              <div class="mb-8">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Note minimale</h4>
                <div class="space-y-3">
                  <label class="flex items-center group cursor-pointer">
                    <input type="radio" value="all" name="note" (change)="appliquerFiltres()" class="w-4 h-4 text-[#008a5d] focus:ring-[#008a5d]">
                    <span class="ml-3 text-xs font-medium text-gray-600">Tous</span>
                  </label>
                  <label class="flex items-center group cursor-pointer">
                    <input type="radio" value="4" name="note" (change)="appliquerFiltres()" class="w-4 h-4 text-[#008a5d] focus:ring-[#008a5d]">
                    <div class="ml-3 flex items-center gap-0.5">
                      <img src="assets/icones/note.webp" class="w-3 h-3" *ngFor="let i of [1,2,3,4]">
                      <span class="ml-1 text-[10px] font-bold text-gray-400">& plus</span>
                    </div>
                  </label>
                </div>
              </div>

              <button (click)="reinitialiserFiltres()" class="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                Réinitialiser
              </button>
            </div>
          </div>

          <!-- Grille de produits -->
          <div class="col-span-10">
            <!-- Tri et Header -->
            <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p class="text-gray-500 font-medium">
                <span class="text-[#008a5d] font-black">{{produitsFiltres.length}}</span> produits trouvés
              </p>
              <div class="flex items-center gap-4">
                <span class="text-xs font-black uppercase tracking-widest text-gray-400">Trier par</span>
                <select [(ngModel)]="triActuel" (change)="trierProduits()" class="px-4 py-2 bg-gray-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#008a5d] outline-none">
                  <option value="pertinence">Pertinence</option>
                  <option value="prixAsc">Prix croissant</option>
                  <option value="prixDesc">Prix décroissant</option>
                  <option value="note">Note (meilleures)</option>
                  <option value="recent">Plus récent</option>
                </select>
              </div>
            </div>

            <!-- Grille -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div *ngFor="let produit of produitsFiltres" 
                   class="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
                <div class="relative h-48 overflow-hidden">
                  <img [src]="produit.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div class="absolute top-3 left-3 flex flex-col gap-2">
                    <span *ngIf="produit.reduction" class="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      -{{produit.reduction}}%
                    </span>
                    <span *ngIf="produit.estBio" class="bg-[#008a5d] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      BIO
                    </span>
                  </div>
                </div>
                
                <div class="p-5 flex flex-col flex-grow">
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-black text-[#008a5d] uppercase tracking-tighter">{{produit.categorie}}</span>
                    <div class="flex items-center gap-1">
                       <img src="assets/icones/note.webp" class="w-3 h-3" alt="rating" />
                       <span class="text-xs font-bold text-gray-600">{{produit.note}}</span>
                    </div>
                  </div>
                  
                  <h4 class="font-bold text-gray-900 mb-2 group-hover:text-[#008a5d] transition-colors line-clamp-1">{{produit.nom}}</h4>
                  <p class="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-grow">{{produit.description}}</p>
                  
                  <div class="flex items-end justify-between mb-4">
                    <div class="flex flex-col">
                      <span *ngIf="produit.prixOriginal" class="text-gray-400 line-through text-[10px] font-bold">{{produit.prixOriginal | number}} FCFA</span>
                      <span class="text-lg font-black text-gray-900 leading-none">{{produit.prix | number}} <span class="text-[10px]">FCFA</span></span>
                    </div>
                    <span class="text-[10px] font-bold text-gray-400">{{produit.unite}}</span>
                  </div>

                  <button [routerLink]="['/produit', produit.id]" 
                          class="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold text-xs hover:bg-[#008a5d] transition-all transform active:scale-95 shadow-lg">
                    Voir les détails
                  </button>
                </div>
              </div>
            </div>

            <!-- Message vide -->
            <div *ngIf="produitsFiltres.length === 0" class="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <img src="assets/icones/chercher.webp" class="w-16 h-16 mx-auto mb-4 opacity-20" alt="empty">
              <p class="text-gray-500 text-lg font-bold">Aucun produit ne correspond à vos critères</p>
              <button (click)="reinitialiserFiltres()" class="mt-4 text-[#008a5d] font-bold hover:underline">Réinitialiser les filtres</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CatalogueComponent implements OnInit {
  produits: Produit[] = [];
  produitsFiltres: Produit[] = [];
  categories: Categorie[] = [];

  rechercheTerm = '';
  categoriesSelectionnees: string[] = [];
  triActuel = 'pertinence';

  constructor(
    private produitService: ProduitService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.produitService.obtenirTousProduits().subscribe(produits => {
      this.produits = produits;
      this.produitsFiltres = produits;
    });

    this.produitService.obtenirCategories().subscribe(cats => {
      this.categories = cats;
    });

    // Vérifier les paramètres de recherche et de type depuis l'URL
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.rechercheTerm = params['q'];
      } else {
        this.rechercheTerm = '';
      }

      if (params['type']) {
        this.categoriesSelectionnees = [params['type']];
      } else {
        this.categoriesSelectionnees = [];
      }

      this.appliquerFiltres();
    });
  }

  appliquerFiltres(): void {
    let resultats = [...this.produits];

    // Recherche
    if (this.rechercheTerm) {
      resultats = resultats.filter(p =>
        p.nom.toLowerCase().includes(this.rechercheTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.rechercheTerm.toLowerCase())
      );
    }

    // Catégories
    if (this.categoriesSelectionnees.length > 0) {
      resultats = resultats.filter(p => this.categoriesSelectionnees.includes(p.categorie));
    }

    this.produitsFiltres = resultats;
    this.trierProduits();
  }

  trierProduits(): void {
    switch (this.triActuel) {
      case 'prixAsc':
        this.produitsFiltres.sort((a, b) => a.prix - b.prix);
        break;
      case 'prixDesc':
        this.produitsFiltres.sort((a, b) => b.prix - a.prix);
        break;
      case 'note':
        this.produitsFiltres.sort((a, b) => b.note - a.note);
        break;
      default:
        break;
    }
  }

  toggleCategorie(nom: string): void {
    const index = this.categoriesSelectionnees.indexOf(nom);
    if (index > -1) {
      this.categoriesSelectionnees.splice(index, 1);
    } else {
      this.categoriesSelectionnees.push(nom);
    }
    this.appliquerFiltres();
  }

  reinitialiserFiltres(): void {
    this.rechercheTerm = '';
    this.categoriesSelectionnees = [];
    this.triActuel = 'pertinence';
    this.produitsFiltres = [...this.produits];
  }
}
