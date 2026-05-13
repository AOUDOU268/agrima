import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PanierService } from '../../services/panier.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,
    MatBadgeModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule
  ],
  template: `
    <header class="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
      <!-- Barre supérieure
      <div class="bg-gray-100 text-sm text-gray-600 px-4 py-2">
        <div class="container mx-auto flex justify-between">
          <div class="flex gap-6">
            <span><img width="24" height="24" src="assets/icones/whatsapp.webp" alt="telephone" class="inline-block align-middle mr-1"/> Support: +237 655147477</span>
            <span><img width="24" height="24" src="assets/icones/place_marker.webp" alt="location" class="inline-block align-middle mr-1"/> Livraison gratuite à partir de 500 FCFA</span>
          </div>
          <div class="flex gap-4">
            <a href="#" class="hover:text-alibaba-red">Vendez avec nous</a>
            <a href="#" class="hover:text-alibaba-red">Centre d'aide</a>
          </div>
        </div>
      </div>
      -->
      <!-- Barre de navigation principale -->
      <div class="relative z-20">
        <div class="container mx-auto mb-2 mt-2 px-4 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
            <img width="40" height="40" src="assets/images/logo.webp" alt="logo-agrima" class="rounded-full shadow-sm"/>
            <span class="text-2xl font-black italic tracking-tighter text-[#008a5d] font-outfit">AGRIMA</span>
          </div>

          <!-- Barre de recherche compacte dans le header -->
          <div class="flex-1 mx-8 mb-0 transition-all duration-500 ease-out">
            <div *ngIf="isSearchPage && showStickySearch" class="compact-gradient-border transition-all duration-500 ease-out opacity-100">
              <div class="compact-gradient-inner flex items-center">
                <input
                  type="text"
                  [(ngModel)]="rechercheTerme"
                  placeholder="Recherche produits, vendeurs..."
                  class="flex-1 px-4 py-1.5 bg-transparent focus:outline-none"
                  (keyup)="effectuerRecherche()"
                />
                <div class="image-search-wrapper">
                  <button
                    class="flex items-center justify-center px-3 py-1.5 focus:outline-none focus:ring-0 transition-colors duration-300"
                    type="button"
                    (click)="toggleImageSearchMenu()"
                  >
                    <img width="26" height="26" src="assets/icones/camera.webp" alt="camera"/>
                  </button>
                  <div *ngIf="showImageSearchMenu" class="image-search-dropdown">
                    <button class="image-search-option" (click)="ouvrirCamera()">
                      <img width="24" height="24" src="assets/icones/camera.webp" alt="camera"/>
                      <span>Caméra</span>
                    </button>
                    <button class="image-search-option" (click)="ouvrirImportPhoto()">
                      <img width="24" height="24" src="assets/icones/importer_image.webp" alt="gallery"/>
                      <span>Importer une photo</span>
                    </button>
                  </div>
                </div>
                <button
                  class="search-action-btn search-action-btn-compact"
                  type="button"
                  (click)="effectuerRecherche()"
                >
                  <img width="22" height="22" src="assets/icones/chercher.webp" alt="search"/>
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Actions utilisateur -->
          <div class="flex gap-6 items-center">
            <!-- Favoris -->
            <button [routerLink]="['/favoris']" class="relative hover:text-alibaba-red flex flex-col items-center">
              <img width="30" height="30" src="assets/icones/favoris.webp" alt="like--v1"/>
              <span class="text-xs">Favoris</span>
            </button>

            <!-- Suivi -->
            <button [routerLink]="['/suivi-commande']" class="relative hover:text-alibaba-red flex flex-col items-center">
              <img width="30" height="30" src="assets/icones/suivi.webp" alt="track-order"/>
              <span class="text-xs">Suivi</span>
            </button>

            <!-- Panier -->
            <button [routerLink]="['/panier']" class="relative hover:text-alibaba-red flex flex-col items-center">
              <img width="30" height="30" src="assets/icones/panier.webp" alt="shopping-cart"/> <span class="text-xs">Panier</span>
              <span class="absolute -top-2 -right-2 bg-alibaba-red text-white rounded-full w-5 h-5 text-xs flex items-center justify-center" 
                    *ngIf="nombreArticles > 0">
                {{nombreArticles}}
              </span>
            </button>

            <!-- Séparateur -->
            <div class="w-px h-8 bg-gray-300"></div>

            <!-- Connexion / Profil -->
            <div *ngIf="!utilisateur">
              <button (click)="ouvrirConnexion()" class="flex items-center gap-2 hover:text-alibaba-red font-semibold text-sm">
                <img width="30" height="30" src="assets/icones/default_user.webp" alt="user-male-circle"/> Connexion
              </button>
            </div>
            <div *ngIf="utilisateur" class="flex items-center gap-4">
              <div class="flex flex-col items-end">
                <span class="text-sm font-semibold">{{utilisateur.nom}}</span>
                <span class="text-xs text-gray-500">Premium</span>
              </div>
              <button [routerLink]="['/profil']" class="text-alibaba-red hover:underline text-sm font-semibold">Profil</button>
              <button (click)="seDeconnecter()" class="text-red-500 hover:text-red-700 text-sm">Déconnexion</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu catégories -->
      <div class="border-t border-gray-100 relative z-10" (mouseleave)="showAppInfo = false; showVendeurInfo = false">
        <div class="container mx-auto px-4 flex justify-between items-center text-gray-700 h-12">
          <div class="flex gap-8 h-full items-center">
            <a [routerLink]="['/catalogue']" class="hover:text-alibaba-red flex items-center gap-2 h-full"><img width="30" height="30" src="assets/icones/all_product.webp" alt="open-box"/>Tous les produits</a>
            <a [routerLink]="['/catalogue']" [queryParams]="{ type: 'Fruits & Légumes' }" class="hover:text-alibaba-red flex items-center gap-2 h-full"><img width="30" height="30" src="assets/icones/fruit_et_legume.webp" alt="natural-food"/> Fruits & Légumes</a>
            <a [routerLink]="['/catalogue']" [queryParams]="{ type: 'Produits Laitiers' }" class="hover:text-alibaba-red flex items-center gap-2 h-full"><img width="30" height="30" src="assets/icones/lait.webp" alt="milk-bottle"/> Produits Laitiers</a>
            <a [routerLink]="['/catalogue']" [queryParams]="{ type: 'Produits Secs' }" class="hover:text-alibaba-red flex items-center gap-2 h-full"><img width="30" height="30" src="assets/icones/produit_sec.webp" alt="seeds"/> Produits Secs</a>
            <a [routerLink]="['/catalogue']" [queryParams]="{ type: 'Bio & Écologique' }" class="hover:text-alibaba-red flex items-center gap-2 h-full"><img width="30" height="30" src="assets/icones/produit_bio.webp" alt="hand-planting"/> Bio & Écologique</a>
          </div>
          <div class="flex gap-8 h-full items-center">
            <!-- Trigger Application -->
            <div class="h-full flex items-center" (mouseenter)="showAppInfo = true; showVendeurInfo = false">
              <a href="javascript:void(0)" class="hover:text-alibaba-red flex items-center gap-2 h-full">
                <img width="30" height="30" src="assets/icones/smartphone-et-tablette.webp" alt="smartphone-tablet"/>
                Application
              </a>
            </div>

            <!-- Trigger Vendez avec nous -->
            <div class="h-full flex items-center" (mouseenter)="showVendeurInfo = true; showAppInfo = false">
              <a href="javascript:void(0)" class="hover:text-alibaba-red flex items-center gap-2 h-full">
                <img width="30" height="30" src="assets/icones/vendez avec nous.webp" alt="handshake--v1"/>
                Vendez avec nous
              </a>
            </div>
          </div>
        </div>

        <!-- Mega Menu Application (Ancré à la barre entière) -->
        <div *ngIf="showAppInfo" class="absolute top-full left-0 right-0 bg-white shadow-2xl z-[100] border-t border-gray-100 animate-dropdownFadeIn overflow-hidden" (mouseenter)="showAppInfo = true">
          <div class="container mx-auto px-4 py-4 flex gap-8 items-center justify-between">
            <div class="flex-1 max-w-lg">
              <h4 class="font-bold text-xl text-gray-900 mb-1">L'expérience AGRIMA dans votre poche</h4>
              <p class="text-gray-600 text-sm">Suivez vos commandes, recevez des notifications et profitez d'offres exclusives.</p>
            </div>
            <div class="flex items-center gap-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div class="flex items-center gap-3">
                <img width="80" height="80" src="assets/icones/code_qr.webp" alt="QR Code" class="rounded-lg bg-white p-1 shadow-sm"/>
                <p class="text-xs font-bold text-gray-700 w-24">Scannez pour télécharger</p>
              </div>
              <div class="h-10 w-px bg-gray-300"></div>
              <div class="flex gap-2">
                <img width="120" src="assets/icones/google.webp" alt="Play Store" class="cursor-pointer hover:scale-105 transition-transform"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Mega Menu Vendeur (Ancré à la barre entière) -->
        <div *ngIf="showVendeurInfo" class="absolute top-full left-0 right-0 bg-white shadow-2xl z-[100] border-t border-gray-100 animate-dropdownFadeIn overflow-hidden" (mouseenter)="showVendeurInfo = true">
          <div class="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
            <div class="max-w-xs">
              <h4 class="font-bold text-xl text-gray-900 mb-1">Devenez Vendeur d'Elite</h4>
              <p class="text-gray-500 text-xs mb-3">Vendez vos produits partout au Cameroun.</p>
              <button [routerLink]="['/vendez-avec-nous']" class="px-6 py-2 bg-alibaba-red text-white rounded-full text-sm font-bold hover:bg-red-700 transition-all shadow-md">
                Ouvrir ma boutique
              </button>
            </div>
            <div class="flex-1 grid grid-cols-3 gap-4">
              <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div class="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 flex-shrink-0">
                  <img width="18" height="18" src="assets/icones/success.webp" alt="growth"/>
                </div>
                <div class="overflow-hidden">
                  <p class="font-bold text-gray-800 text-sm truncate">Croissance</p>
                  <p class="text-[10px] text-gray-500 line-clamp-1">Nouveaux clients</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div class="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 flex-shrink-0">
                  <img width="18" height="18" src="assets/icones/livraison.webp" alt="shipping"/>
                </div>
                <div class="overflow-hidden">
                  <p class="font-bold text-gray-800 text-sm truncate">Logistique</p>
                  <p class="text-[10px] text-gray-500 line-clamp-1">Gestion complète</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div class="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600 flex-shrink-0">
                  <img width="18" height="18" src="assets/icones/favoris.webp" alt="support"/>
                </div>
                <div class="overflow-hidden">
                  <p class="font-bold text-gray-800 text-sm truncate">Support 24/7</p>
                  <p class="text-[10px] text-gray-500 line-clamp-1">Aide experte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre de recherche sectionnelle -->
      <div *ngIf="isSearchPage" 
           class="container mx-auto w-full max-w-5xl px-4 overflow-hidden transition-all duration-500 ease-in-out" 
           [ngClass]="{
             'max-h-[260px] opacity-100 pb-4 pt-1 translate-y-0': isAtTop && !showStickySearch,
             'max-h-0 opacity-0 pb-0 pt-0 -translate-y-4 pointer-events-none': !isAtTop || showStickySearch
           }">
        <div class="search-gradient-border transform transition-all duration-500 ease-out" [class.-translate-y-4]="showStickySearch" [class.opacity-0]="showStickySearch" [class.opacity-100]="!showStickySearch">
          <div class="search-gradient-inner">
            <div class="flex flex-col gap-4">
              <input
                type="text"
                [(ngModel)]="rechercheTerme"
                placeholder="Recherche produits, vendeurs..."
                class="w-full px-4 py-2 border-none rounded-full focus:outline-none focus:ring-0"
                (keyup)="effectuerRecherche()"
              />
              <div class="flex items-center justify-between gap-4 flex-wrap">
                <div class="image-search-wrapper">
                  <button
                    class="flex items-center gap-2 border-none rounded-full px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 transition-colors duration-300"
                    type="button"
                    (click)="toggleImageSearchMenu()"
                  >
                    <img width="30" height="30" src="assets/icones/camera.webp" alt="camera"/> Rechercher par image
                  </button>
                  <div *ngIf="showImageSearchMenu" class="image-search-dropdown">
                    <button class="image-search-option" (click)="ouvrirCamera()">
                      <img width="24" height="24" src="assets/icones/camera.webp" alt="camera"/>
                      <span>Caméra</span>
                    </button>
                    <button class="image-search-option" (click)="ouvrirImportPhoto()">
                      <img width="24" height="24" src="assets/icones/importer_image.webp" alt="gallery"/>
                      <span>Importer une photo</span>
                    </button>
                  </div>
                </div>
                <input
                  #fileInput
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,image/tiff"
                  class="hidden"
                  (change)="onPhotoImportee($event)"
                />
                <button
                  class="search-action-btn search-action-btn-main"
                  type="button"
                  (click)="effectuerRecherche()"
                >
                  <img width="24" height="24" src="assets/icones/chercher.webp" alt="search"/> Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Modal Caméra -->
    <div *ngIf="showCameraModal" class="camera-modal-overlay" (click)="fermerCamera()">
      <div class="camera-modal" (click)="$event.stopPropagation()">
        <div class="camera-modal-header">
          <h3>Caméra</h3>
          <button class="camera-close-btn" (click)="fermerCamera()">&times;</button>
        </div>
        <div class="camera-video-container">
          <video #cameraVideo autoplay playsinline class="camera-video"></video>
        </div>
        <div class="camera-actions">
          <button class="camera-capture-btn" (click)="capturerPhoto()">
            <img width="24" height="24" src="assets/icones/camera.webp" alt="capture"/>
            Capturer
          </button>
          <button class="camera-cancel-btn" (click)="fermerCamera()">
            Annuler
          </button>
        </div>
      </div>
    </div>
    <canvas #captureCanvas class="hidden"></canvas>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    .font-outfit { font-family: 'Outfit', sans-serif; }
    
    header {
      transition: all 0.3s ease;
    }
    .animate-dropdownFadeIn {
      animation: dropdownFadeIn 0.2s ease-out forwards;
    }
    .search-gradient-border {
      position: relative;
      border-radius: 1.5rem;
      padding: 2px;
      isolation: isolate;
    }

    .search-gradient-border::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(
        90deg,
        #00a14b,
        #00bcd4,
        #1619cfff,
        #ffc107,
        #ffeb3b,
        #00a14b,
        #00bcd4,
        #1619cfff,
        #ffc107,
        #ffeb3b,
        #00a14b
      );
      background-size: 200% 100%;
      animation: flowGradient 3s linear infinite;
      z-index: -1;
      border-radius: 1.5rem;
    }

    .search-gradient-inner {
      background: white;
      border-radius: calc(1.5rem - 2px);
      padding: 1rem;
      position: relative;
      z-index: 1;
    }

    .compact-gradient-border {
      position: relative;
      border-radius: 9999px;
      padding: 2px;
      overflow: visible;
      isolation: isolate;
    }

    .compact-gradient-border::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(
        90deg,
        #00a14b,
        #00bcd4,
        #1619cfff,
        #ffc107,
        #ffeb3b,
        #00a14b,
        #00bcd4,
        #1619cfff,
        #ffc107,
        #ffeb3b,
        #00a14b
      );
      background-size: 200% 100%;
      animation: flowGradient 3s linear infinite;
      z-index: -1;
      border-radius: 9999px;
    }

    .compact-gradient-inner {
      background: #f3f4f6;
      border-radius: 9999px;
      position: relative;
      z-index: 1;
      overflow: visible;
    }

    @keyframes flowGradient {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: -200% 50%;
      }
    }

    /* Dropdown recherche par image */
    .image-search-wrapper {
      position: relative;
    }

    .image-search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: white;
      border-radius: 10px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      padding: 8px;
      min-width: 220px;
      z-index: 1100;
      animation: dropdownFadeIn 0.2s ease-out;
    }

    .image-search-option {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: transparent;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      transition: background 0.2s;
    }

    .image-search-option:hover {
      background: #f0fdf4;
      color: #00a14b;
    }

    .search-action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 700;
      color: #00a14b;
      background: #EDFDF3;
      box-shadow: 0 6px 14px rgba(0, 161, 75, 0.12);
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    }

    .search-action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(0, 161, 75, 0.24);
      filter: saturate(1.05);
    }

    .search-action-btn:focus-visible {
      outline: 2px solid rgba(0, 161, 75, 0.35);
      outline-offset: 2px;
    }

    .search-action-btn-compact {
      min-height: 2rem;
      padding: 0.35rem 0.8rem;
      margin-right: 0.2rem;
    }

    .search-action-btn-main {
      min-height: 2.4rem;
      padding: 0.5rem 1rem;
      width: 50%;
      max-width: 150px;
      height: 2.4rem;
    }

    @keyframes dropdownFadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Modal caméra */
    .camera-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: dropdownFadeIn 0.25s ease-out;
    }

    .camera-modal {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 560px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .camera-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .camera-modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .camera-close-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #6b7280;
      line-height: 1;
      padding: 0 4px;
    }
    .camera-close-btn:hover {
      color: #ef4444;
    }

    .camera-video-container {
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .camera-video {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
    }

    .camera-actions {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      justify-content: center;
      border-top: 1px solid #e5e7eb;
    }

    .camera-capture-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #00a14b;
      color: white;
      border: none;
      border-radius: 9999px;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .camera-capture-btn:hover {
      background: #008f40;
    }

    .camera-cancel-btn {
      background: #f3f4f6;
      color: #374151;
      border: none;
      border-radius: 9999px;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .camera-cancel-btn:hover {
      background: #e5e7eb;
    }

    .hidden {
      display: none;
    }
  `]
})
export class HeaderComponent implements OnInit {
  rechercheTerme = '';
  showStickySearch = false;
  isSearchPage = false;
  utilisateur: any;
  nombreArticles = 0;
  showImageSearchMenu = false;
  showCameraModal = false;
  showAppInfo = false;
  showVendeurInfo = false;
  private cameraStream: MediaStream | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cameraVideo') cameraVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('captureCanvas') captureCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private panierService: PanierService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.utilisateur$.subscribe(user => {
      this.utilisateur = user;
    });

    this.panierService.articles$.subscribe(articles => {
      this.nombreArticles = articles.reduce((total, a) => total + a.quantite, 0);
    });

    this.updateRouteVisibility(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRouteVisibility(event.urlAfterRedirects);
      }
    });
  }

  isAtTop = true;
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    this.isAtTop = currentScroll === 0;
    
    if (!this.isSearchPage) {
      this.showStickySearch = false;
      return;
    }

    const threshold = 120; // Seuil réduit pour moins de vide
    
    // Si on scrolle vers le haut
    if (currentScroll < this.lastScrollTop) {
      if (currentScroll === 0) {
        this.showStickySearch = false; // On ne cache la sticky qu'au sommet pour laisser la place à la sectionnelle
      } else if (currentScroll > threshold) {
        this.showStickySearch = true; // On la garde visible pendant qu'on remonte tant qu'on n'est pas au sommet
      }
    } 
    // Si on scrolle vers le bas
    else if (currentScroll > threshold) {
      this.showStickySearch = true;
    }
    else {
      this.showStickySearch = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  private updateRouteVisibility(url: string): void {
    this.isSearchPage = url.startsWith('/catalogue');
    if (!this.isSearchPage) {
      this.showStickySearch = false;
    }
  }

  effectuerRecherche(): void {
    if (this.rechercheTerme.trim()) {
      this.router.navigate(['/catalogue'], { queryParams: { q: this.rechercheTerme } });
    }
  }

  ouvrirConnexion(): void {
    this.router.navigate(['/connexion']);
  }

  seDeconnecter(): void {
    this.authService.seDeconnecter();
    this.router.navigate(['/catalogue']);
  }

  // ---- Recherche par image ----
  toggleImageSearchMenu(): void {
    this.showImageSearchMenu = !this.showImageSearchMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.image-search-wrapper')) {
      this.showImageSearchMenu = false;
    }
  }

  ouvrirCamera(): void {
    this.showImageSearchMenu = false;
    this.showCameraModal = true;
    setTimeout(() => this.demarrerCamera(), 100);
  }

  private async demarrerCamera(): Promise<void> {
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (this.cameraVideo) {
        this.cameraVideo.nativeElement.srcObject = this.cameraStream;
      }
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      this.fermerCamera();
    }
  }

  capturerPhoto(): void {
    if (!this.cameraVideo || !this.captureCanvas) return;
    const video = this.cameraVideo.nativeElement;
    const canvas = this.captureCanvas.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Photo capturée:', blob);
          // TODO: Envoyer le blob pour la recherche par image
        }
        this.fermerCamera();
      }, 'image/jpeg');
    }
  }

  fermerCamera(): void {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    this.showCameraModal = false;
  }

  ouvrirImportPhoto(): void {
    this.showImageSearchMenu = false;
    this.fileInput.nativeElement.click();
  }

  onPhotoImportee(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const fichier = input.files[0];
      console.log('Photo importée:', fichier.name, fichier.type, fichier.size);
      // TODO: Envoyer le fichier pour la recherche par image
    }
    input.value = '';
  }
}
