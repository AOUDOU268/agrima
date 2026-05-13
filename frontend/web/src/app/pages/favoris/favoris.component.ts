import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FavorisService, ProduitFavori } from '../../services/favoris.service';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-shell">
      <!-- Header -->
      <div class="page-header">
        <h1>Mes Favoris</h1>
        <p>Découvrez vos produits préférés</p>
      </div>

      <!-- Contenu -->
      <div class="page-container">
        <!-- État vide -->
        <div *ngIf="favoris.length === 0" class="text-center py-16">
          <div class="mb-6">
            <img width="120" height="120" src="assets/icones/favoris.webp" alt="favoris" class="mx-auto opacity-50">
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Aucun favori pour le moment</h3>
          <p class="text-gray-500 mb-6">Parcourez notre catalogue et ajoutez vos produits préférés !</p>
          <a [routerLink]="['/catalogue']" class="btn-action btn-primary">
            Explorer le catalogue
          </a>
        </div>

        <!-- Liste des favoris -->
        <div *ngIf="favoris.length > 0" class="space-y-6">
          <!-- Statistiques -->
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">{{ favoris.length }} produit(s) en favoris</h3>
                <p class="text-sm text-gray-600">Dernière mise à jour: {{ getDerniereMaj() }}</p>
              </div>
              <button (click)="viderFavoris()" class="btn-action btn-ghost text-red-600 hover:text-red-700">
                Vider tous les favoris
              </button>
            </div>
          </div>

          <!-- Liste des produits (Format Liste) -->
          <div class="flex flex-col gap-4">
            <div *ngFor="let produit of favoris" 
                 class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition-all duration-300 group">
              
              <!-- Thumbnail -->
              <div class="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <img [src]="produit.image" [alt]="produit.nom" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              </div>

              <!-- Content Center -->
              <div class="flex-grow text-center md:text-left">
                <div class="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span class="text-[10px] font-black text-[#008a5d] uppercase tracking-widest">{{ produit.categorie }}</span>
                  <span class="text-[10px] text-gray-400">•</span>
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ajouté le {{ produit.dateAjout | date:'dd MMM yyyy' }}</span>
                </div>
                <h3 class="text-lg font-black text-gray-900 mb-1 group-hover:text-alibaba-red transition-colors line-clamp-1">{{ produit.nom }}</h3>
                <p class="text-sm text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                   <img width="14" height="14" src="assets/icones/default_user.webp" alt="vendeur" class="opacity-40">
                   {{ produit.vendeur }}
                </p>
              </div>

              <!-- Price & Actions Right -->
              <div class="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                <span class="text-2xl font-black text-gray-900">{{ produit.prix | number:'1.0-0':'fr' }} <span class="text-xs">FCFA</span></span>
                <div class="flex items-center gap-2">
                  <button (click)="retirerFavori(produit.id)" 
                          class="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Retirer des favoris">
                    <img width="20" height="20" src="assets/icones/favoris.webp" alt="retirer" class="brightness-0 invert-0 group-hover:invert-0">
                  </button>
                  <a [routerLink]="['/produit', produit.id]" 
                     class="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs hover:bg-alibaba-red transition-all shadow-lg uppercase tracking-widest">
                    Détails
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions globales -->
          <div class="section-card">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a [routerLink]="['/catalogue']" class="btn-action btn-primary">
                Continuer mes achats
              </a>
              <a [routerLink]="['/panier']" class="btn-action btn-secondary">
                Voir mon panier
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class FavorisComponent implements OnInit, OnDestroy {
  favoris: ProduitFavori[] = [];
  private destroy$ = new Subject<void>();

  constructor(private favorisService: FavorisService) {}

  ngOnInit(): void {
    this.favorisService.favoris$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favoris => {
        this.favoris = favoris;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  retirerFavori(produitId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer ce produit de vos favoris ?')) {
      this.favorisService.retirerDesFavoris(produitId);
    }
  }

  viderFavoris(): void {
    if (confirm('Êtes-vous sûr de vouloir vider tous vos favoris ? Cette action est irréversible.')) {
      this.favorisService.viderFavoris();
    }
  }

  getDerniereMaj(): string {
    if (this.favoris.length === 0) return '';

    const dates = this.favoris.map(f => f.dateAjout.getTime());
    const derniereDate = new Date(Math.max(...dates));
    return derniereDate.toLocaleDateString('fr-FR');
  }
}