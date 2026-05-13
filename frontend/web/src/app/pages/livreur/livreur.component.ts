import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService, ProfilAdmin } from '../../services/admin.service';

@Component({
  selector: 'app-livreur',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-shell">
      <div class="page-container">
        <div class="hero-section">
          <h1>Espace Livreur</h1>
          <p class="mt-2">Suivi des livraisons, gestion de profil et historique.</p>
        </div>

        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4">Mes informations</h2>
          <div class="section-card">
            <div class="flex flex-col gap-3">
              <div><span class="font-semibold">Nom :</span> {{ livreur?.nom }}</div>
              <div><span class="font-semibold">Email :</span> {{ livreur?.email }}</div>
              <div><span class="font-semibold">Téléphone :</span> {{ livreur?.telephone }}</div>
              <div><span class="font-semibold">Véhicule :</span> {{ livreur?.vehicule || 'Non renseigné' }}</div>
              <div><span class="font-semibold">Plaque :</span> {{ livreur?.plaqueImmatriculation || 'Non renseignée' }}</div>
              <div><span class="font-semibold">Statut :</span> <span [ngClass]="getStatusClass(livreur?.statut)">{{ livreur?.statut }}</span></div>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold mb-4">Livraisons en cours</h2>
          <div *ngIf="livraisons.length; else noDelivery">
            <div class="delivery-card" *ngFor="let livraison of livraisons">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div class="font-semibold">Commande #{{ livraison.commandeId }}</div>
                  <div class="text-sm text-slate-500">Adresse : {{ livraison.adresse }}</div>
                  <div class="text-xs text-slate-400">Statut : {{ livraison.statut }}</div>
                </div>
                <div class="flex gap-2 mt-2 sm:mt-0">
                  <button class="btn-action btn-primary" (click)="marquerLivree(livraison)">Marquer comme livrée</button>
                  <button class="btn-action btn-secondary" (click)="voirDetails(livraison)">Détails</button>
                </div>
              </div>
            </div>
          </div>
          <ng-template #noDelivery>
            <div class="text-slate-400 section-card">Aucune livraison en cours.</div>
          </ng-template>
        </section>

        <section>
          <h2 class="text-xl font-bold mb-4">Historique des livraisons</h2>
          <div *ngIf="historique.length; else noHistory">
            <div class="delivery-card" *ngFor="let livraison of historique">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div class="font-semibold">Commande #{{ livraison.commandeId }}</div>
                  <div class="text-sm text-slate-500">Adresse : {{ livraison.adresse }}</div>
                  <div class="text-xs text-slate-400">Statut : {{ livraison.statut }}</div>
                  <div class="text-xs text-slate-400">Livrée le : {{ livraison.dateLivraison | date:'short' }}</div>
                </div>
                <button class="btn-action btn-secondary" (click)="voirDetails(livraison)">Détails</button>
              </div>
            </div>
          </div>
          <ng-template #noHistory>
            <div class="text-slate-400 section-card">Aucun historique de livraison.</div>
          </ng-template>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .delivery-card {
      background: #fff;
      border: 1.5px solid #e0e7ef;
      border-radius: 1rem;
      padding: 1.2rem 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 12px rgba(16,24,40,0.04);
      transition: box-shadow 0.18s;
    }
    .delivery-card:hover { box-shadow: 0 6px 24px rgba(16,185,129,0.10); }
  `]
})
export class LivreurComponent implements OnInit {
  livreur: ProfilAdmin | null = null;
  livraisons: any[] = [];
  historique: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // À adapter : ici on suppose un livreur connecté avec id 1
    this.adminService.obtenirLivreur(1).subscribe(livreur => this.livreur = livreur);
    // À remplacer par un vrai service de livraison
    this.livraisons = [
      { commandeId: 101, adresse: '12 rue des Fleurs', statut: 'En cours' },
      { commandeId: 102, adresse: '8 avenue du Parc', statut: 'En attente' }
    ];
    this.historique = [
      { commandeId: 99, adresse: '5 rue du Moulin', statut: 'Livrée', dateLivraison: new Date() }
    ];
  }

  getStatusClass(statut: string | undefined) {
    if (statut === 'Actif') return 'status-active';
    if (statut === 'Suspendu') return 'status-suspended';
    return 'status-pending';
  }

  marquerLivree(livraison: any) {
    // TODO: Appeler le service pour marquer la livraison comme livrée
    livraison.statut = 'Livrée';
    this.historique.push({ ...livraison, dateLivraison: new Date() });
    this.livraisons = this.livraisons.filter(l => l !== livraison);
  }

  voirDetails(livraison: any) {
    // TODO: Afficher un modal ou une page de détails
    alert('Détails de la livraison à venir.');
  }
}
