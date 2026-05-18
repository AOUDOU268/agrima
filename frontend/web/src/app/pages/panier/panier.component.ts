import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PanierService } from '../../services/panier.service';
import { Article } from '../../models/index';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8"><img width="24" height="24" src="assets/icones/panier.webp" alt="panier" class="inline-block align-middle mr-1"/> Mon Panier</h1>

        <div class="grid grid-cols-3 gap-8">
          <!-- Articles -->
          <div class="col-span-2">
            <div *ngIf="articles.length === 0" class="bg-gray-50 rounded-lg p-8 text-center">
              <p class="text-gray-600 text-lg mb-4">Votre panier est vide</p>
              <a [routerLink]="['/catalogue']" class="text-alibaba-red font-bold hover:underline">
                Continuer vos achats →
              </a>
            </div>

            <div *ngIf="articles.length > 0" class="space-y-4">
              <div *ngFor="let article of articles" class="border rounded-lg p-4 flex gap-4">
                <!-- Image -->
                <img [src]="article.image" class="w-24 h-24 object-cover rounded">

                <!-- Info produit -->
                <div class="flex-1">
                  <h3 class="font-bold mb-2">{{article.nom}}</h3>
                  <p class="text-gray-600 text-sm mb-2">Prix: {{article.prix | number}} FCFA</p>
                  <div class="flex items-center gap-2">
                    <button (click)="diminuerQuantite(article.produitId)" class="text-alibaba-red">-</button>
                    <input type="number" [(ngModel)]="article.quantite" 
                           (change)="mettreAJourQuantite(article.produitId, article.quantite)"
                           class="w-12 text-center border rounded">
                    <button (click)="augmenterQuantite(article.produitId)" class="text-alibaba-red">+</button>
                  </div>
                </div>

                <!-- Sous-total -->
                <div class="text-right">
                  <p class="font-bold text-lg text-alibaba-red">{{(article.prix * article.quantite) | number}} FCFA</p>
                  <button (click)="supprimerArticle(article.produitId)" class="text-red-600 text-sm hover:underline mt-2">
                    Supprimer
                  </button>
                </div>
              </div>

              <!-- Actions panier -->
              <div class="flex gap-4 mt-6">
                <button [routerLink]="['/catalogue']" class="text-alibaba-red font-bold hover:underline">
                  ← Continuer les achats
                </button>
                <button (click)="viderPanier()" class="text-red-600 font-bold hover:underline ml-auto">
                  Vider le panier
                </button>
              </div>
            </div>
          </div>

          <!-- Résumé commande -->
          <div *ngIf="articles.length > 0" class="bg-gray-50 rounded-lg p-6 h-fit sticky top-32">
            <h3 class="text-xl font-bold mb-6">Résumé Commande</h3>

            <div class="space-y-4 mb-6 pb-6 border-b">
              <div class="flex justify-between">
                <span>Sous-total</span>
                <span>{{sousTotal | number}} FCFA</span>
              </div>
              <div class="flex justify-between">
                <span>Frais de livraison</span>
                <span class="text-green-600">Gratuit</span>
              </div>
              <div class="flex justify-between">
                <span>Taxes (TVA 20%)</span>
                <span>{{taxes | number}} FCFA</span>
              </div>
            </div>

            <div class="flex justify-between mb-6 text-lg font-bold">
              <span>Total</span>
              <span class="text-alibaba-red">{{total | number}} FCFA</span>
            </div>

            <!-- Promocode -->
            <div class="mb-6">
              <label class="block text-sm font-bold mb-2">Code Promo</label>
              <div class="flex gap-2">
                <input type="text" placeholder="Entrez votre code" class="flex-1 px-3 py-2 border rounded">
                <button class="bg-gray-400 text-white px-4 py-2 rounded">OK</button>
              </div>
            </div>

            <!-- Boutons -->
            <button [routerLink]="['/commande']" 
                    [queryParams]="{ panier: true }"
                    class="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold hover:bg-[#008a5d] transition-all transform active:scale-95 shadow-lg">
              Passer la commande
            </button>
            <button class="w-full border-2 border-red text-red py-2 mt-3 rounded-2xl font-bold hover:bg-red-50">
              ← Continuer vos achats
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PanierComponent implements OnInit {
  articles: Article[] = [];
  sousTotal = 0;
  taxes = 0;
  total = 0;

  constructor(private panierService: PanierService) { }

  ngOnInit(): void {
    this.panierService.articles$.subscribe(articles => {
      this.articles = articles;
      this.calculerTotaux();
    });
  }

  calculerTotaux(): void {
    this.sousTotal = this.panierService.obtenirTotal();
    this.taxes = this.sousTotal * 0.2;
    this.total = this.sousTotal + this.taxes;
  }

  augmenterQuantite(produitId: number): void {
    const article = this.articles.find(a => a.produitId === produitId);
    if (article) {
      this.panierService.mettreAJourQuantite(produitId, article.quantite + 1);
    }
  }

  diminuerQuantite(produitId: number): void {
    const article = this.articles.find(a => a.produitId === produitId);
    if (article && article.quantite > 1) {
      this.panierService.mettreAJourQuantite(produitId, article.quantite - 1);
    }
  }

  mettreAJourQuantite(produitId: number, quantite: number): void {
    if (quantite > 0) {
      this.panierService.mettreAJourQuantite(produitId, quantite);
    }
  }

  supprimerArticle(produitId: number): void {
    this.panierService.supprimerArticle(produitId);
  }

  viderPanier(): void {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier?')) {
      this.panierService.viderPanier();
    }
  }
}
