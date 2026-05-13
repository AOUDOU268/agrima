import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ProfilAdmin, RapportModeration } from '../../services/admin.service';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="statistics-container">
      <div class="section-header">
        <h2>Tableau de bord analytique</h2>
        <p>Statistiques et rapports de modération</p>
      </div>

      <!-- Cards statistiques principales -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #ecfdf5;">📊</div>
          <div>
            <p class="stat-label">Profils actifs</p>
            <p class="stat-value">{{ statsGlobales.actifs }}</p>
            <p class="stat-description">Comptes opérationnels</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fff7ed;">⏳</div>
          <div>
            <p class="stat-label">En attente de vérification</p>
            <p class="stat-value">{{ statsGlobales.enAttente }}</p>
            <p class="stat-description">Documents à traiter</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fee2e2;">🚫</div>
          <div>
            <p class="stat-label">Profils suspendus</p>
            <p class="stat-value">{{ statsGlobales.suspendus }}</p>
            <p class="stat-description">Gelés temporairement</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #e0e7ff;">⚠️</div>
          <div>
            <p class="stat-label">Signalements</p>
            <p class="stat-value">{{ statsGlobales.signalements }}</p>
            <p class="stat-description">En attente d'examen</p>
          </div>
        </div>
      </div>

      <!-- Distribution par rôle -->
      <div class="distribution-section">
        <h3>Distribution par rôle</h3>
        <div class="role-bars">
          <div class="role-bar" *ngFor="let role of distributionRoles">
            <div class="role-name">{{ role.label }}</div>
            <div class="bar-container">
              <div class="bar-fill" [style.width.%]="role.percentage">
                <span class="bar-label">{{ role.count }}</span>
              </div>
            </div>
            <div class="bar-percentage">{{ role.percentage }}%</div>
          </div>
        </div>
      </div>

      <!-- Scores de confiance -->
      <div class="confidence-section">
        <h3>Scores de confiance - Distribution</h3>
        <div class="confidence-bands">
          <div class="band band-excellent">
            <p class="band-label">Excellent (90-100%)</p>
            <p class="band-count">{{ statsConfiance.excellent }}</p>
          </div>
          <div class="band band-good">
            <p class="band-label">Bon (70-89%)</p>
            <p class="band-count">{{ statsConfiance.bon }}</p>
          </div>
          <div class="band band-medium">
            <p class="band-label">Moyen (50-69%)</p>
            <p class="band-count">{{ statsConfiance.moyen }}</p>
          </div>
          <div class="band band-low">
            <p class="band-label">Faible (0-49%)</p>
            <p class="band-count">{{ statsConfiance.faible }}</p>
          </div>
        </div>
        <div class="average-score">
          <p>Score moyen global</p>
          <p class="score-value">{{ scoreConfiantMoyenne }}%</p>
        </div>
      </div>

      <!-- Actions urgentes -->
      <div class="urgent-actions-section">
        <h3>Actions prioritaires du jour</h3>
        <div class="actions-list">
          <div class="action-item" *ngFor="let profil of profilsUrgents">
            <div class="action-profil">
              <div class="avatar">{{ adminService.extraireInitiales(profil.nom) }}</div>
              <div class="profil-info">
                <p class="profil-name">{{ profil.nom }}</p>
                <p class="profil-role">{{ getRoleLabel(profil.role) }}</p>
              </div>
            </div>
            <div class="action-reason">
              <span class="badge" *ngIf="profil.nbSignalements > 0">
                {{ profil.nbSignalements }} signalement(s)
              </span>
              <span class="badge suspended" *ngIf="profil.statut === 'Suspendu'">
                Suspendu
              </span>
              <span class="badge pending" *ngIf="profil.statut === 'En attente'">
                En attente
              </span>
            </div>
            <button class="btn-examine">Examiner</button>
          </div>
          <div *ngIf="profilsUrgents.length === 0" class="empty-state">
            <p>✓ Aucune action urgente</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: 20px;
      background: white;
      border-radius: 12px;
    }

    .section-header {
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .section-header p {
      color: #64748b;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      border-color: #10b981;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 24px;
      flex-shrink: 0;
    }

    .stat-label {
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      margin: 6px 0 4px 0;
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-description {
      margin: 0;
      font-size: 12px;
      color: #94a3b8;
    }

    .distribution-section {
      margin-bottom: 32px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
    }

    .distribution-section h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .role-bars {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .role-bar {
      display: grid;
      grid-template-columns: 120px 1fr 60px;
      gap: 12px;
      align-items: center;
    }

    .role-name {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    .bar-container {
      height: 24px;
      background: white;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: width 0.3s ease;
    }

    .bar-label {
      color: white;
      font-size: 11px;
      font-weight: 700;
    }

    .bar-percentage {
      text-align: right;
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }

    .confidence-section {
      margin-bottom: 32px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
    }

    .confidence-section h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .confidence-bands {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .band {
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .band-excellent {
      background: #ecfdf5;
      border: 2px solid #10b981;
    }

    .band-good {
      background: #e0e7ff;
      border: 2px solid #4338ca;
    }

    .band-medium {
      background: #fef3c7;
      border: 2px solid #eab308;
    }

    .band-low {
      background: #fee2e2;
      border: 2px solid #dc2626;
    }

    .band-label {
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
    }

    .band-count {
      margin: 8px 0 0 0;
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
    }

    .average-score {
      padding: 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      text-align: center;
    }

    .average-score p {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }

    .score-value {
      font-size: 32px;
      font-weight: 700;
      color: #10b981;
    }

    .urgent-actions-section {
      margin-bottom: 16px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
    }

    .urgent-actions-section h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }

    .action-profil {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: #ecfdf5;
      color: #047857;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      flex-shrink: 0;
    }

    .profil-info {
      min-width: 0;
    }

    .profil-name {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }

    .profil-role {
      margin: 2px 0 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .action-reason {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      background: #fee2e2;
      color: #b91c1c;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge.suspended {
      background: #fef2f2;
      color: #7f1d1d;
    }

    .badge.pending {
      background: #fff7ed;
      color: #92400e;
    }

    .btn-examine {
      padding: 6px 12px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-examine:hover {
      background: #059669;
    }

    .empty-state {
      text-align: center;
      padding: 24px;
      color: #10b981;
      font-weight: 600;
    }
  `]
})
export class AdminStatisticsComponent implements OnInit {
  statsGlobales = {
    actifs: 0,
    enAttente: 0,
    suspendus: 0,
    signalements: 0
  };

  scoreConfiantMoyenne = 0;
  distributionRoles: Array<{ label: string; count: number; percentage: number }> = [];
  statsConfiance = { excellent: 0, bon: 0, moyen: 0, faible: 0 };
  profilsUrgents: ProfilAdmin[] = [];

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.profils$.subscribe((profils) => {
      this.calculerStatistiques(profils);
      this.profilsUrgents = profils.filter(
        (p) => p.nbSignalements > 0 || p.statut !== 'Actif'
      );
    });
  }

  private calculerStatistiques(profils: ProfilAdmin[]): void {
    if (profils.length === 0) return;

    // Statistiques globales
    this.statsGlobales.actifs = profils.filter((p) => p.statut === 'Actif').length;
    this.statsGlobales.enAttente = profils.filter((p) => p.statut === 'En attente').length;
    this.statsGlobales.suspendus = profils.filter((p) => p.statut === 'Suspendu').length;
    this.statsGlobales.signalements = profils.reduce((total, p) => total + p.nbSignalements, 0);

    // Score moyen
    this.scoreConfiantMoyenne = Math.round(
      profils.reduce((total, p) => total + p.scoreConfiance, 0) / profils.length
    );

    // Distribution par rôle
    const roles: Record<string, number> = {};
    profils.forEach((p) => {
      const role = this.getRoleLabel(p.role);
      roles[role] = (roles[role] || 0) + 1;
    });

    const roleLabels: Record<string, string> = {
      Consommateur: 'Consommateurs',
      Producteur: 'Producteurs',
      Livreur: 'Livreurs',
      Modérateur: 'Modérateurs'
    };

    this.distributionRoles = Object.entries(roles).map(([role, count]) => ({
      label: roleLabels[role] || role,
      count,
      percentage: Math.round((count / profils.length) * 100)
    }));

    // Scores de confiance
    this.statsConfiance.excellent = profils.filter((p) => p.scoreConfiance >= 90).length;
    this.statsConfiance.bon = profils.filter((p) => p.scoreConfiance >= 70 && p.scoreConfiance < 90).length;
    this.statsConfiance.moyen = profils.filter((p) => p.scoreConfiance >= 50 && p.scoreConfiance < 70).length;
    this.statsConfiance.faible = profils.filter((p) => p.scoreConfiance < 50).length;
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      ROLE_CONSOMMATEUR: 'Consommateur',
      ROLE_PRODUCTEUR: 'Producteur',
      ROLE_LIVREUR: 'Livreur',
      ROLE_MODERATEUR: 'Modérateur'
    };
    return labels[role] || role;
  }
}
