import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private utilisateurSubject = new BehaviorSubject<any>(null);
  public utilisateur$ = this.utilisateurSubject.asObservable();
  private apiUrl = 'http://localhost:8083/api/auth';

  constructor(private http: HttpClient) {
    this.chargerUtilisateur();
  }

  connecter(email: string, motDePasse: string): Observable<any> {
    return new Observable(observer => {
      // Simulation de connexion
      let role = 'ROLE_CONSOMMATEUR';
      if (email.toLowerCase().includes('admin')) {
        role = 'ROLE_ADMIN';
      } else if (email.toLowerCase().includes('producteur')) {
        role = 'ROLE_PRODUCTEUR';
      } else if (email.toLowerCase().includes('livreur')) {
        role = 'ROLE_LIVREUR';
      } else if (email.toLowerCase().includes('moderateur')) {
        role = 'ROLE_MODERATEUR';
      }
      
      const utilisateur = {
        id: 1,
        email,
        nom: 'Utilisateur',
        role
      };
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
      localStorage.setItem('token', 'token-' + Date.now());
      this.utilisateurSubject.next(utilisateur);
      observer.next(utilisateur);
      observer.complete();
    });
  }

  sInscrire(donnees: any): Observable<any> {
    return new Observable(observer => {
      const utilisateur = { ...donnees, id: 1, role: donnees.role || 'ROLE_CONSOMMATEUR' };
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
      localStorage.setItem('token', 'token-' + Date.now());
      this.utilisateurSubject.next(utilisateur);
      observer.next(utilisateur);
      observer.complete();
    });
  }

  seDeconnecter(): void {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('token');
    this.utilisateurSubject.next(null);
  }

  estConnecte(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenirUtilisateur(): any {
    return this.utilisateurSubject.value;
  }

  // Alias pour compatibilité avec les composants
  login(email: string, motDePasse: string): Observable<any> {
    return this.connecter(email, motDePasse);
  }

  register(donnees: any): Observable<any> {
    return this.sInscrire(donnees);
  }

  getUtilisateur(): any {
    return this.obtenirUtilisateur();
  }

  logout(): void {
    this.seDeconnecter();
  }

  private chargerUtilisateur(): void {
    const utilisateur = localStorage.getItem('utilisateur');
    if (utilisateur) {
      this.utilisateurSubject.next(JSON.parse(utilisateur));
    }
  }
}
