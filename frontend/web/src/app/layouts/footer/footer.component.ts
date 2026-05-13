import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-900 text-gray-300 mt-10">
      <!-- Services -->
      <div class="bg-gray-800 px-4 py-4">
        <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col items-center text-center gap-1.5">
            <span class="flex items-center justify-center w-10 h-10"><img width="34" height="34" src="assets/icones/livraison.webp" alt="delivery"/></span>
            <div>
              <h4 class="font-bold text-white">Livraison Rapide</h4>
              <p class="text-sm">En 24-48h partout</p>
            </div>
          </div>
          <div class="flex flex-col items-center text-center gap-1.5">
            <span class="flex items-center justify-center w-10 h-10"><img width="34" height="34" src="assets/icones/protect.webp" alt="secured-payment"/></span>
            <div>
              <h4 class="font-bold text-white">Paiement Sécurisé</h4>
              <p class="text-sm">100% protégé</p>
            </div>
          </div>
          <div class="flex flex-col items-center text-center gap-1.5">
            <span class="flex items-center justify-center w-10 h-10"><img width="34" height="34" src="assets/icones/support.webp" alt="online-support--v5"/></span>
            <div>
              <h4 class="font-bold text-white">Support 24/7</h4>
              <p class="text-sm">À votre service</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-5 gap-6 mb-6">
          <div>
            <h4 class="text-white font-bold mb-4">À propos</h4>
            <ul class="space-y-1.5 text-sm">
              <li><a href="#" class="hover:text-alibaba-red">Qui sommes-nous</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Nos valeurs</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Carrières</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-3">Service Client</h4>
            <ul class="space-y-1.5 text-sm">
              <li><a href="#" class="hover:text-alibaba-red">Centre d'aide</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Contact</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Retours & échanges</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Livraison</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-3">Vendeurs</h4>
            <ul class="space-y-1.5 text-sm">
              <li><a href="#" class="hover:text-alibaba-red">Devenir vendeur</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Outils de vente</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Pub & marketing</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Ressources</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4">Légal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-alibaba-red">Conditions d'utilisation</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Politique de confidentialité</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Cookies</a></li>
              <li><a href="#" class="hover:text-alibaba-red">Mentions légales</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4">Connectez-vous</h4>
            <div class="space-y-3">
              <p class="text-sm mb-3">Suivez-nous sur les réseaux</p>
              <div class="flex gap-3 text-2xl">
                <a href="#" class="hover:text-alibaba-red"><img width="30" height="30" src="https://img.icons8.com/3d-fluency/94/facebook-logo.webp" alt="facebook-logo"/></a>
                <a href="#" class="hover:text-alibaba-red"><img width="30" height="30" src="https://img.icons8.com/3d-fluency/94/linkedin--v2.webp" alt="linkedin--v2"/></a>
                <a href="#" class="hover:text-alibaba-red"><img width="30" height="30" src="https://img.icons8.com/3d-fluency/94/instagram-new.webp" alt="instagram-new"/></a>
                <a href="#" class="hover:text-alibaba-red"><img width="30" height="30" src="https://img.icons8.com/3d-fluency/94/youtube-play.webp" alt="youtube-play"/></a>
              </div>
            </div>
          </div>
        </div>

        <!-- Bas de page -->
        <div class="border-t border-gray-700 pt-5 flex justify-between items-center text-sm">
          <div>
            <select class="bg-gray-800 text-gray-300 border border-gray-600 rounded px-2 py-1">
              <option>Français</option>
              <option>العربية</option>
              <option>English</option>
            </select>
          </div>
          <div>© 2026 AGRIMA. Tous droits réservés.</div>
          <div class="flex gap-3">
            <span>cm Cameroun</span>
            <span>Accepte: <img width="24" height="24" src="assets/images/om_logo.webp" alt="Orange Money" class="inline mx-1"/> Orange Money | <img width="24" height="24" src="assets/images/momo_logo.webp" alt="MTN MoMo" class="inline mx-1"/> MTN MoMo</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }
