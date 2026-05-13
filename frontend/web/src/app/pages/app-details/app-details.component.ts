import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-shell">
      <div class="page-container">
        <!-- En-tête -->
        <div class="page-header">
          <h1>À propos d'AGRIMA</h1>
          <p>Téléchargez notre application mobile et restez connecté</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Colonne gauche: Détails -->
          <div class="space-y-6">
            <!-- Section principale -->
            <div class="section-card">
              <div class="flex items-center gap-4 mb-6">
                <img src="assets/images/logo.webp" alt="AGRIMA Logo" class="w-24 h-24 rounded-lg shadow-lg">
                <div>
                  <h2 class="text-2xl font-black text-slate-900">AGRIMA</h2>
                  <p class="text-sm text-slate-600">Version 1.0.0</p>
                  <p class="text-sm text-emerald-700 font-semibold">✓ Disponible sur iOS et Android</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <h3 class="font-bold text-slate-900 mb-2">À propos</h3>
                  <p class="text-slate-600 leading-relaxed">
                    AGRIMA est la plateforme numérique innovante qui connecte producteurs, 
                    livreurs et consommateurs. Découvrez des produits frais directement du 
                    producteur à votre porte avec une traçabilité complète.
                  </p>
                </div>

                <div>
                  <h3 class="font-bold text-slate-900 mb-3">Fonctionnalités principales</h3>
                  <ul class="space-y-2">
                    <li class="flex items-start gap-3">
                      <span class="text-emerald-700 font-bold mt-1">✓</span>
                      <span class="text-slate-600">Catalogue produits en temps réel</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-emerald-700 font-bold mt-1">✓</span>
                      <span class="text-slate-600">Suivi des commandes en direct</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-emerald-700 font-bold mt-1">✓</span>
                      <span class="text-slate-600">Paiements sécurisés multiples</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-emerald-700 font-bold mt-1">✓</span>
                      <span class="text-slate-600">Notifications instantanées</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-emerald-700 font-bold mt-1">✓</span>
                      <span class="text-slate-600">Programme de fidélité</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="text-emerald-700 font-bold mt-1">✓</span>
                      <span class="text-slate-600">Historique d'achats complet</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Informations système -->
            <div class="section-card">
              <h3 class="font-bold text-slate-900 mb-4">Informations système</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between pb-3 border-b border-slate-100">
                  <span class="text-slate-600">Version de l'app</span>
                  <span class="font-semibold text-slate-900">1.0.0</span>
                </div>
                <div class="flex justify-between pb-3 border-b border-slate-100">
                  <span class="text-slate-600">Date de sortie</span>
                  <span class="font-semibold text-slate-900">21 avril 2026</span>
                </div>
                <div class="flex justify-between pb-3 border-b border-slate-100">
                  <span class="text-slate-600">Compatibilité iOS</span>
                  <span class="font-semibold text-slate-900">14.0 et plus</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Compatibilité Android</span>
                  <span class="font-semibold text-slate-900">8.0 et plus</span>
                </div>
              </div>
            </div>

            <!-- Avantages -->
            <div class="hero-section">
              <h3 class="font-bold text-slate-900 mb-3">Pourquoi AGRIMA?</h3>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2">
                  <span class="text-lg">🌱</span>
                  <span>Produits frais et biologiques</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-lg">⚡</span>
                  <span>Livraison rapide et fiable</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-lg">💚</span>
                  <span>Support direct du producteur local</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-lg">🔒</span>
                  <span>Paiements sécurisés et garantis</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Colonne droite: Code QR -->
          <div class="space-y-6">
            <!-- Card Code QR -->
            <div class="section-card sticky top-24">
              <div class="text-center space-y-6">
                <div>
                  <h3 class="font-bold text-slate-900 mb-2">Télécharger l'application</h3>
                  <p class="text-sm text-slate-600">Scannez le code QR avec votre téléphone</p>
                </div>

                <!-- Code QR -->
                <div class="bg-white p-6 rounded-lg border-2 border-emerald-100 flex justify-center">
                  <canvas 
                    #qrCanvas 
                    class="max-w-full"
                  ></canvas>
                </div>

                <p class="text-xs text-slate-500">Valide pour iOS et Android</p>

                <!-- Bouttons de téléchargement -->
                <div class="space-y-3 pt-4">
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank"
                    class="btn-action btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <img src="assets/icones/apple.webp" alt="Apple" class="w-5 h-5" style="filter: brightness(0) invert(1);">
                    App Store
                  </a>
                  <a 
                    href="https://play.google.com" 
                    target="_blank"
                    class="btn-action btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <img src="assets/icones/google-play.webp" alt="Google Play" class="w-5 h-5">
                    Google Play
                  </a>
                </div>
              </div>
            </div>

            <!-- Statistiques -->
            <div class="grid grid-cols-2 gap-4">
              <div class="stat-card text-center">
                <p class="stat-value text-emerald-700">50K+</p>
                <p class="stat-label">Téléchargements</p>
              </div>
              <div class="stat-card text-center">
                <p class="stat-value text-emerald-700">4.8★</p>
                <p class="stat-label">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section contact -->
        <div class="mt-12 section-card">
          <div class="text-center space-y-4">
            <h3 class="font-bold text-lg text-slate-900">Besoin d'aide?</h3>
            <p class="text-slate-600">Contactez notre équipe support</p>
            <div class="flex justify-center gap-4 flex-wrap">
              <a href="mailto:support@agrima.cm" class="btn-action btn-ghost">
                📧 Email
              </a>
              <a href="https://wa.me/237655147477" target="_blank" class="btn-action btn-secondary">
                💬 WhatsApp
              </a>
              <a href="tel:+237655147477" class="btn-action btn-ghost">
                📞 Appel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AppDetailsComponent implements OnInit {
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.generateQRCode();
  }

  generateQRCode(): void {
    // Charger la librairie QRCode dynamiquement
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = () => {
      this.createQRCode();
    };
    document.head.appendChild(script);
  }

  private createQRCode(): void {
    if (!this.qrCanvas) return;

    const canvas = this.qrCanvas.nativeElement;
    const qrAppUrl = 'https://agrima.cm/app'; // URL de l'application

    // Créer le code QR
    new (window as any).QRCode({
      text: qrAppUrl,
      width: 250,
      height: 250,
      colorDark: '#059669',
      colorLight: '#ffffff',
      correctLevel: (window as any).QRCode.CorrectLevel.H,
      useSVG: false,
      render: (canvas: HTMLCanvasElement) => {
        const ctx = this.qrCanvas.nativeElement.getContext('2d');
        if (ctx && canvas) {
          ctx.drawImage(canvas, 0, 0);
        }
      }
    });
  }
}
