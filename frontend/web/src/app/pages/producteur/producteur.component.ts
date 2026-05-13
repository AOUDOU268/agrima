import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProducteurService, ProduitProducteur, CommandeProducteur, StatistiquesProducteur } from '../../services/producteur.service';

@Component({
  selector: 'app-producteur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-shell">
      <div class="page-container">
        <!-- En-tête -->
        <div class="page-header">
          <h1>Dashboard Producteur</h1>
          <p>Gérez vos produits, commandes et performances</p>
        </div>

        <!-- Onglets de navigation -->
        <div class="tabs-navigation">
          <button
            *ngFor="let tab of tabs"
            (click)="ongletActif = tab.id"
            [class]="'tab-button ' + (ongletActif === tab.id ? 'active' : '')"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Onglet 1: Vue d'ensemble -->
        <div *ngIf="ongletActif === 'overview'" class="space-y-8">
          <!-- Cartes de statistiques -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="stat-card border-l-4 border-emerald-600">
              <p class="stat-label">Total Ventes</p>
              <p class="stat-value text-emerald-700">{{ stats?.totalVentes || 0 }}</p>
              <p class="stat-hint">+12% ce mois</p>
            </div>

            <div class="stat-card border-l-4 border-blue-600">
              <p class="stat-label">Revenus</p>
              <p class="stat-value text-blue-700">{{ producteurService.formaterDevise(stats?.revenuTotal || 0) }}</p>
              <p class="stat-hint">Semaine dernière</p>
            </div>

            <div class="stat-card border-l-4 border-orange-600">
              <p class="stat-label">Commandes En Cours</p>
              <p class="stat-value text-orange-700">{{ stats?.commandesEnCours || 0 }}</p>
              <p class="stat-hint">À traiter</p>
            </div>

            <div class="stat-card border-l-4 border-purple-600">
              <p class="stat-label">Note Moyenne</p>
              <p class="stat-value text-purple-700">{{ stats?.noteMoyenne || 0 }} ⭐</p>
              <p class="stat-hint">Satisfaction client</p>
            </div>
          </div>

          <!-- Produits actifs -->
          <div class="section-card">
            <div class="flex justify-between items-center mb-6">
              <h2>Produits Actifs</h2>
              <button
                (click)="afficherAjoutProduit = true"
                class="btn-action btn-primary"
              >
                + Ajouter Produit
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Produit</th>
                    <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Catégorie</th>
                    <th class="px-6 py-3 text-center text-sm font-semibold text-slate-700">Stock</th>
                    <th class="px-6 py-3 text-center text-sm font-semibold text-slate-700">Ventes</th>
                    <th class="px-6 py-3 text-right text-sm font-semibold text-slate-700">Revenus</th>
                    <th class="px-6 py-3 text-center text-sm font-semibold text-slate-700">Statut</th>
                    <th class="px-6 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr *ngFor="let produit of produits" class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {{ producteurService.extraireInitiales(produit.nom) }}
                        </div>
                        <div>
                          <p class="font-semibold text-slate-900">{{ produit.nom }}</p>
                          <p class="text-sm text-slate-500">{{ produit.prix | currency:'XAF' }}/{{ produit.unite }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-600">{{ produit.categorie }}</td>
                    <td class="px-6 py-4 text-center">
                      <span [class]="'inline-block px-3 py-1 rounded-full text-sm font-semibold ' + (produit.stock > 100 ? 'bg-emerald-100 text-emerald-800' : produit.stock > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')">
                        {{ produit.stock }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center font-semibold text-slate-900">{{ produit.ventes }}</td>
                    <td class="px-6 py-4 text-right font-semibold text-emerald-700">{{ producteurService.formaterDevise(produit.revenus) }}</td>
                    <td class="px-6 py-4 text-center">
                      <span [class]="'inline-block px-3 py-1 rounded-full text-xs font-semibold ' + (produit.statut === 'Actif' ? 'bg-emerald-100 text-emerald-800' : produit.statut === 'Brouillon' ? 'bg-slate-100 text-slate-800' : 'bg-red-100 text-red-800')">
                        {{ produit.statut }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <button
                        (click)="editerProduit(produit)"
                        class="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        ✏️
                      </button>
                      <button
                        (click)="supprimerProduit(produit.id)"
                        class="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Onglet 2: Commandes -->
        <div *ngIf="ongletActif === 'commandes'" class="space-y-8">
          <div class="section-card">
            <h2 class="mb-6">Commandes</h2>

            <div class="space-y-4">
              <div *ngFor="let commande of commandes" class="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="font-bold text-slate-900">{{ commande.numeroCommande }}</p>
                    <p class="text-sm text-slate-600">{{ commande.client }}</p>
                  </div>
                  <select
                    [value]="commande.statut"
                    (change)="mettreAJourCommande(commande.id, $event)"
                    [class]="'form-select text-sm ' + getClasseStatutCommande(commande.statut)"
                  >
                    <option value="Nouvelle">Nouvelle</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="Préparée">Préparée</option>
                    <option value="Expédiée">Expédiée</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-slate-600">Montant</p>
                    <p class="font-bold text-slate-900">{{ producteurService.formaterDevise(commande.montant) }}</p>
                  </div>
                  <div>
                    <p class="text-slate-600">Articles</p>
                    <p class="font-bold text-slate-900">{{ commande.articles }} article(s)</p>
                  </div>
                  <div>
                    <p class="text-slate-600">Date Commande</p>
                    <p class="font-bold text-slate-900">{{ commande.dateCommande }}</p>
                  </div>
                  <div>
                    <p class="text-slate-600">Livraison</p>
                    <p class="font-bold text-slate-900">{{ commande.dateLivraison || '-' }}</p>
                  </div>
                </div>

                <p class="text-sm text-slate-600 mt-3 border-t border-slate-100 pt-3">📍 {{ commande.adresseLivraison }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet 3: Performances -->
        <div *ngIf="ongletActif === 'performances'" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Filtres -->
            <div class="section-card col-span-1 md:col-span-2">
              <h2 class="mb-4">Analytiques</h2>
              <div class="flex gap-4">
                <button
                  *ngFor="let p of periodes"
                  (click)="periodeLiveActive = p.id; chargerAnalytiques(p.id)"
                  [class]="'btn-action ' + (periodeLiveActive === p.id ? 'btn-primary' : 'btn-ghost')"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Graphique Ventes -->
            <div class="section-card">
              <h3 class="mb-4">📊 Ventes</h3>
              <div class="space-y-3">
                <div *ngFor="let i of [0,1,2,3]; let last = last" class="flex items-center gap-2" [ngClass]="{'mb-0': last, 'mb-3': !last}">
                  <span class="text-sm text-slate-600 w-12">{{ analytiques?.periodes[i] }}</span>
                  <div class="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      class="bg-gradient-to-r from-emerald-500 to-green-600 h-full flex items-center justify-end pr-2"
                      [style.width.%]="(analytiques?.ventes[i] || 0) / 2"
                    >
                      <span *ngIf="(analytiques?.ventes[i] || 0) > 50" class="text-xs font-bold text-white">{{ analytiques?.ventes[i] }}</span>
                    </div>
                  </div>
                  <span class="text-sm font-bold text-slate-900 w-12">{{ analytiques?.ventes[i] }}</span>
                </div>
              </div>
            </div>

            <!-- Graphique Revenus -->
            <div class="section-card">
              <h3 class="mb-4">💰 Revenus</h3>
              <div class="space-y-3">
                <div *ngFor="let i of [0,1,2,3]; let last = last" class="flex items-center gap-2" [ngClass]="{'mb-0': last, 'mb-3': !last}">
                  <span class="text-sm text-slate-600 w-12">{{ analytiques?.periodes[i] }}</span>
                  <div class="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      class="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                      [style.width.%]="(analytiques?.revenus[i] || 0) / 500000"
                    >
                    </div>
                  </div>
                  <span class="text-sm font-bold text-slate-900 w-20 text-right">{{ producteurService.formaterDevise(analytiques?.revenus[i] || 0) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet 4: Profil -->
        <div *ngIf="ongletActif === 'profil'" class="space-y-8">
          <div class="section-card">
            <h2 class="mb-6">Mon Profil Producteur</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">Nom de l'exploitation</label>
                <input
                  type="text"
                  [(ngModel)]="profilProducteur.nomExploitation"
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Secteur d'activité</label>
                <input
                  type="text"
                  [(ngModel)]="profilProducteur.secteur"
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Contact</label>
                <input
                  type="tel"
                  [(ngModel)]="profilProducteur.contact"
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  [(ngModel)]="profilProducteur.email"
                  class="form-input"
                >
              </div>

              <div class="col-span-1 md:col-span-2 form-group">
                <label class="form-label">Localisation</label>
                <input
                  type="text"
                  [(ngModel)]="profilProducteur.localisation"
                  class="form-input"
                >
              </div>

              <div class="col-span-1 md:col-span-2 form-group">
                <label class="form-label">Description</label>
                <textarea
                  [(ngModel)]="profilProducteur.description"
                  rows="4"
                  class="form-textarea"
                ></textarea>
              </div>
            </div>

            <button
              (click)="sauvegarderProfil()"
              class="btn-action btn-primary mt-6"
            >
              Sauvegarder les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProducteurComponent implements OnInit {
  ongletActif: 'overview' | 'commandes' | 'performances' | 'profil' = 'overview';
  afficherAjoutProduit = false;
  periodeLiveActive: 'semaine' | 'mois' | 'annee' = 'mois';

  produits: any[] = [];
  commandes: any[] = [];
  stats: StatistiquesProducteur | null = null;
  analytiques: any = null;

  tabs: Array<{ id: 'overview' | 'commandes' | 'performances' | 'profil'; label: string }> = [
    { id: 'overview', label: '📊 Vue d\'ensemble' },
    { id: 'commandes', label: '📦 Commandes' },
    { id: 'performances', label: '📈 Performances' },
    { id: 'profil', label: '👤 Profil' }
  ];

  periodes: Array<{ id: 'semaine' | 'mois' | 'annee'; label: string }> = [
    { id: 'semaine', label: 'Cette semaine' },
    { id: 'mois', label: 'Ce mois' },
    { id: 'annee', label: 'Cette année' }
  ];

  profilProducteur = {
    nomExploitation: 'Ferme Bio Verte',
    secteur: 'Agriculture Biologique',
    contact: '+237 6 12 34 56 78',
    email: 'producteur@agrima.com',
    localisation: 'Yaoundé, Cameroon',
    description: 'Producteur de légumes biologiques de qualité premium'
  };

  constructor(public producteurService: ProducteurService) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.producteurService.obtenirProduits().subscribe(produits => {
      this.produits = produits;
    });

    this.producteurService.obtenirCommandes().subscribe(commandes => {
      this.commandes = commandes;
    });

    this.producteurService.obtenirStatistiques().subscribe(stats => {
      this.stats = stats;
    });

    this.chargerAnalytiques(this.periodeLiveActive);
  }

  chargerAnalytiques(periode: 'semaine' | 'mois' | 'annee'): void {
    this.producteurService.obtenirAnalytiques(periode).subscribe(analytiques => {
      this.analytiques = analytiques;
    });
  }

  editerProduit(produit: any): void {
    console.log('Éditer produit:', produit);
    // À implémenter: ouvrir un modal d'édition
  }

  supprimerProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.producteurService.supprimerProduit(id).subscribe(() => {
        this.chargerDonnees();
      });
    }
  }

  mettreAJourCommande(id: number, event: any): void {
    const nouveau_statut = event.target.value;
    this.producteurService.mettreAJourStatutCommande(id, nouveau_statut).subscribe(() => {
      this.chargerDonnees();
    });
  }

  getClasseStatutCommande(statut: string): string {
    const classes: { [key: string]: string } = {
      'Nouvelle': 'bg-blue-100 text-blue-800',
      'Confirmée': 'bg-green-100 text-green-800',
      'Préparée': 'bg-yellow-100 text-yellow-800',
      'Expédiée': 'bg-purple-100 text-purple-800',
      'Livrée': 'bg-emerald-100 text-emerald-800',
      'Annulée': 'bg-red-100 text-red-800'
    };
    return classes[statut] || 'bg-gray-100 text-gray-800';
  }

  sauvegarderProfil(): void {
    alert('Profil sauvegardé avec succès !');
    console.log('Profil sauvegardé:', this.profilProducteur);
  }
}
