import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendez-avec-nous',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white font-outfit">
      <!-- Hero Section avec Dégradé Premium -->
      <div class="relative bg-[#008a5d] pt-0 pb-40 mt-0 overflow-hidden">        
        <div class="container mx-auto mt-0 px-4 relative z-10 text-center">
          <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
            Donnez une Dimension <br> <span class="text-[#facc15]">Nationale</span> à vos Récoltes
          </h1>
          <p class="text-xl text-white/80 max-w-2xl mx-auto font-medium mb-10">
            Rejoignez AGRIMA, le pont numérique entre les terres fertiles du Cameroun et les foyers de demain.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button (click)="scrollToForm()" class="px-10 py-4 bg-white text-[#008a5d] rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform active:scale-95">
              Ouvrir ma boutique
            </button>
            <button class="px-10 py-4 bg-[#00704b] text-white rounded-2xl font-black border border-white/20 hover:bg-[#005a3c] transition-all">
              En savoir plus
            </button>
          </div>
        </div>
      </div>

      <!-- Section Avantages USPs -->
      <div class="container mx-auto px-4 -mt-20 relative z-20 pb-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hover:-translate-y-2 transition-transform duration-500">
            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <img src="assets/icones/livraison.webp" class="w-6 h-6" alt="logistique">
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-2 tracking-tight">Logistique Maîtrisée</h3>
            <p class="text-sm text-gray-500 font-medium leading-relaxed">
              Nous gérons la collecte et la livraison. Concentrez-vous sur produire.
            </p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hover:-translate-y-2 transition-transform duration-500">
            <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <img src="assets/icones/suivi.webp" class="w-6 h-6" alt="visibilité">
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-2 tracking-tight">Visibilité Totale</h3>
            <p class="text-sm text-gray-500 font-medium leading-relaxed">
              Vos produits sont exposés à des milliers d'acheteurs partout au pays.
            </p>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hover:-translate-y-2 transition-transform duration-500">
            <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              <img src="assets/icones/carte-bancaire-face-arrière.webp" class="w-6 h-6" alt="paiement">
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-2 tracking-tight">Paiements Garantis</h3>
            <p class="text-sm text-gray-500 font-medium leading-relaxed">
              Recevez vos gains via Orange Money ou Mobile Money en sécurité.
            </p>
          </div>
        </div>
      </div>


      <!-- Formulaire d'inscription Majestic -->
      <div id="registration-form" class="py-24 bg-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-96 h-96 bg-[#008a5d]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div class="container mx-auto px-4 relative z-10">
          <div class="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-5">
              <!-- Sidebar Info Form -->
              <div class="lg:col-span-2 bg-[#008a5d] p-12 text-white flex flex-col justify-between">
                <div>
                  <h3 class="text-3xl font-black mb-6 leading-tight">Prêt à devenir un Producteur d'Elite ?</h3>
                  <p class="text-white/80 font-medium mb-12 leading-relaxed">
                    Remplissez ce formulaire et notre équipe vous contactera sous 24h pour valider votre exploitation.
                  </p>
                  
                  <div class="space-y-8">
                    <div class="flex gap-4">
                      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                         <img src="assets/icones/success.webp" class="w-5 h-5 invert" alt="">
                      </div>
                      <div>
                        <p class="font-bold">Analyse Dossier</p>
                        <p class="text-sm text-white/60">Validation sous 24 heures</p>
                      </div>
                    </div>
                    <div class="flex gap-4">
                      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                         <img src="assets/icones/map.webp" class="w-5 h-5 invert" alt="">
                      </div>
                      <div>
                        <p class="font-bold">Visite Terrain</p>
                        <p class="text-sm text-white/60">Vérification de la qualité</p>
                      </div>
                    </div>
                    <div class="flex gap-4">
                      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                         <img src="assets/icones/all_product.webp" class="w-5 h-5 invert" alt="">
                      </div>
                      <div>
                        <p class="font-bold">Mise en ligne</p>
                        <p class="text-sm text-white/60">Commencez à vendre</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-12 pt-12 border-t border-white/10">
                  <p class="text-sm italic text-white/60">"Depuis que je vends sur Agrima, mes revenus ont augmenté de 40%."</p>
                  <p class="text-sm font-bold mt-2">— Moussa B., Producteur à Maroua</p>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="lg:col-span-3 p-12">
                <form (ngSubmit)="soumettreDemande()" #formulaire="ngForm" class="space-y-8">
                  <!-- Etape 1 -->
                  <div class="space-y-6">
                    <h4 class="text-xs font-black text-[#008a5d] uppercase tracking-[0.2em] flex items-center gap-2">
                      <span class="w-8 h-px bg-[#008a5d]"></span> Étape 1 : Identité
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700">Nom complet *</label>
                        <input type="text" class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-medium" [(ngModel)]="demande.nom" name="nom" required placeholder="Ex: Jean Paul">
                      </div>
                      <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700">Téléphone *</label>
                        <input type="tel" class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-bold" [(ngModel)]="demande.telephone" name="telephone" required placeholder="6xx xxx xxx">
                      </div>
                    </div>
                  </div>

                  <!-- Etape 2 -->
                  <div class="space-y-6">
                    <h4 class="text-xs font-black text-[#008a5d] uppercase tracking-[0.2em] flex items-center gap-2">
                      <span class="w-8 h-px bg-[#008a5d]"></span> Étape 2 : Exploitation
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700">Type d'exploitation *</label>
                        <select class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-medium appearance-none" [(ngModel)]="demande.typeExploitation" name="typeExploitation" required>
                          <option value="">Sélectionner...</option>
                          <option value="ferme">Grande Ferme</option>
                          <option value="jardin">Potager Familial</option>
                          <option value="elevage">Élevage</option>
                          <option value="cooperative">Coopérative</option>
                        </select>
                      </div>
                      <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700">Ville / Localité *</label>
                        <input type="text" class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#008a5d] focus:outline-none transition-all font-medium" [(ngModel)]="demande.ville" name="ville" required placeholder="Ex: Maroua">
                      </div>
                    </div>
                  </div>

                  <!-- Etape 3 -->
                  <div class="space-y-6">
                    <h4 class="text-xs font-black text-[#008a5d] uppercase tracking-[0.2em] flex items-center gap-2">
                      <span class="w-8 h-px bg-[#008a5d]"></span> Étape 3 : Production
                    </h4>
                    <div class="space-y-2">
                      <label class="text-sm font-bold text-gray-700">Quels produits souhaitez-vous vendre ? *</label>
                      <div class="flex flex-wrap gap-2">
                        <button *ngFor="let prod of produitsDisponibles" 
                                type="button"
                                (click)="toggleProduit(prod.id)"
                                [class]="'px-4 py-2 rounded-xl text-sm font-bold border transition-all ' + (demande.produitsSelectionnes.includes(prod.id) ? 'bg-[#008a5d] text-white border-[#008a5d]' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300')">
                          {{ prod.label }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="pt-8">
                    <label class="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" [(ngModel)]="demande.accepteConditions" name="accepteConditions" required class="mt-1 w-5 h-5 rounded border-gray-300 text-[#008a5d] focus:ring-[#008a5d]">
                      <span class="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                        J'accepte les conditions de vente d'AGRIMA et certifie la véracité de mes informations.
                      </span>
                    </label>
                  </div>

                  <div class="flex gap-4">
                    <button type="submit" 
                            [disabled]="!formulaire.form.valid || demande.produitsSelectionnes.length === 0 || !demande.accepteConditions"
                            class="flex-1 bg-[#008a5d] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-[#00704b] disabled:bg-gray-200 disabled:shadow-none transition-all active:scale-95">
                      Soumettre ma candidature
                    </button>
                  </div>
                </form>
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
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
  `]
})
export class VendezAvecNousComponent implements OnInit {
  demande = {
    nom: '',
    telephone: '',
    email: '',
    ville: '',
    typeExploitation: '',
    produitsSelectionnes: [] as string[],
    accepteConditions: false
  };


  produitsDisponibles = [
    { id: 'fruits', label: 'Fruits' },
    { id: 'legumes', label: 'Légumes' },
    { id: 'lait', label: 'Lait & Dérivés' },
    { id: 'viande', label: 'Viandes' },
    { id: 'miel', label: 'Miel' },
    { id: 'epices', label: 'Épices' }
  ];

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  scrollToForm(): void {
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleProduit(id: string): void {
    const index = this.demande.produitsSelectionnes.indexOf(id);
    if (index > -1) {
      this.demande.produitsSelectionnes.splice(index, 1);
    } else {
      this.demande.produitsSelectionnes.push(id);
    }
  }

  soumettreDemande(): void {
    console.log('Candidature envoyée:', this.demande);
    alert('Félicitations ! Votre candidature a été transmise avec succès. Notre équipe reviendra vers vous sous 24h.');
    this.reinitialiserFormulaire();
  }

  private reinitialiserFormulaire(): void {
    this.demande = {
      nom: '',
      telephone: '',
      email: '',
      ville: '',
      typeExploitation: '',
      produitsSelectionnes: [],
      accepteConditions: false
    };
  }
}