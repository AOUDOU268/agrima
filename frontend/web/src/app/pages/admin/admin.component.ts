import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService, ProfilAdmin } from '../../services/admin.service';
import { AdminStatisticsComponent } from '../../components/admin-statistics/admin-statistics.component';

type RoleGestion = 'ROLE_CONSOMMATEUR' | 'ROLE_PRODUCTEUR' | 'ROLE_LIVREUR';
type StatutGestion = 'Actif' | 'En attente' | 'Suspendu';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminStatisticsComponent],
  template: `
    <div class="page-shell">
      <div class="page-container">
        <!-- Navigation par onglets -->
        <div class="tabs-navigation">
          <button
            *ngFor="let tab of tabs"
            (click)="ongletActif = tab.id"
            [class]="'tab-button ' + (ongletActif === tab.id ? 'active' : '')"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Contenu des onglets -->
        <div *ngIf="ongletActif === 'overview'" class="space-y-8">
          <div class="hero-section">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div class="max-w-3xl">
                <span class="hero-title">Administration des profils</span>
                <h1 class="mt-3 text-4xl font-black">Gérer tous les profils</h1>
                <p class="mt-4 max-w-2xl text-slate-600">
                  Contrôlez les comptes consommateurs, producteurs, livreurs et modérateurs de votre plateforme.
                </p>
              </div>
              <div class="grid min-w-[280px] grid-cols-2 gap-3 sm:min-w-[360px]">
                <div class="stat-card">
                  <p class="stat-label">Total profils</p>
                  <p class="stat-value text-emerald-700">{{ profils.length }}</p>
                </div>
                <div class="stat-card">
                  <p class="stat-label">Actions urgentes</p>
                  <p class="stat-value text-orange-700">{{ profilsUrgents.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="stat-card" *ngFor="let stat of stats">
              <p class="stat-label">{{ stat.label }}</p>
              <p class="stat-value text-emerald-700">{{ stat.value }}</p>
              <p class="stat-hint">{{ stat.hint }} - {{ stat.description }}</p>
            </div>
          </div>

          <div class="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section class="section-card">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2>Liste des profils</h2>
                  <p class="mt-1 text-sm text-slate-500">Filtrer et gérer les comptes utilisateurs</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let filtre of filtresRole"
                    type="button"
                    (click)="filtreRoleActif = filtre.value"
                    [class]="'filter-chip ' + (filtreRoleActif === filtre.value ? 'active' : '')"
                  >
                    {{ filtre.label }}
                  </button>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <button
                  *ngFor="let filtre of filtresStatut"
                  type="button"
                  (click)="filtreStatutActif = filtre.value"
                  [class]="'filter-chip ' + (filtreStatutActif === filtre.value ? 'active' : '')"
                >
                  {{ filtre.label }}
                </button>
              </div>

              <div class="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                <div class="hidden grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.8fr] gap-4 bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 lg:grid">
                  <span>Profil</span>
                  <span>Rôle</span>
                  <span>Statut</span>
                  <span>Confiance</span>
                  <span>Actions</span>
                </div>

                <div *ngFor="let profil of profilsFiltres" class="border-t border-slate-100 first:border-t-0">
                  <div class="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.8fr] lg:items-center">
                    <div>
                      <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-700">
                          {{ getInitiales(profil.nom) }}
                        </div>
                        <div>
                          <button type="button" class="text-left text-base font-black text-slate-900 hover:text-emerald-700" (click)="selectionnerProfil(profil)">
                            {{ profil.nom }}
                          </button>
                          <p class="text-sm text-slate-500">{{ profil.email }}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p class="text-sm font-bold text-slate-900">{{ getRoleLabel(profil.role) }}</p>
                      <p class="mt-1 text-sm text-slate-500">{{ profil.localisation }}</p>
                    </div>

                    <div>
                      <span [class]="getStatusBadgeClass(profil.statut)">{{ profil.statut }}</span>
                      <p class="mt-2 text-xs text-slate-500">Signalements: {{ profil.nbSignalements }}</p>
                    </div>

                    <div>
                      <p class="text-lg font-black text-slate-900">{{ profil.scoreConfiance }}%</p>
                      <p class="text-xs text-slate-500">Note {{ profil.note }}/5</p>
                    </div>

                    <div class="flex flex-wrap gap-2 lg:justify-end">
                      <button type="button" class="btn-action btn-secondary text-sm" (click)="selectionnerProfil(profil)">Voir</button>
                      <button type="button" class="btn-action btn-ghost text-sm" (click)="afficherEdition = true">Éditer</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside class="space-y-6">
              <section class="section-card">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Détails</p>
                    <h3 class="mt-2">{{ profilSelectionne.nom }}</h3>
                    <p class="mt-1 text-sm text-slate-500">{{ getRoleLabel(profilSelectionne.role) }}</p>
                  </div>
                  <span [class]="getStatusBadgeClass(profilSelectionne.statut)">{{ profilSelectionne.statut }}</span>
                </div>

                <div class="mt-6 grid gap-4 sm:grid-cols-2">
                  <div class="stat-card">
                    <p class="stat-label">Téléphone</p>
                    <p class="font-bold text-slate-900">{{ profilSelectionne.telephone }}</p>
                  </div>
                  <div class="stat-card">
                    <p class="stat-label">Score</p>
                    <p class="font-bold text-slate-900">{{ profilSelectionne.scoreConfiance }}%</p>
                  </div>
                </div>

                <div class="mt-6 rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Niveau de risque</p>
                  <p class="mt-2 text-2xl font-black text-slate-900">{{ getNiveauRisque(profilSelectionne) }}</p>
                </div>

                <div class="mt-6 space-y-3">
                  <button type="button" class="btn-action btn-primary w-full" (click)="validerProfil()">Valider</button>
                  <button type="button" class="btn-action btn-ghost w-full" (click)="afficherEdition = true">Éditer le profil</button>
                </div>
              </section>

              <section class="section-card">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <h3>Actions urgentes</h3>
                  <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{{ profilsUrgents.length }}</span>
                </div>

                <div class="space-y-3">
                  <article *ngFor="let profil of profilsUrgents" class="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <p class="font-bold text-sm text-slate-900">{{ profil.nom }}</p>
                    <p class="text-xs text-slate-500 mt-1">{{ getRoleLabel(profil.role) }}</p>
                    <div class="mt-2 flex justify-between items-center text-xs">
                      <span class="text-slate-500">{{ profil.nbSignalements }} signalements</span>
                      <button type="button" class="text-emerald-700 font-bold" (click)="selectionnerProfil(profil)">Voir</button>
                    </div>
                  </article>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <!-- Onglet statistiques -->
        <div *ngIf="ongletActif === 'statistics'">
          <app-admin-statistics></app-admin-statistics>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  ongletActif = 'overview';
  afficherEdition = false;

  tabs = [
    { id: 'overview', label: '📊 Vue d\'ensemble' },
    { id: 'statistics', label: '📈 Statistiques' }
  ];

  profils: ProfilAdmin[] = [];
  filtresRole: Array<{ label: string; value: RoleGestion | 'TOUS' }> = [
    { label: 'Tous les rôles', value: 'TOUS' },
    { label: 'Consommateurs', value: 'ROLE_CONSOMMATEUR' },
    { label: 'Producteurs', value: 'ROLE_PRODUCTEUR' },
    { label: 'Livreurs', value: 'ROLE_LIVREUR' }
  ];

  filtresStatut: Array<{ label: string; value: StatutGestion | 'TOUS' }> = [
    { label: 'Tous statuts', value: 'TOUS' },
    { label: 'Actifs', value: 'Actif' },
    { label: 'En attente', value: 'En attente' },
    { label: 'Suspendus', value: 'Suspendu' }
  ];

  filtreRoleActif: RoleGestion | 'TOUS' = 'TOUS';
  filtreStatutActif: StatutGestion | 'TOUS' = 'TOUS';
  profilSelectionne: ProfilAdmin = {
    id: 0,
    nom: 'Aucun profil sélectionné',
    email: '',
    telephone: '',
    role: 'ROLE_CONSOMMATEUR',
    statut: 'Actif',
    localisation: '',
    dateInscription: '',
    derniereActivite: '',
    scoreConfiance: 0,
    nbSignalements: 0,
    note: 0,
    portefeuille: '',
    tags: []
  };

  constructor(private adminService: AdminService) {
    this.initializerDonneesDemo();
  }

  ngOnInit(): void {
    this.adminService.chargerProfils();
    this.adminService.profils$.subscribe((profils) => {
      if (profils.length > 0) {
        this.profils = profils;
        this.profilSelectionne = profils[0];
      }
    });
  }

  private initializerDonneesDemo(): void {
    this.profils = [
      {
        id: 1,
        nom: 'Aline Mvondo',
        email: 'aline.mvondo@agrima.cm',
        telephone: '+237 690 110 112',
        role: 'ROLE_CONSOMMATEUR',
        statut: 'Actif',
        localisation: 'Yaoundé',
        dateInscription: '12 mars 2026',
        derniereActivite: 'Il y a 8 min',
        scoreConfiance: 94,
        nbSignalements: 0,
        note: 4.8,
        portefeuille: 'Wallet Premium',
        tags: ['client fidèle', 'paiement validé']
      },
      {
        id: 2,
        nom: 'Ferme Horizon Verte',
        email: 'contact@horizonverte.cm',
        telephone: '+237 677 540 887',
        role: 'ROLE_PRODUCTEUR',
        statut: 'En attente',
        localisation: 'Bafoussam',
        dateInscription: '04 avril 2026',
        derniereActivite: 'Il y a 37 min',
        scoreConfiance: 71,
        nbSignalements: 1,
        note: 4.3,
        portefeuille: 'Compte producteur',
        tags: ['documents à vérifier', 'bio'],
        siret: '12345678901234',
        nomExploitation: 'Horizon Verte SARL'
      },
      {
        id: 3,
        nom: 'Samuel Ndzi',
        email: 'samuel.ndzi@agrima.cm',
        telephone: '+237 699 420 921',
        role: 'ROLE_LIVREUR',
        statut: 'Actif',
        localisation: 'Douala',
        dateInscription: '27 février 2026',
        derniereActivite: 'En tournée',
        scoreConfiance: 88,
        nbSignalements: 0,
        note: 4.6,
        portefeuille: 'Livreur Express',
        tags: ['zone urbaine', 'scan QR'],
        vehicule: 'Suzuki Carry',
        plaqueImmatriculation: 'CM-ND-2024'
      },

      {
        id: 5,
        nom: 'Marché Solidaire Mbouda',
        email: 'marchesolidaire@agrima.cm',
        telephone: '+237 681 992 120',
        role: 'ROLE_PRODUCTEUR',
        statut: 'Suspendu',
        localisation: 'Mbouda',
        dateInscription: '08 décembre 2025',
        derniereActivite: 'Suspendu depuis 2 jours',
        scoreConfiance: 42,
        nbSignalements: 5,
        note: 2.9,
        portefeuille: 'Compte vérification',
        tags: ['litige actif', 'stock incohérent']
      },
      {
        id: 6,
        nom: 'Brice Nkou',
        email: 'brice.nkou@agrima.cm',
        telephone: '+237 672 301 990',
        role: 'ROLE_CONSOMMATEUR',
        statut: 'En attente',
        localisation: 'Kribi',
        dateInscription: '18 avril 2026',
        derniereActivite: 'Nouveau compte',
        scoreConfiance: 63,
        nbSignalements: 0,
        note: 0,
        portefeuille: 'Wallet standard',
        tags: ['KYC incomplet']
      }
    ];
    if (this.profils.length > 0) {
      this.profilSelectionne = this.profils[0];
    }
  }

  get profilsFiltres(): ProfilAdmin[] {
    return this.profils.filter((profil) => {
      const okRole = this.filtreRoleActif === 'TOUS' || profil.role === this.filtreRoleActif;
      const okStatut = this.filtreStatutActif === 'TOUS' || profil.statut === this.filtreStatutActif;
      return okRole && okStatut;
    });
  }

  get profilsUrgents(): ProfilAdmin[] {
    return this.profils.filter((profil) => profil.nbSignalements > 0 || profil.statut !== 'Actif').slice(0, 5);
  }

  get stats() {
    return [
      {
        label: 'Comptes actifs',
        value: this.profils.filter((p) => p.statut === 'Actif').length,
        hint: 'Temps réel',
        description: 'Profils opérationnels'
      },
      {
        label: 'Vérifications en cours',
        value: this.profils.filter((p) => p.statut === 'En attente').length,
        hint: 'KYC',
        description: 'Documents à traiter'
      },
      {
        label: 'Profils suspendus',
        value: this.profils.filter((p) => p.statut === 'Suspendu').length,
        hint: 'Sécurité',
        description: 'Comptes gelés'
      },
      {
        label: 'Score moyen',
        value: `${Math.round(this.profils.reduce((t, p) => t + p.scoreConfiance, 0) / (this.profils.length || 1))}%`,
        hint: 'Confiance',
        description: 'Indice global'
      }
    ];
  }

  selectionnerProfil(profil: ProfilAdmin): void {
    this.profilSelectionne = profil;
    this.adminService.selectionnerProfil(profil);
  }

  validerProfil(): void {
    this.adminService.validerProfil(this.profilSelectionne.id, 'Approuvé').subscribe({
      next: () => {
        this.profilSelectionne.statut = 'Actif';
      }
    });
  }

  getRoleLabel(role: RoleGestion): string {
    const labels: Record<RoleGestion, string> = {
      ROLE_CONSOMMATEUR: 'Consommateur',
      ROLE_PRODUCTEUR: 'Producteur',
      ROLE_LIVREUR: 'Livreur'
    };
    return labels[role];
  }

  getStatusBadgeClass(statut: StatutGestion): string {
    const common = 'status-badge ';
    if (statut === 'Actif') return common + 'status-active';
    if (statut === 'En attente') return common + 'status-pending';
    return common + 'status-suspended';
  }

  getInitiales(nom: string): string {
    return nom
      .split(' ')
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }

  getNiveauRisque(profil: ProfilAdmin): string {
    if (profil.scoreConfiance >= 85 && profil.nbSignalements === 0) return '🟢 Faible';
    if (profil.scoreConfiance >= 60 && profil.nbSignalements <= 2) return '🟡 Modéré';
    return '🔴 Élevé';
  }
}
