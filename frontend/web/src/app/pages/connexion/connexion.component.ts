import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container h-screen w-full overflow-hidden font-outfit bg-white relative">
      
      <!-- Logo Global (Header) -->
      <div class="absolute top-8 left-10 flex items-center gap-3 z-50 pointer-events-auto cursor-pointer" routerLink="/">
        <img src="assets/images/logo.webp" alt="Logo" class="w-12 h-12 rounded-full shadow-lg">
        <span class="text-2xl font-black text-[#008a5d] italic tracking-tighter">AGRIMA</span>
      </div>

      <!-- CONTENEUR DES COLONNES ANIMÉES -->
      <div class="relative w-full h-full flex flex-col lg:block">
        
        <!-- PARTIE ILLUSTRATION -->
        <div 
          class="hidden lg:flex absolute top-0 h-full w-3/5 bg-gray-50 items-center justify-center p-12 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-10"
          [style.left]="isRegisterMode() ? '40%' : '0%'"
          [style.border-left]="isRegisterMode() ? '1px solid #f3f4f6' : 'none'"
          [style.border-right]="isRegisterMode() ? 'none' : '1px solid #f3f4f6'"
        >
          <div class="absolute inset-0 z-0 opacity-10 bg-grid-pattern"></div>
          <div class="relative z-10 w-full max-w-2xl animate-fadeIn mt-20">
            <img src="assets/images/auth_bg.webp" alt="Agrima Map" class="w-full h-auto rounded-3xl shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
            <div class="mt-12 text-center">
              <h2 class="text-4xl font-black text-gray-900 mb-4 tracking-tight">Le Sourcing B2B Réinventé</h2>
              <p class="text-lg text-gray-600 max-xl mx-auto leading-relaxed">
                {{ isRegisterMode() ? 'Rejoignez le réseau des leaders de l’agrobusiness au Cameroun.' : 'Connectez-vous à la plus grande plateforme de distribution agricole.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- PARTIE FORMULAIRE -->
        <div 
          class="w-full lg:w-2/5 h-full flex flex-col justify-between py-12 px-8 sm:px-16 lg:px-20 bg-white relative lg:absolute top-0 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-20 shadow-2xl"
          [style.left]="isRegisterMode() ? '0%' : '60%'"
        >
          <div class="flex-grow flex flex-col justify-center">
            <div class="max-w-md w-full mx-auto">
              
              <!-- MODE SOCIAL -->
              <div *ngIf="mode === 'social-login' || mode === 'social-register'" class="animate-fadeIn">
                <div class="text-center mb-8">
                  <h1 class="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                    {{ mode === 'social-login' ? 'Connectez-vous' : 'Créez un compte' }}
                  </h1>
                  <p class="text-gray-500 text-sm font-medium">
                    {{ mode === 'social-login' ? 'Utilisez votre dernier moyen de connexion' : 'Choisissez une méthode pour rejoindre Agrima' }}
                  </p>
                </div>

                <div class="space-y-3">
                  <button class="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-all hover:border-gray-300 group">
                    <img src="assets/icones/google.webp" alt="Google" class="w-6 h-6 group-hover:scale-110 transition-transform">
                    <span class="font-bold text-gray-800">Continuer avec Google</span>
                  </button>

                  <div class="flex items-center gap-4 py-1">
                    <div class="flex-grow h-px bg-gray-100"></div>
                    <span class="text-[10px] text-gray-400 font-black tracking-[0.2em]">OU</span>
                    <div class="flex-grow h-px bg-gray-100"></div>
                  </div>

                  <button class="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-all hover:border-gray-300 group">
                    <img src="assets/icones/facebook.webp" alt="Facebook" class="w-6 h-6 group-hover:scale-110 transition-transform">
                    <span class="font-bold text-gray-800">Continuer avec Facebook</span>
                  </button>

                  <button class="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-all hover:border-gray-300 group">
                    <img src="assets/icones/linkedin.webp" alt="Linkedin" class="w-6 h-6 group-hover:scale-110 transition-transform">
                    <span class="font-bold text-gray-800">Continuer avec Linkedin</span>
                  </button>

                  <button (click)="mode = 'phone-form'" class="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-all hover:border-gray-300 group">
                    <img src="assets/icones/phone.webp" alt="Phone" class="w-6 h-6 group-hover:scale-110 transition-transform">
                    <span class="font-bold text-gray-800">Continuer avec un téléphone</span>
                  </button>

                  <button (click)="goToForm()" class="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-4 hover:bg-gray-50 transition-all hover:border-gray-300 group">
                    <img src="assets/icones/mail.webp" alt="Email" class="w-6 h-6 group-hover:scale-110 transition-transform">
                    <span class="font-bold text-gray-800">Continuer avec un e-mail</span>
                  </button>
                </div>

                <div class="mt-8 text-center text-sm">
                  <ng-container *ngIf="mode === 'social-login'">
                    <span class="text-gray-500 font-medium">Nouveau sur Agrima ?</span>
                    <a href="javascript:void(0)" (click)="toggleAuthMode('social-register')" class="ml-2 font-bold text-alibaba-red hover:underline">Créez un compte</a>
                  </ng-container>
                  <ng-container *ngIf="mode === 'social-register'">
                    <span class="text-gray-500 font-medium">Déjà un compte ?</span>
                    <a href="javascript:void(0)" (click)="toggleAuthMode('social-login')" class="ml-2 font-bold text-alibaba-red hover:underline">Connectez-vous</a>
                  </ng-container>
                </div>
              </div>

              <!-- FORMULAIRE TÉLÉPHONE -->
              <div *ngIf="mode === 'phone-form'" class="animate-fadeIn">
                <button (click)="backToSocial()" class="mb-6 text-gray-400 hover:text-gray-600 flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg> Retour
                </button>
                <h2 class="text-2xl font-bold mb-3 tracking-tight">Vérification mobile</h2>
                <p class="text-gray-500 text-sm mb-6 font-medium">Nous vous enverrons un code de confirmation par SMS.</p>
                <div class="space-y-4">
                  <div class="flex gap-2">
                    <div class="w-24 px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center font-bold text-gray-600">+237</div>
                    <input type="tel" [(ngModel)]="phone" class="flex-grow px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-alibaba-red focus:outline-none transition-all" placeholder="Numéro de téléphone">
                  </div>
                  <button (click)="sendOTP()" class="w-full bg-alibaba-red text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-red-700 transition-all transform active:scale-95">Envoyer le code</button>
                </div>
              </div>

              <!-- FORMULAIRE CONNEXION EMAIL -->
              <div *ngIf="mode === 'login-form'" class="animate-fadeIn">
                <button (click)="mode = 'social-login'" class="mb-6 text-gray-400 hover:text-gray-600 flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg> Retour
                </button>
                <h2 class="text-2xl font-bold mb-6 tracking-tight">Connexion e-mail</h2>
                <form class="space-y-4" (ngSubmit)="onConnexion()">
                  <input type="email" [(ngModel)]="connexion.email" name="email" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-alibaba-red focus:outline-none transition-all" placeholder="Email">
                  <input type="password" [(ngModel)]="connexion.motDePasse" name="password" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-alibaba-red focus:outline-none transition-all" placeholder="Mot de passe">
                  <button type="submit" class="w-full bg-alibaba-red text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-red-700 transition-all transform active:scale-95">Se Connecter</button>
                </form>
              </div>

              <!-- FORMULAIRE INSCRIPTION EMAIL -->
              <div *ngIf="mode === 'register-form'" class="animate-fadeIn">
                <button (click)="mode = 'social-register'" class="mb-6 text-gray-400 hover:text-gray-600 flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg> Retour
                </button>
                <h2 class="text-2xl font-bold mb-6 tracking-tight">Créer mon compte</h2>
                <form class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar" (ngSubmit)="onInscription()">
                  <input type="text" [(ngModel)]="inscription.nom" name="name" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-alibaba-red focus:outline-none transition-all" placeholder="Nom complet">
                  <input type="email" [(ngModel)]="inscription.email" name="reg-email" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-alibaba-red focus:outline-none transition-all" placeholder="Email">
                  <input type="tel" [(ngModel)]="inscription.telephone" name="phone" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-alibaba-red focus:outline-none transition-all" placeholder="Téléphone">
                  <input type="password" [(ngModel)]="inscription.motDePasse" name="reg-pass" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-alibaba-red focus:outline-none transition-all" placeholder="Mot de passe">
                  <div class="flex items-center gap-3 py-2">
                    <input type="checkbox" [(ngModel)]="inscription.accepteConditions" name="terms" id="terms" class="w-5 h-5 accent-alibaba-red rounded cursor-pointer">
                    <label for="terms" class="text-xs text-gray-500 font-medium leading-tight cursor-pointer">J'accepte les conditions générales d'utilisation d'Agrima.</label>
                  </div>
                  <button type="submit" class="w-full bg-alibaba-red text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-red-700 transition-all transform active:scale-95">S'inscrire</button>
                </form>
              </div>

              <div *ngIf="message" [class]="'mt-6 p-4 rounded-2xl text-sm font-bold animate-fadeIn ' + (messageType === 'erreur' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100')">
                {{ message }}
              </div>
            </div>
          </div>

          <!-- Pied de page -->
          <div class="flex flex-wrap justify-center gap-8 lg:gap-12 mt-12 border-t border-gray-50 pt-8">
            <a href="javascript:void(0)" class="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 group transition-all">
              <img src="assets/icones/phone.webp" alt="phone" class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all">
              <span>Accès fournisseurs</span>
            </a>
            <a href="javascript:void(0)" class="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 group transition-all">
              <img src="assets/icones/code_qr.webp" alt="qr" class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all">
              <span>Code QR</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    .font-outfit { font-family: 'Outfit', sans-serif; }
    .bg-grid-pattern { background-image: radial-gradient(#e5e7eb 1px, transparent 1px); background-size: 30px 30px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
  `]
})
export class ConnexionComponent implements OnInit {
  mode: 'social-login' | 'social-register' | 'login-form' | 'register-form' | 'phone-form' = 'social-login';
  message = '';
  messageType: 'erreur' | 'succes' = 'succes';
  phone = '';

  connexion = { email: '', motDePasse: '' };
  inscription = { nom: '', email: '', telephone: '', motDePasse: '', confirmMotDePasse: '', accepteConditions: false };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const url = this.router.url;
    this.mode = url.includes('inscription') ? 'social-register' : 'social-login';
  }

  isRegisterMode(): boolean {
    return this.mode === 'social-register' || this.mode === 'register-form';
  }

  toggleAuthMode(targetMode: 'social-login' | 'social-register'): void {
    this.mode = targetMode;
    this.message = '';
    const newUrl = targetMode === 'social-login' ? '/connexion' : '/inscription';
    window.history.pushState({}, '', newUrl);
  }

  backToSocial(): void {
    this.mode = this.isRegisterMode() ? 'social-register' : 'social-login';
    this.message = '';
  }

  goToForm(): void {
    if (this.mode === 'social-login') {
      this.mode = 'login-form';
    } else if (this.mode === 'social-register') {
      this.mode = 'register-form';
    }
  }

  sendOTP(): void {
    if (!this.phone) {
      this.message = 'Veuillez entrer un numéro';
      this.messageType = 'erreur';
      return;
    }
    this.message = 'Code envoyé au ' + this.phone;
    this.messageType = 'succes';
  }

  onConnexion(): void {
    if (!this.connexion.email || !this.connexion.motDePasse) {
      this.message = 'Champs requis';
      this.messageType = 'erreur';
      return;
    }
    this.authService.login(this.connexion.email, this.connexion.motDePasse).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { this.message = 'Erreur identifiants'; this.messageType = 'erreur'; }
    });
  }

  onInscription(): void {
    if (!this.inscription.nom || !this.inscription.email || !this.inscription.motDePasse) {
      this.message = 'Veuillez remplir tous les champs';
      this.messageType = 'erreur';
      return;
    }
    this.authService.register(this.inscription).subscribe({
      next: () => {
        this.message = 'Bienvenue !';
        this.messageType = 'succes';
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: () => { this.message = 'Erreur inscription'; this.messageType = 'erreur'; }
    });
  }
}