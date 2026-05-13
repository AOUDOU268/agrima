import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models';

@Component({
  selector: 'app-suivi-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="w-full">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Suivi de Commande</h1>

        <!-- Recherche -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Suivre une commande</h2>
          <div class="flex gap-4 items-center">
            <input 
              type="text" 
              [(ngModel)]="numeroCommande"
              placeholder="Entrez le numéro de commande"
              class="w-[50%] sm:w-[30%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-alibaba-red"
            />
            <button 
              (click)="onRechercher()"
              class="bg-alibaba-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Rechercher
            </button>
          </div>
        </div>

        <!-- Commande trouvée -->
        <div *ngIf="commandeSelectionnee" class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left: Status + Timeline -->
            <div class="lg:col-span-3">
              <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-900">Commande #{{ commandeSelectionnee.numero }}</h2>
                <p class="text-gray-600">{{ commandeSelectionnee.dateCommande | date: 'long' }}</p>
              </div>
              <div class="mb-6">
                <span [class]="'px-4 py-2 rounded-full text-sm font-semibold ' + getStatusStyles(commandeSelectionnee.statut)">
                  {{ commandeSelectionnee.statut }}
                </span>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-4">Statut de la commande</h3>
              <div class="space-y-4">
                <div *ngFor="let etape of etapesCommande" class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <div [class]="'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ' + (isEtapeCompletee(etape) ? 'bg-green-500' : 'bg-gray-300')">
                      <span *ngIf="isEtapeCompletee(etape)"><img width="20" height="20" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/></span>
                      <span *ngIf="!isEtapeCompletee(etape)">{{ etapesCommande.indexOf(etape) + 1 }}</span>
                    </div>
                    <div *ngIf="etapesCommande.indexOf(etape) < etapesCommande.length - 1" class="w-px h-10 bg-gray-300 mt-2"></div>
                  </div>
                  <div class="pt-1">
                    <h4 class="font-semibold text-gray-900">{{ etape.nom }}</h4>
                    <p class="text-sm text-gray-600">{{ etape.date | date: 'short' }}</p>
                    <p class="text-sm text-gray-500">{{ etape.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Center: Map (larger) -->
            <div class="lg:col-span-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Suivi en temps réel</h3>
              <div class="bg-gray-100 rounded-lg p-4">
                <div class="relative h-96 bg-white rounded-lg overflow-hidden border-2 border-gray-200">
                  <!-- Carte simulée -->
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 256">
                      <path d="M50,200 Q100,150 150,120 T250,80 Q300,60 350,40"
                            stroke="#3B82F6" stroke-width="3" fill="none" stroke-dasharray="5,5"/>
                      <circle cx="50" cy="200" r="4" fill="#EF4444"/>
                      <circle cx="150" cy="120" r="4" fill="#F59E0B"/>
                      <circle cx="250" cy="80" r="4" fill="#10B981"/>
                      <circle cx="350" cy="40" r="4" fill="#059669"/>
                    </svg>

                    <div class="absolute transition-all duration-1000 ease-linear"
                         [style.left.%]="positionLivreur.x"
                         [style.top.%]="positionLivreur.y">
                      <div class="relative">
                        <div class="w-8 h-8 bg-alibaba-red rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        <div class="absolute top-9 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">{{ livreurInfo.nom }}</div>
                      </div>
                    </div>

                    <div class="absolute bottom-4 right-4">
                      <div class="bg-white px-3 py-2 rounded-lg shadow-md border">
                        <div class="text-sm font-semibold text-gray-800">🏠 Destination</div>
                        <div class="text-xs text-gray-600">{{ commandeSelectionnee.adresseLivraison.split(',')[0] }}</div>
                      </div>
                    </div>

                    <div class="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md border">
                      <div class="text-sm">
                        <div class="font-semibold text-gray-800">{{ livreurInfo.nom }}</div>
                        <div class="text-gray-600">{{ livreurInfo.telephone }}</div>
                        <div class="text-green-600 font-medium">{{ livreurInfo.statut }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="absolute bottom-2 left-2 flex gap-2">
                    <button (click)="centrerCarte()" class="bg-white hover:bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs shadow">Centrer</button>
                    <button (click)="rafraichirPosition()" class="bg-white hover:bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs shadow">Actualiser</button>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div class="bg-blue-50 p-3 rounded-lg">
                    <div class="font-semibold text-blue-800">Distance restante</div>
                    <div class="text-blue-600">{{ distanceRestante }} km</div>
                  </div>
                  <div class="bg-green-50 p-3 rounded-lg">
                    <div class="font-semibold text-green-800">Temps estimé</div>
                    <div class="text-green-600">{{ tempsEstime }}</div>
                  </div>
                  <div class="bg-orange-50 p-3 rounded-lg">
                    <div class="font-semibold text-orange-800">Vitesse moyenne</div>
                    <div class="text-orange-600">{{ vitesseMoyenne }} km/h</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Livraison, Paiement, Articles, Actions -->
            <div class="lg:col-span-3 space-y-4">
              <div class="border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Livraison</h3>
                <p class="text-gray-600 text-sm">{{ commandeSelectionnee.adresseLivraison }}</p>
                <p class="text-gray-600 text-sm mt-2">Mode: <span class="font-semibold">{{ commandeSelectionnee.modeLivraison }}</span></p>
              </div>

              <div class="border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">Paiement</h3>
                <p class="text-gray-600 text-sm">Montant: <span class="font-semibold">{{ commandeSelectionnee.montantTotal | number:'1.0-0' }} FCFA</span></p>
                <p class="text-gray-600 text-sm mt-2">Frais: <span class="font-semibold">{{ commandeSelectionnee.fraisLivraison | number:'1.0-0' }} FCFA</span></p>
              </div>

              <div class="border border-gray-100 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Articles commandés</h3>
                <div class="space-y-3">
                  <div *ngFor="let article of commandeSelectionnee.articles" class="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <img [src]="article.image" class="w-12 h-12 object-cover rounded" alt="{{article.nom}}">
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ article.nom }}</h4>
                        <p class="text-sm text-gray-600">Quantité: {{ article.quantite }}</p>
                      </div>
                    </div>
                    <span class="font-semibold text-alibaba-red">{{ (article.prix * article.quantite) | number:'1.0-0' }} FCFA</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <button class="w-full border-2 border-alibaba-red text-alibaba-red px-6 py-3 rounded-lg font-semibold hover:bg-alibaba-red hover:text-white transition-colors">
                  Contacter le support
                </button>
                <button class="w-full border-2 border-alibaba-red text-alibaba-red px-6 py-3 rounded-lg font-semibold hover:bg-alibaba-red hover:text-white transition-colors">
                  Relancer la livraison
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pas de commande trouvée -->
        <div *ngIf="numeroCommande && !commandeSelectionnee" class="bg-red-100 border border-red-400 rounded-lg p-6 text-center">
          <p class="text-red-800">Commande not found. Please check the order number and try again.</p>
        </div>

        <!-- Liste des commandes -->
        <div *ngIf="!numeroCommande" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Dernières commandes</h2>
          <div *ngIf="dernieresCommandes.length === 0" class="text-center py-12">
            <p class="text-gray-500">Aucune commande trouvée</p>
          </div>
          <div *ngIf="dernieresCommandes.length > 0" class="space-y-3">
            <div *ngFor="let commande of dernieresCommandes" class="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer" (click)="onSelectionnerCommande(commande)">
              <div>
                <h3 class="font-semibold text-gray-900">#{{ commande.numero }}</h3>
                <p class="text-sm text-gray-600">{{ commande.dateCommande | date: 'short' }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-alibaba-red">{{ commande.montantTotal | number:'1.0-0' }} FCFA</p>
                <span [class]="'text-xs px-2 py-1 rounded ' + getStatusStyles(commande.statut)">
                  {{ commande.statut }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SuiviCommandeComponent implements OnInit, OnDestroy, AfterViewInit {
  numeroCommande = '';
  commandeSelectionnee: Commande | null = null;
  dernieresCommandes: Commande[] = [];

  // Données de suivi en temps réel
  positionLivreur = { x: 10, y: 80 }; // Position en pourcentage
  livreurInfo = {
    nom: 'Ahmed Diallo',
    telephone: '+237 655 147 477',
    statut: 'En route'
  };
  distanceRestante = 2.3;
  tempsEstime = '15 min';
  vitesseMoyenne = 45;

  private intervalId: any;

  etapesCommande = [
    { nom: 'Commande reçue', date: new Date(), description: 'Votre commande a été enregistrée' },
    { nom: 'Confirmée', date: new Date(Date.now() + 86400000), description: 'Paiement confirmé' },
    { nom: 'En préparation', date: new Date(Date.now() + 172800000), description: 'Emballage en cours' },
    { nom: 'Expédiée', date: new Date(Date.now() + 259200000), description: 'Remis au transporteur' },
    { nom: 'Livrée', date: new Date(Date.now() + 432000000), description: 'Remise au destinataire' }
  ];

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.chargerDernieresCommandes();
  }

  chargerDernieresCommandes(): void {
    // Données de test pour démonstration (avec champs `image` requis par le modèle Article)
    this.dernieresCommandes = [
      {
        id: 1,
        numero: 'AGR001',
        dateCommande: new Date(Date.now() - 86400000), // Hier
        statut: 'Expédiée',
        montantTotal: 25000,
        fraisLivraison: 1500,
        adresseLivraison: '123 Rue de la Paix, Yaoundé, Cameroun',
        modeLivraison: 'Express 24h',
        clientId: 101,
        producteurId: 201,
        articles: [
          { id: 1, produitId: 1, nom: 'Tomates Bio', prix: 1500, quantite: 5, image: 'assets/images/tomates.webp' },
          { id: 2, produitId: 2, nom: 'Bananes Plantain', prix: 2000, quantite: 3, image: 'assets/images/bananes.webp' }
        ]
      },
      {
        id: 2,
        numero: 'AGR002',
        dateCommande: new Date(Date.now() - 172800000), // Avant-hier
        statut: 'Livrée',
        montantTotal: 18500,
        fraisLivraison: 1000,
        adresseLivraison: '456 Avenue des Commerçants, Douala, Cameroun',
        modeLivraison: 'Standard',
        clientId: 102,
        producteurId: 202,
        articles: [
          { id: 3, produitId: 3, nom: 'Mangues Fraîches', prix: 3000, quantite: 4, image: 'assets/images/mangues.webp' }
        ]
      },
      {
        id: 3,
        numero: 'AGR003',
        dateCommande: new Date(Date.now() - 259200000), // Il y a 3 jours
        statut: 'Confirmée',
        montantTotal: 32000,
        fraisLivraison: 2000,
        adresseLivraison: '789 Boulevard de la Liberté, Bafoussam, Cameroun',
        modeLivraison: 'Express 24h',
        clientId: 103,
        producteurId: 203,
        articles: [
          { id: 4, produitId: 4, nom: 'Avocats Hass', prix: 2500, quantite: 6, image: 'assets/images/avocats.webp' },
          { id: 5, produitId: 5, nom: 'Papayes', prix: 1800, quantite: 4, image: 'assets/images/papayes.webp' }
        ]
      }
    ];
  }

  onRechercher(): void {
    if (!this.numeroCommande.trim()) return;
    
    this.commandeService.getCommandes().subscribe({
      next: (commandes: any) => {
        const trouve = commandes.find((c: any) => c.numero === this.numeroCommande);
        this.commandeSelectionnee = trouve || null;
      }
    });
  }

  onSelectionnerCommande(commande: Commande): void {
    this.commandeSelectionnee = commande;
    this.numeroCommande = commande.numero;
  }

  isEtapeCompletee(etape: any): boolean {
    return etape.date <= new Date();
  }

  ngAfterViewInit(): void {
    // Démarrer la simulation de suivi en temps réel
    this.demarrerSuiviTempsReel();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private demarrerSuiviTempsReel(): void {
    // Simulation du mouvement du livreur toutes les 3 secondes
    this.intervalId = setInterval(() => {
      if (this.commandeSelectionnee &&
          (this.commandeSelectionnee.statut === 'Expédiée' || this.commandeSelectionnee.statut === 'Livrée')) {
        this.simulerMouvementLivreur();
      }
    }, 3000);
  }

  private simulerMouvementLivreur(): void {
    // Simulation réaliste du mouvement vers la destination
    const destinationX = 85; // Position finale en %
    const destinationY = 15;

    // Calculer la direction vers la destination
    const deltaX = destinationX - this.positionLivreur.x;
    const deltaY = destinationY - this.positionLivreur.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 1) { // Si pas encore arrivé
      // Avancer de 2-3% vers la destination
      const step = 2 + Math.random() * 1;
      const ratio = step / distance;

      this.positionLivreur.x += deltaX * ratio;
      this.positionLivreur.y += deltaY * ratio;

      // Mettre à jour les informations
      this.distanceRestante = Math.max(0, this.distanceRestante - 0.1);
      this.mettreAJourTempsEstime();
    } else if (this.commandeSelectionnee?.statut !== 'Livrée') {
      // Arrivé à destination
      this.positionLivreur.x = destinationX;
      this.positionLivreur.y = destinationY;
      this.distanceRestante = 0;
      this.tempsEstime = 'Arrivé';
      this.livreurInfo.statut = 'Livraison terminée';
    }
  }

  private mettreAJourTempsEstime(): void {
    if (this.distanceRestante <= 0) {
      this.tempsEstime = 'Arrivé';
    } else {
      const minutes = Math.ceil(this.distanceRestante / (this.vitesseMoyenne / 60));
      this.tempsEstime = `${minutes} min`;
    }
  }

  centrerCarte(): void {
    // Remettre la position du livreur au centre de la vue
    this.positionLivreur = { x: 50, y: 50 };
  }

  rafraichirPosition(): void {
    // Simuler un rafraîchissement des données
    this.simulerMouvementLivreur();
    // Petit feedback visuel
    const bouton = document.activeElement as HTMLElement;
    if (bouton) {
      bouton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        bouton.style.transform = 'scale(1)';
      }, 150);
    }
  }

  getStatusStyles(statut: string): string {
    const styles: { [key: string]: string } = {
      'En attente': 'bg-yellow-100 text-yellow-800',
      'Confirmée': 'bg-blue-100 text-blue-800',
      'Expédiée': 'bg-purple-100 text-purple-800',
      'Livrée': 'bg-green-100 text-green-800',
      'Annulée': 'bg-red-100 text-red-800'
    };
    return styles[statut] || 'bg-gray-100 text-gray-800';
  }
}
