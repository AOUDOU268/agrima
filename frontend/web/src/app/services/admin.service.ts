import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ProfilAdmin {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  statut: string;
  localisation: string;
  dateInscription: string;
  derniereActivite: string;
  scoreConfiance: number;
  nbSignalements: number;
  note: number;
  portefeuille?: string;
  tags: string[];
  siret?: string;
  nomExploitation?: string;
  certifications?: string[];
  vehicule?: string;
  plaqueImmatriculation?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
}

export interface ActionModeration {
  id: number;
  profilId: number;
  type: 'SUSPENSION' | 'AVERTISSEMENT' | 'VALIDATION' | 'CONTACT' | 'BLOCAGE';
  description: string;
  raison: string;
  dateAction: string;
  moderateurId?: number;
  statut: 'EFFECTUEE' | 'EN_ATTENTE' | 'REJETEE';
}

export interface RapportModeration {
  dateDebut: string;
  dateFin: string;
  totalProfils: number;
  actifs: number;
  suspendus: number;
  enAttente: number;
  scoreConfiantMoyen: number;
  signalementsTotaux: number;
  actionsEffectuees: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/users/admin`;

  private profilsSubject = new BehaviorSubject<ProfilAdmin[]>([]);
  public profils$ = this.profilsSubject.asObservable();

  private profilSelectionneSubject = new BehaviorSubject<ProfilAdmin | null>(null);
  public profilSelectionne$ = this.profilSelectionneSubject.asObservable();

  private actionsSubject = new BehaviorSubject<ActionModeration[]>([]);
  public actions$ = this.actionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ========== GESTION DES PROFILS ==========

  chargerProfils(): void {
    this.obtenirProfilsFiltres().subscribe();
  }

  obtenirProfil(id: number): Observable<ProfilAdmin> {
    return this.http.get<ProfilAdmin>(`${this.baseUrl}/profils/${id}`);
  }

  obtenirProfilsFiltres(role?: string, statut?: string): Observable<ProfilAdmin[]> {
    let params = new HttpParams();
    if (role && role !== 'TOUS') {
      params = params.set('role', role);
    }
    if (statut && statut !== 'TOUS') {
      params = params.set('statut', statut);
    }

    return this.http.get<Page<ProfilAdmin>>(`${this.baseUrl}/profils`, { params }).pipe(
      map(page => page.content),
      tap(profils => this.profilsSubject.next(profils))
    );
  }

  obtenirProfilsUrgents(): Observable<ProfilAdmin[]> {
    return this.http.get<ProfilAdmin[]>(`${this.baseUrl}/profils/urgents`);
  }

  selectionnerProfil(profil: ProfilAdmin): void {
    this.profilSelectionneSubject.next(profil);
  }

  obtenirConsommateur(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/${id}/consommateur`);
  }

  obtenirProducteur(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/${id}/producteur`);
  }

  obtenirLivreur(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/${id}/livreur`);
  }

  mettreAJourProfil(id: number, donnees: Partial<ProfilAdmin>): Observable<ProfilAdmin> {
    return this.http.put<ProfilAdmin>(`${this.baseUrl}/profils/${id}`, donnees).pipe(
      tap(() => this.chargerProfils())
    );
  }

  supprimerProfil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/profils/${id}`).pipe(
      tap(() => this.chargerProfils())
    );
  }

  // ========== ACTIONS DE MODERATION ==========

  validerProfil(id: number, raison: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.baseUrl}/profils/${id}/valider`, { raison }).pipe(
      tap(() => this.chargerProfils())
    );
  }

  suspendreTemporairement(id: number, duree: number, raison: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.baseUrl}/profils/${id}/suspendre-temp`, { duree, raison }).pipe(
      tap(() => this.chargerProfils())
    );
  }

  reactiverProfil(id: number): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.baseUrl}/profils/${id}/reactiver`, {}).pipe(
      tap(() => this.chargerProfils())
    );
  }

  ajouterAvertissement(id: number, raison: string, details: string): Observable<ActionModeration> {
    return this.http.post<ActionModeration>(`${this.baseUrl}/profils/${id}/avertir`, { raison, details });
  }

  bloquerProfil(id: number, raison: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.baseUrl}/profils/${id}/bloquer`, { raison }).pipe(
      tap(() => this.chargerProfils())
    );
  }

  envoyerMessage(id: number, sujet: string, contenu: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/profils/${id}/message`, { sujet, contenu });
  }

  // ========== GESTION DES ROLES ==========

  assignerRole(userId: number, nouveauRole: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.baseUrl}/utilisateurs/${userId}/role`, { role: nouveauRole }).pipe(
      tap(() => this.chargerProfils())
    );
  }

  retirerRole(userId: number, role: string): Observable<ProfilAdmin> {
    return this.http.delete<ProfilAdmin>(`${this.baseUrl}/utilisateurs/${userId}/role/${role}`).pipe(
      tap(() => this.chargerProfils())
    );
  }

  // ========== ANALYTICS ET RAPPORTS ==========

  genererRapportModeration(dateDebut: string, dateFin: string): Observable<RapportModeration> {
    let params = new HttpParams().set('dateDebut', dateDebut).set('dateFin', dateFin);
    return this.http.get<RapportModeration>(`${this.baseUrl}/rapports/moderation`, { params });
  }

  obtenirStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistiques`);
  }

  obtenirHistoriqueActions(profilId: number): Observable<ActionModeration[]> {
    return this.http.get<ActionModeration[]>(`${this.baseUrl}/profils/${profilId}/historique-actions`);
  }

  obtenirActionsEnAttente(): Observable<ActionModeration[]> {
    return this.http.get<ActionModeration[]>(`${this.baseUrl}/actions/en-attente`);
  }

  approuverAction(actionId: number): Observable<ActionModeration> {
    return this.http.post<ActionModeration>(`${this.baseUrl}/actions/${actionId}/approuver`, {});
  }

  rejeterAction(actionId: number, raison: string): Observable<ActionModeration> {
    return this.http.post<ActionModeration>(`${this.baseUrl}/actions/${actionId}/rejeter`, { raison });
  }

  // ========== UTILITAIRES ==========

  calculerNiveauRisque(profil: ProfilAdmin): 'Faible' | 'Modéré' | 'Élevé' {
    if (profil.scoreConfiance >= 85 && profil.nbSignalements === 0) return 'Faible';
    if (profil.scoreConfiance >= 60 && profil.nbSignalements <= 2) return 'Modéré';
    return 'Élevé';
  }

  extraireInitiales(nom: string): string {
    if (!nom) return '';
    return nom
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  formaterDate(date: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
