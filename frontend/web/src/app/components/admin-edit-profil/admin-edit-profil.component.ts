import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilAdmin, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-edit-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="afficherModal" (click)="fermerModal()">
      <div class="modal-contenu" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Éditer le profil - {{ profil?.nom }}</h2>
          <button class="close-btn" (click)="fermerModal()">✕</button>
        </div>

        <form class="modal-body" (ngSubmit)="sauvegarder()" *ngIf="profil">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="profil.email" name="email" readonly class="form-control" />
          </div>

          <div class="form-group">
            <label>Téléphone</label>
            <input type="tel" [(ngModel)]="profil.telephone" name="telephone" class="form-control" />
          </div>

          <div class="form-group">
            <label>Localisation</label>
            <input type="text" [(ngModel)]="profil.localisation" name="localisation" class="form-control" />
          </div>

          <div class="form-group">
            <label>Score de confiance (%)</label>
            <input
              type="number"
              [(ngModel)]="profil.scoreConfiance"
              name="scoreConfiance"
              min="0"
              max="100"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select [(ngModel)]="profil.statut" name="statut" class="form-control">
              <option value="Actif">Actif</option>
              <option value="En attente">En attente</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>

          <div class="form-group" *ngIf="profil.role === 'ROLE_PRODUCTEUR'">
            <label>Siret</label>
            <input type="text" [(ngModel)]="profil.siret" name="siret" class="form-control" />
          </div>

          <div class="form-group" *ngIf="profil.role === 'ROLE_PRODUCTEUR'">
            <label>Nom de l'exploitation</label>
            <input type="text" [(ngModel)]="profil.nomExploitation" name="nomExploitation" class="form-control" />
          </div>

          <div class="form-group" *ngIf="profil.role === 'ROLE_LIVREUR'">
            <label>Véhicule</label>
            <input type="text" [(ngModel)]="profil.vehicule" name="vehicule" class="form-control" />
          </div>

          <div class="form-group" *ngIf="profil.role === 'ROLE_LIVREUR'">
            <label>Plaque d'immatriculation</label>
            <input type="text" [(ngModel)]="profil.plaqueImmatriculation" name="plaqueImmatriculation" class="form-control" />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="fermerModal()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="chargement">
              {{ chargement ? 'Enregistrement...' : 'Sauvegarder' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-contenu {
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #64748b;
    }

    .modal-body {
      padding: 20px;
    }

    .modal-footer {
      display: flex;
      gap: 10px;
      padding: 20px;
      border-top: 1px solid #e2e8f0;
      justify-content: flex-end;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #475569;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-control:read-only {
      background: #f8fafc;
      color: #94a3b8;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #047857 0%, #16a34a 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(5, 150, 105, 0.2);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #475569;
    }

    .btn-secondary:hover {
      background: #cbd5e1;
    }
  `]
})
export class AdminEditProfilComponent {
  @Input() profil: ProfilAdmin | null = null;
  @Input() afficherModal = false;
  @Output() fermer = new EventEmitter<void>();

  chargement = false;

  constructor(private adminService: AdminService) {}

  sauvegarder(): void {
    if (!this.profil) return;

    this.chargement = true;
    this.adminService.mettreAJourProfil(this.profil.id, this.profil).subscribe({
      next: () => {
        this.chargement = false;
        this.fermerModal();
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde', error);
        this.chargement = false;
      }
    });
  }

  fermerModal(): void {
    this.fermer.emit();
  }
}
