import { Signal, computed, effect, signal } from '@angular/core';

// État global de l'application
export class AppState {
  static readonly instance = new AppState();

  // Signaux
  readonly nombreArticles = signal(0);
  readonly total = signal(0);
  readonly utilisateur = signal<any>(null);
  
  // Signaux computés
  readonly affichagePanier = computed(() => {
    const nb = this.nombreArticles();
    return nb > 0 ? `${nb} article${nb > 1 ? 's' : ''}` : 'Panier vide';
  });

  constructor() {
    // Effects pour réactions aux changements
    effect(() => {
      console.log('articles:', this.nombreArticles());
    });
  }

  mettreAJourPanier(nombre: number, montant: number): void {
    this.nombreArticles.set(nombre);
    this.total.set(montant);
  }

  seConnecter(user: any): void {
    this.utilisateur.set(user);
  }

  seDeconnecter(): void {
    this.utilisateur.set(null);
  }
}
