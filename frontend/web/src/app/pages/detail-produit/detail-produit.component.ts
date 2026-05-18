import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { PanierService } from '../../services/panier.service';
import { FavorisService } from '../../services/favoris.service';
import { Produit, Avis } from '../../models/index';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen" *ngIf="produit">
      <div class="container mx-auto px-4 py-8">
        <nav class="text-sm text-gray-600 mb-8">
          <a href="#" class="hover:text-alibaba-red">Accueil</a> /
          <a href="#" class="hover:text-alibaba-red"> {{produit.categorie}}</a> /
          <span> {{produit.nom}}</span>
        </nav>

        <div class="grid grid-cols-2 gap-8 mb-8">
          <!-- Images -->
          <div>
            <div class="bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img [src]="produit.image" class="w-full h-96 object-cover">
            </div>
            <div class="grid grid-cols-4 gap-2">
              <img *ngFor="let img of produit.images || [produit.image]" [src]="img" 
                   class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75">
            </div>
          </div>

          <!-- Détails -->
          <div>
            <div class="mb-4">
              <div class="flex items-center gap-4 mb-4">
                <h1 class="text-3xl font-bold">{{produit.nom}}</h1>
                <span *ngIf="produit.estBio" class="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold"><img width="24" height="24" src="assets/icones/produit bio.webp" alt="bio" class="inline-block align-middle mr-1"/> BIO</span>
              </div>

              <div class="flex items-center gap-4 mb-4">
                <div class="flex items-center">
                  <span class="text-yellow-500 text-lg"><img src="assets/icones/note.webp" class="inline-block w-4 h-4 ml-1" /> {{produit.note}}/5</span>
                  <span class="text-gray-600 ml-2">({{produit.nombreAvis}} avis)</span>
                </div>
              </div>

              <p class="text-gray-600 mb-4">{{produit.description}}</p>
            </div>

            <!-- Prix -->
            <div class="bg-gray-100 p-6 rounded-lg mb-6">
              <div class="flex items-baseline gap-4 mb-2">
                <span class="text-4xl font-bold text-alibaba-red">{{produit.prix | number}} FCFA</span>
                <span *ngIf="produit.prixOriginal" class="text-gray-400 line-through text-xl">{{produit.prixOriginal | number}} FCFA</span>
                <span *ngIf="produit.reduction" class="bg-alibaba-red text-white px-3 py-1 rounded font-bold">-{{produit.reduction}}%</span>
              </div>
              <p class="text-sm text-green-600"><img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/> Frais de livraison gratuits</p>
            </div>

            <!-- Stock -->
            <div class="mb-6">
              <p class="mb-2">Stock disponible: <strong>{{produit.stock}}</strong> {{produit.unite}}</p>
              <div class="flex items-center gap-4">
                <div class="flex items-center border rounded">
                  <button (click)="diminuerQuantite()" class="px-3 py-2 text-alibaba-red">-</button>
                  <input type="number" [(ngModel)]="quantite" class="w-16 text-center border-0">
                  <button (click)="augmenterQuantite()" class="px-3 py-2 text-alibaba-red">+</button>
                </div>
                <span class="text-sm text-gray-600">{{produit.unite}}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 mb-6">
              <button (click)="ajouterAuPanier()" class="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold text-xs hover:bg-[#008a5d] transition-all transform active:scale-95 shadow-lg">
                <img width="24" height="24" src="assets/icones/panier.webp" alt="panier" class="inline-block align-middle mr-1"/> Ajouter au panier
              </button>
              <button (click)="basculerFavori()" class="flex-1 border-2 py-3 rounded font-bold hover:bg-red-50"
                      [ngClass]="estEnFavoris ? 'border-red-500 text-red-500 bg-red-50' : 'border-alibaba-red text-alibaba-red'">
                <img width="24" height="24" src="assets/icones/favoris.webp" alt="coeur" class="inline-block align-middle mr-1"/>
                {{ estEnFavoris ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
              </button>
            </div>

            <!-- Infos vendeur -->
            <div class="border rounded-lg p-4 mb-6">
              <h3 class="font-bold mb-3"><img width="24" height="24" src="assets/icones/icons8-utilisateur-100.webp" alt="utilisateur" class="inline-block align-middle mr-1"/> Infos Vendeur</h3>
              <p class="font-bold mb-1">{{produit.vendeur}}</p>
              <div class="flex gap-4 text-sm text-gray-600">
                <span><img src="assets/icones/note.webp" class="inline-block w-4 h-4 ml-1" /> 4.8/5</span>
                <span><img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/> Livraison 24h</span>
                <span><img width="24" height="24" src="assets/icones/protect.webp" alt="lock" class="inline-block align-middle mr-1"/> Sécurisé</span>
              </div>
              <button class="w-full mt-3 border border-alibaba-red text-alibaba-red py-2 rounded hover:bg-red-50">
                Voir autres produits du vendeur
              </button>
            </div>

            <!-- Infos produit -->
            <div class="border rounded-lg p-4">
              <h3 class="font-bold mb-3"><img width="24" height="24" src="assets/icones/icons8-documents-100.webp" alt="clipboard" class="inline-block align-middle mr-1"/> Infos produit</h3>
              <ul class="space-y-2 text-sm">
                <li><strong>Catégorie:</strong> {{produit.categorie}}</li>
                <li><strong>Unité:</strong> {{produit.unite}}</li>
                <li *ngIf="produit.dateRecolte"><strong>Date de récolte:</strong> {{produit.dateRecolte | date}}</li>
                <li><strong>Réduction:</strong> {{produit.reduction || 'Aucune'}}%</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Section Avis -->
        <div class="border-t pt-8">
          <h2 class="text-2xl font-bold mb-6">Avis Clients ({{avisClients.length}})</h2>

          <div class="grid grid-cols-3 gap-8">
            <!-- Résumé avis -->
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="text-4xl font-bold text-alibaba-red mb-2">{{produit.note}}/5</p>
              <div class="flex text-yellow-500 mb-4">
                <span *ngFor="let i of [1,2,3,4,5]" [ngClass]="{'opacity-30': i > produit.note}"><img src="assets/icones/note.webp" class="inline-block w-4 h-4 ml-1" /></span>
              </div>
              <p class="text-gray-600 mb-4">Basé sur {{produit.nombreAvis}} avis</p>
              <button class="w-full border-2 border-alibaba-red text-alibaba-red py-2 rounded font-bold hover:bg-red-50">
                <img width="24" height="24" src="assets/icones/icons8-print-100.webp" alt="edit" class="inline-block align-middle mr-1"/> Donner votre avis
              </button>
            </div>

            <!-- Avis -->
            <div class="col-span-2 space-y-4">
              <div *ngFor="let avis of avisClients" class="border rounded-lg p-4">
                <div class="flex justify-between mb-2">
                  <strong>{{avis.auteur}}</strong>
                  <span class="text-sm text-gray-600">{{avis.date | date}}</span>
                </div>
                <div class="text-yellow-500 mb-2">
                  <span *ngFor="let i of [1,2,3,4,5]" [ngClass]="{'opacity-30': i > avis.note}"><img src="assets/icones/note.webp" class="inline-block w-4 h-4 ml-1" /></span>
                </div>
                <p class="text-gray-700">{{avis.commentaire}}</p>
                <div *ngIf="avis.verifieAchat" class="mt-2 text-xs text-gray-600"><img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/> Achat vérifié</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!produit" class="container mx-auto px-4 py-8 text-center">
      <p class="text-gray-600 text-lg">Produit non trouvé</p>
    </div>
  `,
  styles: []
})
export class DetailProduitComponent implements OnInit {
  produit: Produit | undefined;
  quantite = 1;
  estEnFavoris = false;
  avisClients: Avis[] = [
    {
      id: 1,
      note: 5,
      commentaire: 'Excellent produit, très frais et délicieux!',
      auteur: 'Ahmed M.',
      date: new Date('2026-04-10'),
      verifieAchat: true
    },
    {
      id: 2,
      note: 4,
      commentaire: 'Bon produit, livraison rapide',
      auteur: 'Fatima K.',
      date: new Date('2026-04-08'),
      verifieAchat: true
    }
  ];

  constructor(
    private produitService: ProduitService,
    private panierService: PanierService,
    private favorisService: FavorisService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.produitService.obtenirProduitParId(id).subscribe(produit => {
        this.produit = produit;
        if (produit) {
          this.estEnFavoris = this.favorisService.estEnFavoris(produit.id);
        }
      });
    });
  }

  augmenterQuantite(): void {
    if (this.produit && this.quantite < this.produit.stock) {
      this.quantite++;
    }
  }

  diminuerQuantite(): void {
    if (this.quantite > 1) {
      this.quantite--;
    }
  }

  ajouterAuPanier(): void {
    if (this.produit) {
      this.panierService.ajouterArticle({
        id: this.produit.id,
        produitId: this.produit.id,
        nom: this.produit.nom,
        prix: this.produit.prix,
        quantite: this.quantite,
        image: this.produit.image
      });
      alert('<img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/> Produit ajouté au panier!');
      this.quantite = 1;
    }
  }

  basculerFavori(): void {
    if (this.produit) {
      if (this.estEnFavoris) {
        this.favorisService.retirerDesFavoris(this.produit.id);
        this.estEnFavoris = false;
        alert('Produit retiré des favoris');
      } else {
        this.favorisService.ajouterAuxFavoris({
          id: this.produit.id,
          nom: this.produit.nom,
          prix: this.produit.prix,
          image: this.produit.image,
          vendeur: this.produit.vendeur,
          categorie: this.produit.categorie
        });
        this.estEnFavoris = true;
        alert('<img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/> Produit ajouté aux favoris!');
      }
    }
  }
}
