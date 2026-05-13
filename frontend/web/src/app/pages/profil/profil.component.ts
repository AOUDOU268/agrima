import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommandeService } from '../../services/commande.service';
import { FavorisService, ProduitFavori } from '../../services/favoris.service';
import { Commande } from '../../models';

interface ComptePaiement {
  type: 'OM' | 'MOMO';
  numero: string;
  nomProprietaire: string;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 font-outfit">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                <img *ngIf="utilisateur?.photoUrl" [src]="utilisateur.photoUrl" alt="Avatar" class="w-full h-full object-cover">
                <img *ngIf="!utilisateur?.photoUrl" src="assets/icones/default_user.webp" alt="Default Avatar" class="w-12 h-12">
              </div>
              <div>
                <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ utilisateur?.nom }}</h1>
                <p class="text-gray-500 font-medium flex items-center gap-2">
                  <img src="assets/icones/mail.webp" class="w-4 h-4 opacity-60" alt="email">
                  {{ utilisateur?.email }}
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <button 
                (click)="onDeconnexion()"
                class="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center gap-3 border border-red-100 shadow-sm"
              >
                <img src="assets/icones/deconnexion.webp" class="w-6 h-6" alt="logout">
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar Navigation -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <nav class="flex flex-col p-2">
                <button 
                  (click)="onMenuChange('infos')"
                  [class]="'flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ' + (menu === 'infos' ? 'bg-[#008a5d]/10 text-[#008a5d]' : 'text-gray-600 hover:bg-gray-50')"
                >
                  <img src="assets/icones/default_user.webp" class="w-6 h-6" alt="infos">
                  Mes Informations
                </button>
                <button 
                  (click)="onMenuChange('commandes')"
                  [class]="'flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ' + (menu === 'commandes' ? 'bg-[#008a5d]/10 text-[#008a5d]' : 'text-gray-600 hover:bg-gray-50')"
                >
                  <img src="assets/icones/suivi.webp" class="w-6 h-6" alt="commandes">
                  Mes Commandes
                </button>
                <button 
                  (click)="onMenuChange('adresses')"
                  [class]="'flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ' + (menu === 'adresses' ? 'bg-[#008a5d]/10 text-[#008a5d]' : 'text-gray-600 hover:bg-gray-50')"
                >
                  <img src="assets/icones/home_address.webp" class="w-6 h-6" alt="adresses">
                  Mes Adresses
                </button>
                <button 
                  (click)="onMenuChange('paiements')"
                  [class]="'flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ' + (menu === 'paiements' ? 'bg-[#008a5d]/10 text-[#008a5d]' : 'text-gray-600 hover:bg-gray-50')"
                >
                  <img src="assets/icones/carte-bancaire-face-arrière.webp" class="w-6 h-6" alt="paiements">
                  Paiements
                </button>
                <button 
                  (click)="onMenuChange('favoris')"
                  [class]="'flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ' + (menu === 'favoris' ? 'bg-[#008a5d]/10 text-[#008a5d]' : 'text-gray-600 hover:bg-gray-50')"
                >
                  <img src="assets/icones/favoris.webp" class="w-6 h-6" alt="favoris">
                  Favoris
                </button>
                
                <div class="my-4 border-t border-gray-100 mx-4"></div>

                <button
                  *ngIf="estAdmin"
                  (click)="allerAdmin()"
                  class="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-amber-600 hover:bg-amber-50 transition-all"
                >
                  <img src="assets/icones/protect.webp" class="w-6 h-6" alt="admin">
                  Administration
                </button>
                <button
                  *ngIf="estProducteur"
                  (click)="allerProducteur()"
                  class="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  <img src="assets/icones/fournisseur.webp" class="w-6 h-6" alt="producteur">
                  Espace Producteur
                </button>
                <button
                  *ngIf="estModerateur"
                  (click)="allerModerateur()"
                  class="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <img src="assets/icones/warning-shield.webp" class="w-6 h-6" alt="moderateur">
                  Modération
                </button>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Informations Personnelles -->
            <div *ngIf="menu === 'infos'" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
              <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <img src="assets/icones/default_user.webp" class="w-8 h-8" alt="user">
                Informations Personnelles
              </h2>
              <form (submit)="onSauvegarderInfos($event)" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Nom complet</label>
                    <input 
                      type="text" 
                      [(ngModel)]="utilisateur.nom"
                      name="nom"
                      class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-medium"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Email</label>
                    <input 
                      type="email" 
                      [(ngModel)]="utilisateur.email"
                      name="email"
                      class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-medium"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Téléphone</label>
                    <input 
                      type="tel" 
                      [(ngModel)]="utilisateur.telephone"
                      name="telephone"
                      class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-medium"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">Adresse de résidence</label>
                    <input 
                      type="text" 
                      [(ngModel)]="utilisateur.adresse"
                      name="adresse"
                      class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-medium"
                    >
                  </div>
                </div>

                <button 
                  type="submit"
                  class="bg-[#008a5d] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#00704b] transition-all transform active:scale-95"
                >
                  Enregistrer les modifications
                </button>
              </form>
            </div>

            <!-- Commandes -->
            <div *ngIf="menu === 'commandes'" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
              <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <img src="assets/icones/suivi.webp" class="w-8 h-8" alt="order">
                Historique des commandes
              </h2>
              <div *ngIf="commandes.length === 0" class="text-center py-20 flex flex-col items-center">
                <img src="assets/icones/suivi.webp" class="w-20 h-20 opacity-20 mb-4" alt="empty">
                <p class="text-gray-500 text-lg font-bold">Aucune commande pour le moment</p>
                <button [routerLink]="['/catalogue']" class="mt-4 text-[#008a5d] font-bold hover:underline">Découvrir nos produits</button>
              </div>
              <div *ngIf="commandes.length > 0" class="space-y-4">
                <div *ngFor="let commande of commandes" class="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#008a5d]/30 transition-all group">
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <h3 class="font-bold text-gray-900 text-lg group-hover:text-[#008a5d] transition-colors">Commande #{{ commande.numero }}</h3>
                      <p class="text-sm text-gray-500 font-medium">{{ commande.dateCommande | date: 'longDate' }}</p>
                    </div>
                    <span [class]="'px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase ' + getStatusStyles(commande.statut)">
                      {{ commande.statut }}
                    </span>
                  </div>
                  <div class="border-t border-gray-50 pt-4 flex justify-between items-center">
                    <span class="text-gray-600 font-medium flex items-center gap-2">
                      <img src="assets/icones/all_product.webp" class="w-5 h-5 opacity-40" alt="items">
                      {{ commande.articles.length }} article(s)
                    </span>
                    <span class="font-black text-xl text-[#008a5d]">{{ commande.montantTotal | number }} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Adresses -->
            <div *ngIf="menu === 'adresses'" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <img src="assets/icones/home_address.webp" class="w-8 h-8" alt="address">
                  Mes Adresses
                </h2>
                <button (click)="ouvrirFormulaireAdresse()" class="flex items-center gap-2 text-[#008a5d] font-bold hover:underline">
                  <img src="assets/icones/add.webp" class="w-5 h-5" alt="add">
                  Ajouter une adresse
                </button>
              </div>

              <div *ngIf="modeEditionAdresse" class="mb-10 p-6 bg-[#008a5d]/5 rounded-3xl border-2 border-[#008a5d] animate-fadeIn">
                <h3 class="font-bold text-gray-900 mb-4">{{ indexAdresseEdition === -1 ? 'Nouvelle adresse' : 'Modifier l\\'adresse' }}</h3>
                <div class="space-y-4">
                  <input 
                    type="text" 
                    [(ngModel)]="adresseTemporaire" 
                    placeholder="Saisissez l'adresse complète (Ville, Quartier, Rue...)"
                    class="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#008a5d] focus:outline-none font-medium"
                  >
                  <div class="flex gap-3">
                    <button (click)="sauvegarderAdresse()" class="bg-[#008a5d] text-white px-6 py-3 rounded-2xl font-bold shadow-md active:scale-95 transition-all">Enregistrer</button>
                    <button (click)="annulerEditionAdresse()" class="bg-white text-gray-600 px-6 py-3 rounded-2xl font-bold border border-gray-200 active:scale-95 transition-all">Annuler</button>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border-2 border-[#008a5d] rounded-2xl p-6 bg-[#008a5d]/5 relative overflow-hidden group">
                  <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <img src="assets/icones/home_address.webp" class="w-24 h-24" alt="bg">
                  </div>
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-[#008a5d] flex items-center gap-2">
                      <img src="assets/icones/success.webp" class="w-4 h-4" alt="check">
                      Adresse Principale
                    </h3>
                    <button (click)="modifierAdresseProfil()" class="text-xs font-black text-[#008a5d] uppercase hover:underline">Modifier</button>
                  </div>
                  <p class="text-gray-700 font-bold leading-relaxed">{{ utilisateur.adresse || 'Veuillez définir une adresse' }}</p>
                </div>

                <div *ngFor="let adr of adressesSecondaires; let i = index" class="border border-gray-100 rounded-2xl p-6 bg-white relative overflow-hidden group hover:border-[#008a5d]/30 transition-all">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-gray-400">Adresse secondaire</h3>
                    <div class="flex gap-3">
                      <button (click)="definirPrincipale(i)" class="text-[10px] font-black text-[#008a5d] uppercase hover:underline">Par défaut</button>
                      <button (click)="modifierAdresseSecondaire(i)" class="text-[10px] font-black text-gray-400 uppercase hover:underline">Modifier</button>
                      <button (click)="supprimerAdresse(i)" class="text-[10px] font-black text-red-400 uppercase hover:underline">Supprimer</button>
                    </div>
                  </div>
                  <p class="text-gray-700 font-medium leading-relaxed">{{ adr }}</p>
                </div>

                <button *ngIf="!modeEditionAdresse" (click)="ouvrirFormulaireAdresse()" class="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:bg-gray-50 hover:border-[#008a5d] transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-[#008a5d] group">
                  <div class="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[#008a5d]/10 flex items-center justify-center transition-colors">
                    <img src="assets/icones/add.webp" class="w-6 h-6" alt="add">
                  </div>
                  <span class="font-bold">Ajouter une adresse</span>
                </button>
              </div>
            </div>

            <!-- Moyens de Paiement -->
            <div *ngIf="menu === 'paiements'" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <img src="assets/icones/carte-bancaire-face-arrière.webp" class="w-8 h-8" alt="payment">
                  Moyens de Paiement
                </h2>
                <button (click)="ouvrirFormulairePaiement()" class="flex items-center gap-2 text-gray-900 font-bold hover:underline">
                  <img src="assets/icones/add.webp" class="w-7 h-7" alt="add">
                  Nouveau compte
                </button>
              </div>

              <!-- Formulaire Mobile Money -->
              <div *ngIf="modeEditionPaiement" class="mb-10 p-8 bg-gray-50 rounded-3xl border-2 border-gray-200 animate-fadeIn">
                <h3 class="font-bold text-gray-900 mb-6">Ajouter un compte Mobile Money</h3>
                <div class="space-y-6">
                  <div class="flex gap-4">
                    <button 
                      (click)="nouveauComptePaiement.type = 'OM'"
                      [class]="'flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ' + (nouveauComptePaiement.type === 'OM' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white')"
                    >
                      <img src="assets/images/om_logo.webp" class="h-10 object-contain" alt="Orange Money">
                      <span class="font-bold text-xs uppercase tracking-widest" [class.text-orange-600]="nouveauComptePaiement.type === 'OM'">Orange Money</span>
                    </button>
                    <button 
                      (click)="nouveauComptePaiement.type = 'MOMO'"
                      [class]="'flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ' + (nouveauComptePaiement.type === 'MOMO' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-100 bg-white')"
                    >
                      <img src="assets/images/momo_logo.webp" class="h-10 object-contain" alt="MTN MoMo">
                      <span class="font-bold text-xs uppercase tracking-widest" [class.text-yellow-600]="nouveauComptePaiement.type === 'MOMO'">Mobile Money</span>
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="tel" 
                      [(ngModel)]="nouveauComptePaiement.numero" 
                      placeholder="Numéro de téléphone (ex: 699...)"
                      class="px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none font-bold"
                    >
                    <input 
                      type="text" 
                      [(ngModel)]="nouveauComptePaiement.nomProprietaire" 
                      placeholder="Nom complet du propriétaire"
                      class="px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none font-medium"
                    >
                  </div>

                  <div class="flex gap-3 pt-2">
                    <button (click)="sauvegarderPaiement()" class="flex-1 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold shadow-md active:scale-95 transition-all">Confirmer l'ajout</button>
                    <button (click)="annulerEditionPaiement()" class="bg-white text-gray-600 px-6 py-4 rounded-2xl font-bold border border-gray-200 active:scale-95 transition-all">Annuler</button>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div *ngIf="comptesPaiement.length === 0" class="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
                   <p class="text-gray-400 font-medium italic">Aucun moyen de paiement enregistré</p>
                </div>

                <div *ngFor="let compte of comptesPaiement; let i = index" class="border border-gray-100 rounded-3xl p-6 flex justify-between items-center bg-white hover:shadow-xl transition-all group border-l-8" [class.border-l-orange-500]="compte.type === 'OM'" [class.border-l-yellow-400]="compte.type === 'MOMO'">
                  <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-white rounded-2xl overflow-hidden flex items-center justify-center shadow-sm border border-gray-50">
                       <img [src]="compte.type === 'OM' ? 'assets/images/om_logo.webp' : 'assets/images/momo_logo.webp'" class="w-full h-full object-cover" alt="provider">
                    </div>
                    <div>
                      <h3 class="font-black text-gray-900 text-lg">{{ compte.type === 'OM' ? 'Orange Money' : 'MTN Mobile Money' }}</h3>
                      <p class="text-gray-900 font-bold tracking-widest">{{ compte.numero }}</p>
                      <p class="text-xs text-gray-400 font-medium uppercase mt-1">{{ compte.nomProprietaire }}</p>
                    </div>
                  </div>
                  <button (click)="supprimerPaiement(i)" class="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors font-black text-xs uppercase tracking-widest">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <!-- Favoris -->
            <div *ngIf="menu === 'favoris'" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
              <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <img src="assets/icones/favoris.webp" class="w-8 h-8" alt="wishlist">
                Mes Produits Favoris
              </h2>

              <div *ngIf="favoris.length === 0" class="text-center py-20 flex flex-col items-center">
                <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                   <img src="assets/icones/favoris.webp" class="w-12 h-12" alt="heart">
                </div>
                <p class="text-gray-900 text-xl font-bold mb-2">Votre liste est vide</p>
                <p class="text-gray-500 font-medium max-w-xs mx-auto">Ajoutez les produits qui vous plaisent pour les retrouver facilement plus tard.</p>
                <button [routerLink]="['/catalogue']" class="mt-8 bg-[#008a5d] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#00704b] transition-all">Parcourir le catalogue</button>
              </div>

              <div *ngIf="favoris.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div *ngFor="let fav of favoris" class="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                  <div class="relative h-48 overflow-hidden">
                    <img [src]="fav.image" [alt]="fav.nom" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <button (click)="retirerFavori(fav.id)" class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div class="p-6 flex-grow flex flex-col">
                    <div class="flex justify-between items-start mb-2">
                      <span class="text-xs font-black text-[#008a5d] uppercase tracking-tighter">{{ fav.categorie }}</span>
                      <span class="text-xs text-gray-400 font-medium italic">Ajouté le {{ fav.dateAjout | date: 'shortDate' }}</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-4 line-clamp-1">{{ fav.nom }}</h3>
                    <div class="mt-auto flex justify-between items-center">
                      <span class="font-black text-xl text-gray-900">{{ fav.prix | number }} FCFA</span>
                      <button [routerLink]="['/produit', fav.id]" class="p-3 bg-gray-900 text-white rounded-xl hover:bg-[#008a5d] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    .font-outfit { font-family: 'Outfit', sans-serif; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
  `]
})
export class ProfilComponent implements OnInit {
  menu: 'infos' | 'commandes' | 'adresses' | 'paiements' | 'favoris' = 'infos';
  utilisateur: any = {};
  commandes: Commande[] = [];
  favoris: ProduitFavori[] = [];

  // Gestion des adresses
  adressesSecondaires: string[] = ['Douala, Akwa, Rue Pau', 'Yaoundé, Bastos'];
  modeEditionAdresse = false;
  indexAdresseEdition = -1; 
  adresseTemporaire = '';

  // Gestion des paiements
  comptesPaiement: ComptePaiement[] = [
    { type: 'OM', numero: '699001122', nomProprietaire: 'AGRIMA USER' }
  ];
  modeEditionPaiement = false;
  nouveauComptePaiement: ComptePaiement = { type: 'OM', numero: '', nomProprietaire: '' };

  get estAdmin(): boolean {
    return this.utilisateur?.role === 'ROLE_MODERATEUR' || this.utilisateur?.role === 'ROLE_ADMIN';
  }

  get estProducteur(): boolean {
    return this.utilisateur?.role === 'ROLE_PRODUCTEUR';
  }

  get estModerateur(): boolean {
    return this.utilisateur?.role === 'ROLE_MODERATEUR';
  }

  constructor(
    private authService: AuthService,
    private commandeService: CommandeService,
    private favorisService: FavorisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.chargerUtilisateur();
    this.chargerCommandes();
    this.chargerFavoris();
  }

  chargerUtilisateur(): void {
    const user = this.authService.getUtilisateur() || {};
    if (user) {
      this.utilisateur = { ...user };
    }
  }

  chargerCommandes(): void {
    this.commandeService.getCommandes().subscribe({
      next: (commandes: any) => {
        this.commandes = Array.isArray(commandes) ? commandes : [];
      },
      error: () => {
        this.commandes = [];
      }
    });
  }

  chargerFavoris(): void {
    this.favorisService.favoris$.subscribe(favoris => {
      this.favoris = favoris;
    });
  }

  // --- LOGIQUE PAIEMENTS ---
  ouvrirFormulairePaiement(): void {
    this.modeEditionPaiement = true;
    this.nouveauComptePaiement = { type: 'OM', numero: '', nomProprietaire: this.utilisateur.nom || '' };
  }

  annulerEditionPaiement(): void {
    this.modeEditionPaiement = false;
  }

  sauvegarderPaiement(): void {
    if (!this.nouveauComptePaiement.numero || !this.nouveauComptePaiement.nomProprietaire) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    this.comptesPaiement.push({ ...this.nouveauComptePaiement });
    this.annulerEditionPaiement();
    alert("Nouveau moyen de paiement ajouté !");
  }

  supprimerPaiement(index: number): void {
    if (confirm("Supprimer ce moyen de paiement ?")) {
      this.comptesPaiement.splice(index, 1);
    }
  }

  // --- LOGIQUE ADRESSES ---
  ouvrirFormulaireAdresse(): void {
    this.modeEditionAdresse = true;
    this.indexAdresseEdition = -1;
    this.adresseTemporaire = '';
  }

  modifierAdresseProfil(): void {
    this.modeEditionAdresse = true;
    this.indexAdresseEdition = -2;
    this.adresseTemporaire = this.utilisateur.adresse || '';
  }

  modifierAdresseSecondaire(index: number): void {
    this.modeEditionAdresse = true;
    this.indexAdresseEdition = index;
    this.adresseTemporaire = this.adressesSecondaires[index];
  }

  sauvegarderAdresse(): void {
    if (!this.adresseTemporaire.trim()) return;

    if (this.indexAdresseEdition === -1) {
      this.adressesSecondaires.push(this.adresseTemporaire);
    } else if (this.indexAdresseEdition === -2) {
      this.utilisateur.adresse = this.adresseTemporaire;
    } else {
      this.adressesSecondaires[this.indexAdresseEdition] = this.adresseTemporaire;
    }

    this.annulerEditionAdresse();
    alert("Adresse enregistrée !");
  }

  annulerEditionAdresse(): void {
    this.modeEditionAdresse = false;
    this.indexAdresseEdition = -1;
    this.adresseTemporaire = '';
  }

  supprimerAdresse(index: number): void {
    if (confirm('Supprimer cette adresse ?')) {
      this.adressesSecondaires.splice(index, 1);
    }
  }

  definirPrincipale(index: number): void {
    const anciennePrincipale = this.utilisateur.adresse;
    this.utilisateur.adresse = this.adressesSecondaires[index];
    if (anciennePrincipale) {
      this.adressesSecondaires[index] = anciennePrincipale;
    } else {
      this.adressesSecondaires.splice(index, 1);
    }
    alert("L'adresse principale a été mise à jour.");
  }

  // --- AUTRES ---
  retirerFavori(id: number): void {
    if (confirm('Voulez-vous retirer ce produit de vos favoris ?')) {
      this.favorisService.retirerDesFavoris(id);
    }
  }

  onMenuChange(menu: 'infos' | 'commandes' | 'adresses' | 'paiements' | 'favoris'): void {
    this.menu = menu;
  }

  onSauvegarderInfos(event: any): void {
    event.preventDefault();
    alert("Vos informations ont été mises à jour avec succès !");
  }

  allerAdmin(): void {
    this.router.navigate(['/admin']);
  }

  allerProducteur(): void {
    this.router.navigate(['/producteur']);
  }

  allerModerateur(): void {
    this.router.navigate(['/moderateur']);
  }

  onDeconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/catalogue']);
  }

  getStatusStyles(statut: string): string {
    const styles: { [key: string]: string } = {
      'En attente': 'bg-amber-100 text-amber-700 border border-amber-200',
      'Confirmée': 'bg-blue-100 text-blue-700 border border-blue-200',
      'Expédiée': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      'Livrée': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      'Annulée': 'bg-red-100 text-red-700 border border-red-200'
    };
    return styles[statut] || 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}
