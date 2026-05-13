import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProfilAdmin {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: 'ROLE_CONSOMMATEUR' | 'ROLE_PRODUCTEUR' | 'ROLE_LIVREUR';
  statut: 'Actif' | 'En attente' | 'Suspendu';
  localisation: string;
  dateInscription: string;
  derniereActivite: string;
  scoreConfiance: number;
  nbSignalements: number;
  note: number;
  portefeuille: string;
  tags: string[];
  // Champs additionnels
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

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = '/api/admin';
  private profilsSubject = new BehaviorSubject<ProfilAdmin[]>([]);
  public profils$ = this.profilsSubject.asObservable();

  private profilSelectionneSubject = new BehaviorSubject<ProfilAdmin | null>(null);
  public profilSelectionne$ = this.profilSelectionneSubject.asObservable();

  private actionsSubject = new BehaviorSubject<ActionModeration[]>([]);
  public actions$ = this.actionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.chargerProfils();
  }

  // ========== GESTION DES PROFILS ==========

  /**
   * Charge tous les profils depuis l'API
   */
  chargerProfils(): void {
    this.http.get<ProfilAdmin[]>(`${this.apiUrl}/profils`).subscribe({
      next: (profils) => this.profilsSubject.next(profils),
      error: (error) => console.error('Erreur lors du chargement des profils', error)
    });
  }

  /**
   * Récupère un profil spécifique
   */
  obtenirProfil(id: number): Observable<ProfilAdmin> {
    return this.http.get<ProfilAdmin>(`${this.apiUrl}/profils/${id}`);
  }

  /**
   * Récupère les profils avec filtrage
   */
  obtenirProfilsFiltres(role?: string, statut?: string): Observable<ProfilAdmin[]> {
    let url = `${this.apiUrl}/profils`;
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (statut) params.append('statut', statut);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return this.http.get<ProfilAdmin[]>(url);
  }

  /**
   * Récupère les profils urgents (signalements ou statut particulier)
   */
  obtenirProfilsUrgents(): Observable<ProfilAdmin[]> {
    return this.http.get<ProfilAdmin[]>(`${this.apiUrl}/profils/urgents`);
  }

  /**
   * Sélectionne un profil pour affichage
   */
  selectionnerProfil(profil: ProfilAdmin): void {
    this.profilSelectionneSubject.next(profil);
  }

  /**
   * Récupère les détails d'un consommateur
   */
  obtenirConsommateur(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/consommateurs/${id}`);
  }

  /**
   * Récupère les détails d'un producteur
   */
  obtenirProducteur(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/producteurs/${id}`);
  }

  /**
   * Récupère les détails d'un livreur
   */
  obtenirLivreur(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/livreurs/${id}`);
  }

  /**
   * Met à jour un profil
   */
  mettreAJourProfil(id: number, donnees: Partial<ProfilAdmin>): Observable<ProfilAdmin> {
    return this.http.put<ProfilAdmin>(`${this.apiUrl}/profils/${id}`, donnees).pipe(
      map((profil) => {
        this.chargerProfils();
        return profil;
      })
    );
  }

  /**
   * Supprime un profil
   */
  supprimerProfil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profils/${id}`).pipe(
      map(() => {
        this.chargerProfils();
      })
    );
  }

  // ========== ACTIONS DE MODERATION ==========

  /**
   * Valide un profil
   */
  validerProfil(id: number, raison: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.apiUrl}/profils/${id}/valider`, { raison }).pipe(
      map((profil) => {
        this.chargerProfils();
        return profil;
      })
    );
  }

  /**
   * Suspend temporairement un profil
   */
  suspendreTemporairement(id: number, duree: number, raison: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.apiUrl}/profils/${id}/suspendre-temp`, {
      duree,
      raison
    }).pipe(
      map((profil) => {
        this.chargerProfils();
        return profil;
      })
    );
  }

  /**
   * Réactive un profil
   */
  reactiverProfil(id: number): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.apiUrl}/profils/${id}/reactiver`, {}).pipe(
      map((profil) => {
        this.chargerProfils();
        return profil;
      })
    );
  }

  /**
   * Ajoute un avertissement
   */
  ajouterAvertissement(id: number, raison: string, details: string): Observable<ActionModeration> {
    return this.http.post<ActionModeration>(`${this.apiUrl}/profils/${id}/avertir`, {
      raison,
      details
    });
  }

  /**
   * Bloque définitivement un profil
   */
  bloquerProfil(id: number, raison: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.apiUrl}/profils/${id}/bloquer`, { raison }).pipe(
      map((profil) => {
        this.chargerProfils();
        return profil;
      })
    );
  }

  /**
   * Envoie un message au profil
   */
  envoyerMessage(id: number, sujet: string, contenu: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/profils/${id}/message`, {
      sujet,
      contenu
    });
  }

  // ========== GESTION DES ROLES ==========

  /**
   * Assigne un rôle à un utilisateur
   */
  assignerRole(userId: number, nouveauRole: string): Observable<ProfilAdmin> {
    return this.http.post<ProfilAdmin>(`${this.apiUrl}/utilisateurs/${userId}/role`, {
      role: nouveauRole
    }).pipe(
      map((profil) => {
        this.chargerProfils();
        return profil;
      })
    );
  }

  /**
   * Retire un rôle à un utilisateur
   */
  retirerRole(userId: number, role: string): Observable<ProfilAdmin> {
    return this.http.delete<ProfilAdmin>(`${this.apiUrl}/utilisateurs/${userId}/role/${role}`).pipe(
      map((profil) => {
        this.chargerProfils();
        return profil;
      })
    );
  }

  // ========== ANALYTICS ET RAPPORTS ==========

  /**
   * Génère un rapport de modération
   */
  genererRapportModeration(dateDebut: string, dateFin: string): Observable<RapportModeration> {
    return this.http.get<RapportModeration>(`${this.apiUrl}/rapports/moderation`, {
      params: {
        dateDebut,
        dateFin
      }
    });
  }

  /**
   * Récupère les statistiques globales
   */
  obtenirStatistiques(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistiques`);
  }

  /**
   * Récupère l'historique des actions d'un profil
   */
  obtenirHistoriqueActions(profilId: number): Observable<ActionModeration[]> {
    return this.http.get<ActionModeration[]>(`${this.apiUrl}/profils/${profilId}/historique-actions`);
  }

  /**
   * Récupère les actions de modération en attente
   */
  obtenirActionsEnAttente(): Observable<ActionModeration[]> {
    return this.http.get<ActionModeration[]>(`${this.apiUrl}/actions/en-attente`);
  }

  /**
   * Approuve une action de modération
   */
  approuverAction(actionId: number): Observable<ActionModeration> {
    return this.http.post<ActionModeration>(`${this.apiUrl}/actions/${actionId}/approuver`, {});
  }

  /**
   * Rejette une action de modération
   */
  rejeterAction(actionId: number, raison: string): Observable<ActionModeration> {
    return this.http.post<ActionModeration>(`${this.apiUrl}/actions/${actionId}/rejeter`, { raison });
  }

  // ========== UTILITAIRES ==========

  /**
   * Calcule le niveau de risque d'un profil
   */
  calculerNiveauRisque(profil: ProfilAdmin): 'Faible' | 'Modéré' | 'Élevé' {
    if (profil.scoreConfiance >= 85 && profil.nbSignalements === 0) return 'Faible';
    if (profil.scoreConfiance >= 60 && profil.nbSignalements <= 2) return 'Modéré';
    return 'Élevé';
  }

  /**
   * Extrait les initiales d'un nom
   */
  extraireInitiales(nom: string): string {
    return nom
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Formate une date
   */
  formaterDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
