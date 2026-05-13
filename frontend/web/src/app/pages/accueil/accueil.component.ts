import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProduitService } from '../../services/produit.service';
import { Produit, Categorie } from '../../models/index';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white font-outfit">
      <!-- Hero Banner avec Image Supply Chain & Style Premium -->
      <div class="relative bg-gray-900 text-white py-16 px-4 overflow-hidden shadow-[inset_0_-100px_100px_-50px_rgba(0,0,0,0.8)]">
        <!-- Background Image with Overlay -->
        <div class="absolute inset-0 z-0">
          <img src="assets/images/agrima_hero.png" class="w-full h-full object-cover opacity-60 scale-105" alt="Agrima Supply Chain">
          <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
        
        <div class="container mx-auto relative z-10">
          <div class="max-w-2xl py-6">
            <span class="inline-block px-4 py-1.5 bg-[#008a5d] text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg">Du champ à votre assiette</span>
            <h1 class="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight drop-shadow-2xl">
              Bienvenue sur <span class="text-white">AGRIMA</span>
            </h1>
            <p class="text-base text-white/90 mb-8 font-medium max-w-lg leading-relaxed drop-shadow-lg">
              Commandez vos produits agricoles locaux en un clic. Nous connectons les meilleurs producteurs du Cameroun à votre table.
            </p>
            <div class="flex flex-wrap gap-4">
              <button [routerLink]="['/catalogue']" class="bg-white text-gray-900 px-10 py-3.5 rounded-2xl font-black text-xs shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 uppercase tracking-widest">
                <img src="assets/icones/panier.webp" class="w-5 h-5" alt="">
                Découvrir le marché
              </button>
              <button class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-3.5 rounded-2xl font-black text-xs hover:bg-white/20 transition-all uppercase tracking-widest">
                Comment ça marche ?
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Shop par catégories -->
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-black text-gray-900 tracking-tight">Catégories</h2>
          <a [routerLink]="['/catalogue']" class="text-xs font-bold text-alibaba-red hover:underline">Voir tout</a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div *ngFor="let cat of categories" 
               [routerLink]="['/catalogue']" [queryParams]="{type: cat.nom}"
               class="bg-gray-50 p-3 rounded-2xl flex items-center gap-3 hover:bg-white hover:shadow-lg cursor-pointer transition-all border border-transparent hover:border-gray-100">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-2">
               <img [src]="getIconeForCategorie(cat.nom)" class="w-full h-full object-contain" [alt]="cat.nom">
            </div>
            <h3 class="font-bold text-gray-900 text-xs truncate">{{cat.nom}}</h3>
          </div>
        </div>
      </div>

      <!-- Produits en promotion (Style Catalogue) -->
      <div class="bg-gray-50 py-20">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-10">
            <h2 class="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <img src="assets/icones/cadeau.webp" class="w-8 h-8" alt="">
              Produits en Réduction
            </h2>
            <a [routerLink]="['/catalogue']" class="text-alibaba-red font-black hover:underline flex items-center gap-2">Voir tous <span class="text-xl">→</span></a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div *ngFor="let produit of produitsEnReduction" 
                 class="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
              <div class="relative h-44 overflow-hidden">
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
                     <img src="assets/icones/note.webp" class="w-3 h-3" alt="">
                     <span class="text-xs font-bold text-gray-700">{{produit.note}}</span>
                  </div>
                </div>
                <h4 class="font-bold text-gray-900 mb-2 group-hover:text-alibaba-red transition-colors truncate text-sm">{{produit.nom}}</h4>
                <p class="text-gray-500 text-[10px] mb-4 line-clamp-2 leading-relaxed flex-grow">{{produit.description}}</p>
                
                <div class="flex items-end justify-between mb-4">
                  <div class="flex flex-col">
                    <span *ngIf="produit.prixOriginal" class="text-gray-400 line-through text-[9px] font-bold">{{produit.prixOriginal | number}} FCFA</span>
                    <span class="text-base font-black text-gray-900 leading-none">{{produit.prix | number}} <span class="text-[9px]">FCFA</span></span>
                  </div>
                  <span class="text-[9px] font-bold text-gray-400">{{produit.unite}}</span>
                </div>

                <button [routerLink]="['/produit', produit.id]" 
                        class="w-full bg-gray-900 text-white py-3 rounded-2xl font-black text-[10px] hover:bg-alibaba-red transition-all transform active:scale-95 shadow-xl">
                  Détails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Produits populaires (Style Catalogue) -->
      <div class="container mx-auto px-4 py-20">
        <div class="flex justify-between items-center mb-10">
          <h2 class="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <img src="assets/icones/note.webp" class="w-8 h-8" alt="">
            Produits Populaires
          </h2>
          <a [routerLink]="['/catalogue']" class="text-alibaba-red font-black hover:underline flex items-center gap-2">Voir tous <span class="text-xl">→</span></a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div *ngFor="let produit of produitsPopulaires" 
               class="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
            <div class="relative h-44 overflow-hidden">
              <img [src]="produit.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              <div class="absolute top-3 left-3" *ngIf="produit.estBio">
                <span class="bg-[#008a5d] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">BIO</span>
              </div>
            </div>
            <div class="p-5 flex flex-col flex-grow">
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black text-[#008a5d] uppercase tracking-tighter">{{produit.categorie}}</span>
                <span class="text-[9px] font-bold text-gray-400 flex items-center gap-1">
                   <img src="assets/icones/default_user.webp" class="w-3 h-3" alt=""> {{produit.vendeur}}
                </span>
              </div>
              <h4 class="font-bold text-gray-900 mb-2 group-hover:text-alibaba-red transition-colors truncate text-sm">{{produit.nom}}</h4>
              <p class="text-gray-500 text-[10px] mb-4 flex items-center gap-2">
                 <img src="assets/icones/all_product.webp" class="w-3.5 h-3.5 opacity-40" alt="">
                 {{produit.unite}}
              </p>
              
              <div class="mt-auto flex items-end justify-between mb-4">
                <span class="text-base font-black text-alibaba-red leading-none">{{produit.prix | number}} <span class="text-[9px]">FCFA</span></span>
                <div class="flex items-center gap-1">
                   <img src="assets/icones/note.webp" class="w-4 h-4" alt="">
                   <span class="text-xs font-black text-gray-900">{{produit.note}}</span>
                </div>
              </div>

              <button [routerLink]="['/produit', produit.id]" 
                      class="w-full bg-gray-900 text-white py-3 rounded-2xl font-black text-[10px] hover:bg-alibaba-red transition-all transform active:scale-95 shadow-xl">
                Détails
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    .font-outfit { font-family: 'Outfit', sans-serif; }
  `]
})
export class AccueilComponent implements OnInit {
  categories: Categorie[] = [];
  produitsPopulaires: Produit[] = [];
  produitsEnReduction: Produit[] = [];

  constructor(private produitService: ProduitService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.produitService.obtenirCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.produitService.obtenirProduitsPopulaires().subscribe(produits => {
      this.produitsPopulaires = produits;
    });

    this.produitService.obtenirProduitsEnReduction().subscribe(produits => {
      this.produitsEnReduction = produits;
    });
  }

  getIconeForCategorie(nom: string): string {
    const map: { [key: string]: string } = {
      'Fruits': 'assets/icones/fruit_et_legume.webp',
      'Légumes': 'assets/icones/fruit_et_legume.webp',
      'Produits Laitiers': 'assets/icones/lait.webp',
      'Céréales': 'assets/icones/produit_sec.webp',
      'Bio': 'assets/icones/produit_bio.webp'
    };
    return map[nom] || 'assets/icones/all_product.webp';
  }
}
