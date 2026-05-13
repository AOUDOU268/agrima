import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ProfilAdmin, ActionModeration } from '../../services/admin.service';

@Component({
  selector: 'app-admin-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="moderation-panel">
      <div class="panel-header">
        <h2>Centre de modération</h2>
        <p>Gérer les actions de modération et les signalements</p>
      </div>

      <div class="moderation-grid">
        <!-- Profil sélectionné -->
        <section class="moderation-card" *ngIf="profilSelectionne">
          <h3>Profil à modérer: {{ profilSelectionne.nom }}</h3>

          <div class="profil-info">
            <div class="info-row">
              <span class="label">Rôle:</span>
              <span class="value">{{ getRoleLabel(profilSelectionne.role) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Statut:</span>
              <span [class]="'status-badge ' + getStatusClass(profilSelectionne.statut)">
                {{ profilSelectionne.statut }}
              </span>
            </div>
            <div class="info-row">
              <span class="label">Score de confiance:</span>
              <span class="value">{{ profilSelectionne.scoreConfiance }}%</span>
            </div>
            <div class="info-row">
              <span class="label">Signalements:</span>
              <span class="value alert" *ngIf="profilSelectionne.nbSignalements > 0">
                {{ profilSelectionne.nbSignalements }}
              </span>
              <span class="value" *ngIf="profilSelectionne.nbSignalements === 0">0</span>
            </div>
          </div>

          <div class="actions-section">
            <h4>Actions de modération</h4>

            <div class="action-group">
              <button
                class="action-btn action-validate"
                (click)="afficherFormulaire('validation')"
                [disabled]="profilSelectionne.statut === 'Actif'"
              >
                ✓ Valider le profil
              </button>
            </div>

            <div class="action-group">
              <button
                class="action-btn action-suspend"
                (click)="afficherFormulaire('suspension')"
                [disabled]="profilSelectionne.statut === 'Suspendu'"
              >
                ⏸ Suspendre temporairement
              </button>
              <div class="form-inline" *ngIf="formActifType === 'suspension'">
                <input type="number" [(ngModel)]="suspensionDuree" placeholder="Durée en jours" min="1" />
                <textarea
                  [(ngModel)]="suspensionRaison"
                  placeholder="Raison de la suspension"
                  rows="2"
                ></textarea>
                <div class="form-buttons">
                  <button class="btn-confirm" (click)="suspendre()">Confirmer</button>
                  <button class="btn-cancel" (click)="fermerFormulaire()">Annuler</button>
                </div>
              </div>
            </div>

            <div class="action-group">
              <button class="action-btn action-reactivate" (click)="afficherFormulaire('reactivation')"
                *ngIf="profilSelectionne.statut === 'Suspendu'"
              >
                ↻ Réactiver le profil
              </button>
              <div class="form-inline" *ngIf="formActifType === 'reactivation'">
                <div class="form-buttons">
                  <button class="btn-confirm" (click)="reactiver()">Confirmer la réactivation</button>
                  <button class="btn-cancel" (click)="fermerFormulaire()">Annuler</button>
                </div>
              </div>
            </div>

            <div class="action-group">
              <button class="action-btn action-warn" (click)="afficherFormulaire('avertissement')">
                ⚠ Avertissement
              </button>
              <div class="form-inline" *ngIf="formActifType === 'avertissement'">
                <select [(ngModel)]="avertissementType">
                  <option value="">-- Sélectionner un type --</option>
                  <option value="CONTENU_INAPPROPRIE">Contenu inapproprié</option>
                  <option value="ARNAQUE">Suspicion d'arnaque</option>
                  <option value="HARCELEMENT">Harcèlement</option>
                  <option value="AUTRE">Autre</option>
                </select>
                <textarea
                  [(ngModel)]="avertissementDetails"
                  placeholder="Détails de l'avertissement"
                  rows="2"
                ></textarea>
                <div class="form-buttons">
                  <button class="btn-confirm" (click)="avertir()">Envoyer l'avertissement</button>
                  <button class="btn-cancel" (click)="fermerFormulaire()">Annuler</button>
                </div>
              </div>
            </div>

            <div class="action-group">
              <button class="action-btn action-contact" (click)="afficherFormulaire('contact')">
                ✉ Contacter ce profil
              </button>
              <div class="form-inline" *ngIf="formActifType === 'contact'">
                <input type="text" [(ngModel)]="messageSujet" placeholder="Sujet du message" />
                <textarea
                  [(ngModel)]="messageContenu"
                  placeholder="Message à envoyer"
                  rows="3"
                ></textarea>
                <div class="form-buttons">
                  <button class="btn-confirm" (click)="envoyerMessage()">Envoyer</button>
                  <button class="btn-cancel" (click)="fermerFormulaire()">Annuler</button>
                </div>
              </div>
            </div>

            <div class="action-group">
              <button class="action-btn action-block" (click)="afficherFormulaire('blocage')">
                🚫 Bloquer définitivement
              </button>
              <div class="form-inline warning" *ngIf="formActifType === 'blocage'">
                <p class="warning-text">⚠ Cette action est irréversible!</p>
                <textarea
                  [(ngModel)]="blocageRaison"
                  placeholder="Raison du blocage définitif"
                  rows="3"
                ></textarea>
                <div class="form-buttons">
                  <button class="btn-confirm danger" (click)="bloquer()">Bloquer définitivement</button>
                  <button class="btn-cancel" (click)="fermerFormulaire()">Annuler</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Historique des actions -->
        <section class="moderation-card">
          <h3>Historique des actions</h3>
          <div class="actions-list" *ngIf="historiqueActions.length > 0">
            <article *ngFor="let action of historiqueActions" class="action-item">
              <div class="action-type" [class]="'type-' + action.type.toLowerCase()">
                {{ getActionLabel(action.type) }}
              </div>
              <div class="action-details">
                <p class="action-description">{{ action.description }}</p>
                <p class="action-date">{{ action.dateAction }}</p>
              </div>
              <div class="action-status" [class]="'status-' + action.statut.toLowerCase()">
                {{ action.statut }}
              </div>
            </article>
          </div>
          <div *ngIf="historiqueActions.length === 0" class="empty-state">
            <p>Aucune action de modération enregistrée</p>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .moderation-panel {
      padding: 20px;
      background: white;
      border-radius: 12px;
    }

    .panel-header {
      margin-bottom: 24px;
    }

    .panel-header h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .panel-header p {
      color: #64748b;
      margin: 0;
    }

    .moderation-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 1024px) {
      .moderation-grid {
        grid-template-columns: 1fr;
      }
    }

    .moderation-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }

    .moderation-card h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .moderation-card h4 {
      margin: 16px 0 12px 0;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
    }

    .profil-info {
      background: white;
      border: 1px solid #dbe4ee;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-row .label {
      font-weight: 600;
      color: #475569;
    }

    .info-row .value {
      color: #1e293b;
    }

    .value.alert {
      color: #dc2626;
      font-weight: 700;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
    }

    .status-badge.actif {
      background: #ecfdf5;
      color: #047857;
    }

    .status-badge.en-attente {
      background: #fff7ed;
      color: #c2410c;
    }

    .status-badge.suspendu {
      background: #fef2f2;
      color: #b91c1c;
    }

    .actions-section {
      margin-top: 16px;
    }

    .action-group {
      margin-bottom: 12px;
    }

    .action-btn {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid transparent;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .action-validate {
      background: #ecfdf5;
      color: #047857;
      border-color: #a7f3d0;
    }

    .action-validate:hover:not(:disabled) {
      background: #d1fae5;
    }

    .action-suspend {
      background: #fff7ed;
      color: #c2410c;
      border-color: #fed7aa;
    }

    .action-suspend:hover:not(:disabled) {
      background: #ffedd5;
    }

    .action-reactivate {
      background: #e0e7ff;
      color: #4338ca;
      border-color: #c7d2fe;
    }

    .action-reactivate:hover:not(:disabled) {
      background: #ddd6fe;
    }

    .action-warn {
      background: #fef3c7;
      color: #92400e;
      border-color: #fde68a;
    }

    .action-warn:hover:not(:disabled) {
      background: #fef08a;
    }

    .action-contact {
      background: #e0e7ff;
      color: #4338ca;
      border-color: #c7d2fe;
    }

    .action-contact:hover:not(:disabled) {
      background: #ddd6fe;
    }

    .action-block {
      background: #fee2e2;
      color: #b91c1c;
      border-color: #fecaca;
    }

    .action-block:hover:not(:disabled) {
      background: #fecaca;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .form-inline {
      background: white;
      border: 1px solid #dbe4ee;
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
    }

    .form-inline.warning {
      border-color: #fed7aa;
      background: #fffbeb;
    }

    .warning-text {
      color: #c2410c;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .form-inline input,
    .form-inline select,
    .form-inline textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 13px;
      font-family: inherit;
      margin-bottom: 8px;
    }

    .form-inline input:focus,
    .form-inline select:focus,
    .form-inline textarea:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
    }

    .form-buttons {
      display: flex;
      gap: 8px;
    }

    .form-buttons button {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-confirm {
      background: #10b981;
      color: white;
    }

    .btn-confirm:hover {
      background: #059669;
    }

    .btn-confirm.danger {
      background: #dc2626;
    }

    .btn-confirm.danger:hover {
      background: #b91c1c;
    }

    .btn-cancel {
      background: #e2e8f0;
      color: #475569;
    }

    .btn-cancel:hover {
      background: #cbd5e1;
    }

    .actions-list {
      space-y: 8px;
    }

    .action-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      margin-bottom: 8px;
      align-items: flex-start;
    }

    .action-type {
      flex-shrink: 0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .action-type.type-suspension {
      background: #fff7ed;
      color: #c2410c;
    }

    .action-type.type-validation {
      background: #ecfdf5;
      color: #047857;
    }

    .action-type.type-avertissement {
      background: #fef3c7;
      color: #92400e;
    }

    .action-type.type-contact {
      background: #e0e7ff;
      color: #4338ca;
    }

    .action-type.type-blocage {
      background: #fee2e2;
      color: #b91c1c;
    }

    .action-details {
      flex: 1;
      min-width: 0;
    }

    .action-description {
      margin: 0;
      font-size: 13px;
      color: #1e293b;
      font-weight: 500;
    }

    .action-date {
      margin: 4px 0 0 0;
      font-size: 11px;
      color: #94a3b8;
    }

    .action-status {
      flex-shrink: 0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .action-status.status-effectuee {
      background: #ecfdf5;
      color: #047857;
    }

    .action-status.status-en_attente {
      background: #fff7ed;
      color: #c2410c;
    }

    .action-status.status-rejetee {
      background: #fee2e2;
      color: #b91c1c;
    }

    .empty-state {
      text-align: center;
      padding: 24px;
      color: #94a3b8;
    }
  `]
})
export class AdminModerationComponent implements OnInit {
  profilSelectionne: ProfilAdmin | null = null;
  historiqueActions: ActionModeration[] = [];

  formActifType: string | null = null;
  suspensionDuree = 7;
  suspensionRaison = '';
  avertissementType = '';
  avertissementDetails = '';
  messageSujet = '';
  messageContenu = '';
  blocageRaison = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.profilSelectionne$.subscribe((profil) => {
      this.profilSelectionne = profil;
      if (profil) {
        this.chargerHistorique(profil.id);
      }
    });
  }

  chargerHistorique(profilId: number): void {
    this.adminService.obtenirHistoriqueActions(profilId).subscribe({
      next: (actions) => {
        this.historiqueActions = actions;
      }
    });
  }

  afficherFormulaire(type: string): void {
    this.formActifType = type;
  }

  fermerFormulaire(): void {
    this.formActifType = null;
    this.suspensionDuree = 7;
    this.suspensionRaison = '';
    this.avertissementType = '';
    this.avertissementDetails = '';
    this.messageSujet = '';
    this.messageContenu = '';
    this.blocageRaison = '';
  }

  suspendre(): void {
    if (!this.profilSelectionne) return;
    this.adminService.suspendreTemporairement(this.profilSelectionne.id, this.suspensionDuree, this.suspensionRaison).subscribe({
      next: () => {
        this.fermerFormulaire();
        this.chargerHistorique(this.profilSelectionne!.id);
      }
    });
  }

  reactiver(): void {
    if (!this.profilSelectionne) return;
    this.adminService.reactiverProfil(this.profilSelectionne.id).subscribe({
      next: () => {
        this.fermerFormulaire();
        this.chargerHistorique(this.profilSelectionne!.id);
      }
    });
  }

  avertir(): void {
    if (!this.profilSelectionne) return;
    this.adminService.ajouterAvertissement(this.profilSelectionne.id, this.avertissementType, this.avertissementDetails).subscribe({
      next: () => {
        this.fermerFormulaire();
        this.chargerHistorique(this.profilSelectionne!.id);
      }
    });
  }

  envoyerMessage(): void {
    if (!this.profilSelectionne) return;
    this.adminService.envoyerMessage(this.profilSelectionne.id, this.messageSujet, this.messageContenu).subscribe({
      next: () => {
        this.fermerFormulaire();
      }
    });
  }

  bloquer(): void {
    if (!this.profilSelectionne || !confirm('Êtes-vous certain? Cette action est irréversible!')) return;
    this.adminService.bloquerProfil(this.profilSelectionne.id, this.blocageRaison).subscribe({
      next: () => {
        this.fermerFormulaire();
        this.chargerHistorique(this.profilSelectionne!.id);
      }
    });
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

  getStatusClass(statut: string): string {
    return statut.toLowerCase().replace(/\s+/g, '-');
  }

  getActionLabel(type: string): string {
    const labels: Record<string, string> = {
      SUSPENSION: 'Suspension',
      AVERTISSEMENT: 'Avertissement',
      VALIDATION: 'Validation',
      CONTACT: 'Contact',
      BLOCAGE: 'Blocage'
    };
    return labels[type] || type;
  }
}
