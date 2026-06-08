import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService, ProfilAdmin } from '../../services/admin.service';
import { AdminModerationComponent } from '../../components/admin-moderation/admin-moderation.component';
import { AdminStatisticsComponent } from '../../components/admin-statistics/admin-statistics.component';
import { AdminEditProfilComponent } from '../../components/admin-edit-profil/admin-edit-profil.component';

type RoleGestion = 'ROLE_CONSOMMATEUR' | 'ROLE_PRODUCTEUR' | 'ROLE_LIVREUR' | 'ROLE_MODERATEUR';
type StatutGestion = 'Actif' | 'En attente' | 'Suspendu';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminModerationComponent, AdminStatisticsComponent, AdminEditProfilComponent],
  template: `
    <div class="admin-shell min-h-screen px-4 py-10">
      <div class="mx-auto max-w-7xl">
        <!-- Onglets de navigation -->
        <div class="tabs-nav mb-8">
          <button
            *ngFor="let tab of tabs"
            (click)="ongletActif = tab.id"
            [class]="'tab-btn ' + (ongletActif === tab.id ? 'tab-active' : '')"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Onglet: Vue d'ensemble -->
        <div *ngIf="ongletActif === 'overview'">
          <div class="admin-hero rounded-[32px] p-8 text-white shadow-2xl shadow-emerald-950/10">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div class="max-w-3xl">
                <p class="admin-kicker">Administration des profils</p>
                <h1 class="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Piloter les consommateurs, producteurs, livreurs et modérateurs</h1>
                <p class="mt-4 max-w-2xl text-sm text-emerald-50/90 sm:text-base">
                  Vue centralisée pour contrôler l'activité des comptes, traiter les alertes et prioriser les actions de modération.
                </p>
              </div>

              <div class="grid min-w-[280px] grid-cols-2 gap-3 sm:min-w-[360px]">
                <div class="admin-glass-card rounded-3xl p-4">
                  <p class="text-xs uppercase tracking-[0.22em] text-emerald-100/80">Profils gérés</p>
                  <p class="mt-3 text-3xl font-black">{{ profils.length }}</p>
                </div>
                <div class="admin-glass-card rounded-3xl p-4">
                  <p class="text-xs uppercase tracking-[0.22em] text-emerald-100/80">Actions urgentes</p>
                  <p class="mt-3 text-3xl font-black">{{ profilsUrgents.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article class="admin-stat-card rounded-3xl p-5" *ngFor="let stat of stats">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{{ stat.label }}</p>
                  <p class="mt-3 text-3xl font-black text-slate-900">{{ stat.value }}</p>
                </div>
                <span class="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{{ stat.hint }}</span>
              </div>
              <p class="mt-3 text-sm text-slate-500">{{ stat.description }}</p>
            </article>
          </div>

          <div class="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section class="rounded-[28px] bg-white p-6 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 class="text-2xl font-black text-slate-900">Gestion des profils</h2>
                  <p class="mt-1 text-sm text-slate-500">Filtrer les comptes, consulter les risques et ouvrir une action rapide.</p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let filtre of filtresRole"
                    type="button"
                    (click)="filtreRoleActif = filtre.value"
                    [class]="getFilterClass(filtreRoleActif === filtre.value)"
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
                  [class]="getFilterClass(filtreStatutActif === filtre.value)"
                >
                  {{ filtre.label }}
                </button>
              </div>

              <div class="mt-6 overflow-hidden rounded-[24px] border border-slate-100">
                <div class="hidden grid-cols-[1.4fr_1fr_0.9fr_0.9fr_0.8fr] gap-4 bg-slate-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400 lg:grid">
                  <span>Profil</span>
                  <span>Rôle</span>
                  <span>Statut</span>
                  <span>Confiance</span>
                  <span>Action</span>
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
                      <div class="mt-3 flex flex-wrap gap-2">
                        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600" *ngFor="let tag of profil.tags">{{ tag }}</span>
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
                      <button type="button" class="action-chip action-chip-primary" (click)="selectionnerProfil(profil)">Détails</button>
                      <button type="button" class="action-chip action-chip-muted" (click)="ouvrirEdition(profil)">
                        {{ profil.statut === 'Suspendu' ? 'Réactiver' : 'Ajuster' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside class="space-y-6">
              <section class="rounded-[28px] bg-white p-6 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100" *ngIf="profilSelectionne">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Fiche profil</p>
                    <h2 class="mt-2 text-2xl font-black text-slate-900">{{ profilSelectionne.nom }}</h2>
                    <p class="mt-1 text-sm text-slate-500">{{ getRoleLabel(profilSelectionne.role) }}</p>
                  </div>
                  <span [class]="getStatusBadgeClass(profilSelectionne.statut)">{{ profilSelectionne.statut }}</span>
                </div>

                <div class="mt-6 grid gap-4 sm:grid-cols-2">
                  <div class="admin-detail-card rounded-2xl p-4">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Téléphone</p>
                    <p class="mt-2 font-bold text-slate-900">{{ profilSelectionne.telephone }}</p>
                  </div>
                  <div class="admin-detail-card rounded-2xl p-4">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Portefeuille</p>
                    <p class="mt-2 font-bold text-slate-900">{{ profilSelectionne.portefeuille }}</p>
                  </div>
                  <div class="admin-detail-card rounded-2xl p-4">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Inscription</p>
                    <p class="mt-2 font-bold text-slate-900">{{ profilSelectionne.dateInscription }}</p>
                  </div>
                  <div class="admin-detail-card rounded-2xl p-4">
                    <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Dernière activité</p>
                    <p class="mt-2 font-bold text-slate-900">{{ profilSelectionne.derniereActivite }}</p>
                  </div>
                </div>

                <div class="mt-6 rounded-3xl bg-slate-50 p-5">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Risque modération</p>
                      <p class="mt-2 text-2xl font-black text-slate-900">{{ getNiveauRisque(profilSelectionne) }}</p>
                    </div>
                    <div class="rounded-2xl bg-white px-4 py-2 text-right shadow-sm">
                      <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Confiance</p>
                      <p class="mt-1 text-xl font-black text-emerald-700">{{ profilSelectionne.scoreConfiance }}%</p>
                    </div>
                  </div>
                  <div class="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" [style.width.%]="profilSelectionne.scoreConfiance"></div>
                  </div>
                </div>

                <div class="mt-6 space-y-3">
                  <button type="button" class="admin-cta admin-cta-primary w-full" (click)="validerProfil()">Valider le profil</button>
                  <button type="button" class="admin-cta admin-cta-secondary w-full" (click)="ongletActif = 'moderation'">Modérer</button>
                  <button type="button" class="admin-cta admin-cta-ghost w-full" (click)="ouvrirEdition(profilSelectionne)">Éditer</button>
                </div>
              </section>

              <section class="rounded-[28px] bg-white p-6 shadow-lg shadow-slate-200/70 ring-1 ring-slate-100">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">File prioritaire</p>
                    <h2 class="mt-2 text-2xl font-black text-slate-900">Actions du jour</h2>
                  </div>
                  <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{{ profilsUrgents.length }} cas</span>
                </div>

                <div class="mt-5 space-y-3">
                  <article *ngFor="let profil of profilsUrgents" class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="font-bold text-slate-900">{{ profil.nom }}</p>
                        <p class="mt-1 text-sm text-slate-500">{{ getRoleLabel(profil.role) }} • {{ profil.localisation }}</p>
                      </div>
                      <span [class]="getStatusBadgeClass(profil.statut)">{{ profil.statut }}</span>
                    </div>
                    <div class="mt-3 flex items-center justify-between text-sm">
                      <span class="text-slate-500">Signalements: {{ profil.nbSignalements }}</span>
                      <button type="button" class="font-bold text-emerald-700 hover:text-emerald-800" (click)="selectionnerProfil(profil)">Examiner</button>
                    </div>
                  </article>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <!-- Onglet: Modération -->
        <div *ngIf="ongletActif === 'moderation'">
          <app-admin-moderation></app-admin-moderation>
        </div>

        <!-- Onglet: Statistiques -->
        <div *ngIf="ongletActif === 'statistics'">
          <app-admin-statistics></app-admin-statistics>
        </div>
      </div>

      <!-- Modal d'édition -->
      <app-admin-edit-profil
        *ngIf="afficherEdition"
        [profil]="profilSelectionne"
        [afficherModal]="afficherEdition"
        (fermer)="afficherEdition = false"
      ></app-admin-edit-profil>
    </div>
  `,
  styles: [`
    .tabs-nav {
      display: flex;
      gap: 8px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 16px;
    }

    .tab-btn {
      padding: 12px 20px;
      border: none;
      background: transparent;
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
    }

    .tab-btn:hover {
      color: #10b981;
    }

    .tab-btn.tab-active {
      color: #10b981;
      border-bottom-color: #10b981;
    }

    .admin-shell {
      background:
        radial-gradient(circle at top left, rgba(16, 185, 129, 0.16), transparent 28%),
        radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 22%),
        linear-gradient(180deg, #f8fdf9 0%, #f5f7fb 100%);
    }

    .admin-hero {
      background:
        radial-gradient(circle at top right, rgba(167, 243, 208, 0.22), transparent 24%),
        linear-gradient(135deg, #053b27 0%, #0c6b45 55%, #0ea86f 100%);
    }

    .admin-kicker {
      display: inline-flex;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.12);
      padding: 0.45rem 0.9rem;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .admin-glass-card {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(12px);
    }

    .admin-stat-card {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }

    .admin-detail-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .filter-chip {
      border-radius: 9999px;
      border: 1px solid #dbe4ee;
      padding: 0.65rem 1rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: #475569;
      background: #ffffff;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .filter-chip:hover {
      border-color: #86efac;
      color: #047857;
      background: #f0fdf4;
    }

    .filter-chip-active {
      border-color: transparent;
      color: #ffffff;
      background: linear-gradient(135deg, #047857 0%, #16a34a 100%);
      box-shadow: 0 10px 22px rgba(5, 150, 105, 0.18);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px;
      padding: 0.45rem 0.8rem;
      font-size: 0.75rem;
      font-weight: 800;
    }

    .status-active {
      background: #ecfdf5;
      color: #047857;
    }

    .status-pending {
      background: #fff7ed;
      color: #c2410c;
    }

    .status-suspended {
      background: #fef2f2;
      color: #b91c1c;
    }

    .action-chip {
      border-radius: 9999px;
      padding: 0.6rem 0.95rem;
      font-size: 0.75rem;
      font-weight: 800;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .action-chip-primary {
      background: #ecfdf5;
      color: #047857;
    }

    .action-chip-primary:hover {
      background: #d1fae5;
    }

    .action-chip-muted {
      background: #f8fafc;
      color: #334155;
    }

    .action-chip-muted:hover {
      background: #e2e8f0;
    }

    .admin-cta {
      border-radius: 9999px;
      padding: 0.9rem 1rem;
      font-weight: 800;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .admin-cta-primary {
      background: linear-gradient(135deg, #047857 0%, #16a34a 100%);
      color: #ffffff;
      box-shadow: 0 12px 24px rgba(5, 150, 105, 0.2);
      border: none;
    }

    .admin-cta-primary:hover {
      transform: translateY(-1px);
    }

    .admin-cta-secondary {
      background: #fff7ed;
      color: #c2410c;
      border: none;
    }

    .admin-cta-ghost {
      background: #f8fafc;
      color: #334155;
      border: 1px solid #e2e8f0;
    }
  `]
})
export class AdminComponent implements OnInit {
  ongletActif = 'overview';
  afficherEdition = false;

  tabs = [
    { id: 'overview', label: '📊 Vue d\'ensemble' },
    { id: 'moderation', label: '🛡️ Modération' },
    { id: 'statistics', label: '📈 Statistiques' }
  ];

  profils: ProfilAdmin[] = [];
  filtresRole: { label: string; value: RoleGestion | 'TOUS' }[] = [
    { label: 'Tous les rôles', value: 'TOUS' },
    { label: 'Consommateurs', value: 'ROLE_CONSOMMATEUR' },
    { label: 'Producteurs', value: 'ROLE_PRODUCTEUR' },
    { label: 'Livreurs', value: 'ROLE_LIVREUR' },
    { label: 'Modérateurs', value: 'ROLE_MODERATEUR' }
  ];

  filtresStatut: { label: string; value: StatutGestion | 'TOUS' }[] = [
    { label: 'Tous statuts', value: 'TOUS' },
    { label: 'Actifs', value: 'Actif' },
    { label: 'En attente', value: 'En attente' },
    { label: 'Suspendus', value: 'Suspendu' }
  ];

  filtreRoleActif: RoleGestion | 'TOUS' = 'TOUS';
  filtreStatutActif: StatutGestion | 'TOUS' = 'TOUS';
  profilSelectionne: ProfilAdmin | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.profils$.subscribe((profils) => {
      this.profils = profils;
      if (profils.length > 0) {
        if (!this.profilSelectionne) {
          this.profilSelectionne = profils[0];
        } else {
          // Synchroniser le profil sélectionné avec les nouvelles données
          const updated = profils.find(p => p.id === this.profilSelectionne?.id);
          if (updated) {
            this.profilSelectionne = updated;
          }
        }
      }
    });
    this.adminService.chargerProfils();
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

  ouvrirEdition(profil: ProfilAdmin): void {
    this.profilSelectionne = profil;
    this.afficherEdition = true;
  }

  validerProfil(): void {
    if (this.profilSelectionne) {
      this.adminService.validerProfil(this.profilSelectionne.id, 'Approuvé par admin UI').subscribe();
    }
  }

  getRoleLabel(role: RoleGestion): string {
    const labels: Record<RoleGestion, string> = {
      ROLE_CONSOMMATEUR: 'Consommateur',
      ROLE_PRODUCTEUR: 'Producteur',
      ROLE_LIVREUR: 'Livreur',
      ROLE_MODERATEUR: 'Modérateur'
    };
    return labels[role] || role;
  }

  getStatusBadgeClass(statut: StatutGestion): string {
    const common = 'status-badge ';
    if (statut === 'Actif') return common + 'status-active';
    if (statut === 'En attente') return common + 'status-pending';
    return common + 'status-suspended';
  }

  getFilterClass(active: boolean): string {
    return active ? 'filter-chip filter-chip-active' : 'filter-chip';
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
