import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PanierService } from '../../services/panier.service';
import { CommandeService } from '../../services/commande.service';
import { AuthService } from '../../services/auth.service';
import { Commande, Article } from '../../models/index';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8"><img width="24" height="24" src="assets/icones/icons8-documents-100.webp" alt="clipboard" class="inline-block align-middle mr-1"/> Passer votre Commande</h1>

        <div class="grid grid-cols-3 gap-8">
          <!-- Formulaire -->
          <div class="col-span-2 space-y-6">
            <!-- Adresse de livraison -->
            <div class="border rounded-lg p-6">
              <h2 class="text-xl font-bold mb-4"><img width="24" height="24" src="assets/icones/icons8-place-marker-100.webp" alt="location" class="inline-block align-middle mr-1"/> Adresse de Livraison</h2>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Nom complet *</label>
                  <input type="text" [(ngModel)]="commande.adresseLivraison" 
                         placeholder="Nom complet"
                         class="w-full px-4 py-2 border rounded focus:outline-none focus:border-alibaba-red">
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Téléphone *</label>
                  <input type="tel" [(ngModel)]="telephone"
                         placeholder="+237 6xx xxx xxx"
                         class="w-full px-4 py-2 border rounded focus:outline-none focus:border-alibaba-red">
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-bold mb-2">Adresse *</label>
                <input type="text" placeholder="Adresse livraison"
                       class="w-full px-4 py-2 border rounded focus:outline-none focus:border-alibaba-red">
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Ville *</label>
                  <input type="text" placeholder="Maroua"
                         class="w-full px-4 py-2 border rounded focus:outline-none focus:border-alibaba-red">
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Code Postal</label>
                  <input type="text" placeholder="xxxxx"
                         class="w-full px-4 py-2 border rounded focus:outline-none focus:border-alibaba-red">
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Région *</label>
                  <select class="w-full px-4 py-2 border rounded focus:outline-none focus:border-alibaba-red">
                    <option>Adamaoua</option>
                    <option>Extrême-nord</option>
                    <option>Nord</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Mode de livraison -->
            <div class="border rounded-lg p-6">
              <h2 class="text-xl font-bold mb-4"><img width="24" height="24" src="assets/icones/livraison.webp" alt="livraison" class="inline-block align-middle mr-1"/> Mode de Livraison</h2>
              
              <div class="space-y-3">
                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" [(ngModel)]="commande.modeLivraison" 
                         value="standard" name="livraison" class="mr-3">
                  <div class="flex-1">
                    <p class="font-bold">Livraison Standard</p>
                    <p class="text-sm text-gray-600">24-48h - Gratuit</p>
                  </div>
                  <span class="text-alibaba-red font-bold">0 FCFA</span>
                </label>

                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" [(ngModel)]="commande.modeLivraison" 
                         value="express" name="livraison" class="mr-3">
                  <div class="flex-1">
                    <p class="font-bold">Livraison Express</p>
                    <p class="text-sm text-gray-600">12-24h</p>
                  </div>
                  <span class="text-alibaba-red font-bold">50 FCFA</span>
                </label>

                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" [(ngModel)]="commande.modeLivraison" 
                         value="urgente" name="livraison" class="mr-3">
                  <div class="flex-1">
                    <p class="font-bold">Livraison Urgente</p>
                    <p class="text-sm text-gray-600">Même jour</p>
                  </div>
                  <span class="text-alibaba-red font-bold">150 FCFA</span>
                </label>
              </div>
            </div>

            <!-- Paiement -->
            <div class="border rounded-lg p-6">
              <h2 class="text-xl font-bold mb-4"><img width="24" height="24" src="assets/icones/icons8-carte-bancaire-face-arrière-100.webp" alt="carte" class="inline-block align-middle mr-1"/> Méthode de Paiement</h2>
              
              <div class="space-y-3">
                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" [(ngModel)]="modePaiement" value="portefeuille" name="paiement" class="mr-3">
                  <div class="flex-1">
                    <p class="font-bold">Portefeuille Électronique</p>
                    <p class="text-sm text-gray-600">Orange Money, Mobile Money</p>
                  </div>
                </label>

                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input type="radio" [(ngModel)]="modePaiement" value="remboursement" name="paiement" class="mr-3">
                  <div class="flex-1">
                    <p class="font-bold">À la Livraison (Remboursement)</p>
                    <p class="text-sm text-gray-600">Payez lors de la réception</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Notes -->
            <div class="border rounded-lg p-6">
              <h2 class="text-xl font-bold mb-4"><img width="24" height="24" src="assets/icones/icons8-signing-a-document-100.webp" alt="note" class="inline-block align-middle mr-1"/> Notes Spéciales</h2>
              <textarea [(ngModel)]="notes" 
                        placeholder="Instructions de livraison, demandes spéciales..."
                        rows="4"
                        class="w-full px-4 py-2 border rounded focus:outline-none focus:border-alibaba-red"></textarea>
            </div>
          </div>

          <!-- Résumé -->
          <div class="bg-gray-50 rounded-lg p-6 h-fit sticky top-32">
            <h3 class="text-xl font-bold mb-6">Résumé Commande</h3>

            <!-- Articles -->
            <div class="space-y-3 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
              <div *ngFor="let article of articles" class="flex justify-between text-sm">
                <span>{{article.nom}} x{{article.quantite}}</span>
                <span>{{(article.prix * article.quantite) | number}} FCFA</span>
              </div>
            </div>

            <!-- Totaux -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span>Sous-total</span>
                <span>{{sousTotal | number}} FCFA</span>
              </div>
              <div class="flex justify-between">
                <span>Frais livraison</span>
                <span>{{fraisLivraison | number}} FCFA</span>
              </div>
              <div class="flex justify-between">
                <span>Taxes (20%)</span>
                <span>{{taxes | number}} FCFA</span>
              </div>
            </div>

            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-alibaba-red">{{total | number}} FCFA</span>
              </div>
            </div>

            <!-- Conditions -->
            <label class="flex items-start gap-2 mb-6">
              <input type="checkbox" [(ngModel)]="acceptConditions" class="mt-1">
              <span class="text-sm">
                J'accepte les conditions d'utilisation et la politique de confidentialité
              </span>
            </label>

            <!-- Boutons -->
            <button (click)="passerCommande()" 
                    [disabled]="!acceptConditions"
                    class="w-full bg-alibaba-red text-white py-3 rounded font-bold mb-2 hover:bg-red-700 disabled:bg-gray-400">
              <img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/> Passer la Commande
            </button>
            <button (click)="retourPanier()" class="w-full border-2 border-alibaba-red text-alibaba-red py-3 rounded font-bold hover:bg-red-50">
              ← Retour au panier
            </button>

            <!-- Garanties -->
            <div class="mt-6 text-xs text-gray-600 space-y-2">
              <p><img width="24" height="24" src="assets/icones/protect.webp" alt="lock" class="inline-block align-middle mr-1"/> Paiement 100% sécurisé</p>
              <p><img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/> Livraison garantie ou remboursé</p>
              <p><img width="24" height="24" src="assets/icones/suivi.webp" alt="refresh" class="inline-block align-middle mr-1"/> Retour gratuit 30 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CommandeComponent implements OnInit {
  commande: Commande = {
    id: 0,
    numero: '',
    dateCommande: new Date(),
    statut: 'PENDING',
    montantTotal: 0,
    fraisLivraison: 0,
    articles: [],
    adresseLivraison: '',
    modeLivraison: 'standard',
    clientId: 0,
    producteurId: 0
  };

  articles: Article[] = [];
  sousTotal = 0;
  fraisLivraison = 0;
  taxes = 0;
  total = 0;
  modePaiement = 'remboursement';
  acceptConditions = false;
  notes = '';
  telephone = '';

  constructor(
    private panierService: PanierService,
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.articles = this.panierService.obtenirArticles();
    this.calculerTotaux();
  }

  calculerTotaux(): void {
    this.sousTotal = this.articles.reduce((total, a) => total + (a.prix * a.quantite), 0);
    this.fraisLivraison = this.commande.modeLivraison === 'standard' ? 0 :
      this.commande.modeLivraison === 'express' ? 50 : 150;
    this.taxes = (this.sousTotal + this.fraisLivraison) * 0.2;
    this.total = this.sousTotal + this.fraisLivraison + this.taxes;
  }

  passerCommande(): void {
    if (!this.acceptConditions) {
      alert('Veuillez accepter les conditions');
      return;
    }

    const utilisateur = this.authService.obtenirUtilisateur();
    if (!utilisateur) {
      alert('Veuillez vous connecter');
      this.router.navigate(['/connexion']);
      return;
    }

    this.commande.articles = this.articles;
    this.commande.montantTotal = this.total;
    this.commande.fraisLivraison = this.fraisLivraison;
    this.commande.clientId = utilisateur.id;
    this.commande.numero = 'CMD-' + Date.now();

    this.commandeService.creerCommande(this.commande).subscribe({
      next: (cmd: Commande) => {
        alert('Commande créée avec succès !');
        this.panierService.viderPanier();
        this.router.navigate(['/suivi-commande'], { queryParams: { numero: cmd.numero } });
      },
      error: (error: any) => {
        alert('Erreur lors de la création de la commande');
        console.error(error);
      }
    });
  }

  retourPanier(): void {
    this.router.navigate(['/panier']);
  }
}
