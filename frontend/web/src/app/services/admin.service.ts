import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export interface ProfilAdmin {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: 'ROLE_CONSOMMATEUR' | 'ROLE_PRODUCTEUR' | 'ROLE_LIVREUR' | 'ROLE_MODERATEUR';
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
  private profilsSubject = new BehaviorSubject<ProfilAdmin[]>([]);
  public profils$ = this.profilsSubject.asObservable();

  private profilSelectionneSubject = new BehaviorSubject<ProfilAdmin | null>(null);
  public profilSelectionne$ = this.profilSelectionneSubject.asObservable();

  private actionsSubject = new BehaviorSubject<ActionModeration[]>([]);
  public actions$ = this.actionsSubject.asObservable();

  private mockProfils: ProfilAdmin[] = [
    {
      id: 1,
      nom: 'Aline Mvondo',
      email: 'aline.mvondo@agrima.cm',
      telephone: '+237 690 110 112',
      role: 'ROLE_CONSOMMATEUR',
      statut: 'Actif',
      localisation: 'Yaoundé',
      dateInscription: '12 mars 2026',
      derniereActivite: 'Il y a 8 min',
      scoreConfiance: 94,
      nbSignalements: 0,
      note: 4.8,
      portefeuille: 'Wallet Premium',
      tags: ['client fidèle', 'paiement validé']
    },
    {
      id: 2,
      nom: 'Ferme Horizon Verte',
      email: 'contact@horizonverte.cm',
      telephone: '+237 677 540 887',
      role: 'ROLE_PRODUCTEUR',
      statut: 'En attente',
      localisation: 'Bafoussam',
      dateInscription: '04 avril 2026',
      derniereActivite: 'Il y a 37 min',
      scoreConfiance: 71,
      nbSignalements: 1,
      note: 4.3,
      portefeuille: 'Compte producteur',
      tags: ['documents à vérifier', 'bio'],
      siret: '12345678901234',
      nomExploitation: 'Horizon Verte SARL'
    },
    {
      id: 3,
      nom: 'Samuel Ndzi',
      email: 'samuel.ndzi@agrima.cm',
      telephone: '+237 699 420 921',
      role: 'ROLE_LIVREUR',
      statut: 'Actif',
      localisation: 'Douala',
      dateInscription: '27 février 2026',
      derniereActivite: 'En tournée',
      scoreConfiance: 88,
      nbSignalements: 0,
      note: 4.6,
      portefeuille: 'Livreur Express',
      tags: ['zone urbaine', 'scan QR'],
      vehicule: 'Suzuki Carry',
      plaqueImmatriculation: 'CM-ND-2024'
    },
    {
      id: 4,
      nom: 'Nadine Tchana',
      email: 'nadine.tchana@agrima.cm',
      telephone: '+237 651 332 870',
      role: 'ROLE_MODERATEUR',
      statut: 'Actif',
      localisation: 'Yaoundé',
      dateInscription: '15 janvier 2026',
      derniereActivite: 'Il y a 1 h',
      scoreConfiance: 96,
      nbSignalements: 0,
      note: 4.9,
      portefeuille: 'Staff back-office',
      tags: ['contenu', 'litiges']
    },
    {
      id: 5,
      nom: 'Marché Solidaire Mbouda',
      email: 'marchesolidaire@agrima.cm',
      telephone: '+237 681 992 120',
      role: 'ROLE_PRODUCTEUR',
      statut: 'Suspendu',
      localisation: 'Mbouda',
      dateInscription: '08 décembre 2025',
      derniereActivite: 'Suspendu depuis 2 jours',
      scoreConfiance: 42,
      nbSignalements: 5,
      note: 2.9,
      portefeuille: 'Compte vérification',
      tags: ['litige actif', 'stock incohérent']
    },
    {
      id: 6,
      nom: 'Brice Nkou',
      email: 'brice.nkou@agrima.cm',
      telephone: '+237 672 301 990',
      role: 'ROLE_CONSOMMATEUR',
      statut: 'En attente',
      localisation: 'Kribi',
      dateInscription: '18 avril 2026',
      derniereActivite: 'Nouveau compte',
      scoreConfiance: 63,
      nbSignalements: 0,
      note: 0,
      portefeuille: 'Wallet standard',
      tags: ['KYC incomplet']
    }
  ];

  constructor() {
    this.profilsSubject.next([...this.mockProfils]);
  }

  // ========== GESTION DES PROFILS ==========

  chargerProfils(): void {
    this.profilsSubject.next([...this.mockProfils]);
  }

  obtenirProfil(id: number): Observable<ProfilAdmin> {
    const profil = this.mockProfils.find(p => p.id === id);
    return of(profil!).pipe(delay(300));
  }

  obtenirProfilsFiltres(role?: string, statut?: string): Observable<ProfilAdmin[]> {
    let result = [...this.mockProfils];
    if (role && role !== 'TOUS') {
      result = result.filter(p => p.role === role);
    }
    if (statut && statut !== 'TOUS') {
      result = result.filter(p => p.statut === statut);
    }
    return of(result).pipe(delay(300));
  }

  obtenirProfilsUrgents(): Observable<ProfilAdmin[]> {
    const result = this.mockProfils.filter(p => p.nbSignalements > 0 || p.statut !== 'Actif');
    return of(result).pipe(delay(300));
  }

  selectionnerProfil(profil: ProfilAdmin): void {
    this.profilSelectionneSubject.next(profil);
  }

  obtenirConsommateur(id: number): Observable<any> {
    return of({ id, details: 'Détails consommateur mock' }).pipe(delay(300));
  }

  obtenirProducteur(id: number): Observable<any> {
    return of({ id, details: 'Détails producteur mock' }).pipe(delay(300));
  }

  obtenirLivreur(id: number): Observable<any> {
    return of({ id, details: 'Détails livreur mock' }).pipe(delay(300));
  }

  mettreAJourProfil(id: number, donnees: Partial<ProfilAdmin>): Observable<ProfilAdmin> {
    const index = this.mockProfils.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProfils[index] = { ...this.mockProfils[index], ...donnees };
      this.chargerProfils();
      return of(this.mockProfils[index]).pipe(delay(300));
    }
    throw new Error('Profil non trouvé');
  }

  supprimerProfil(id: number): Observable<void> {
    this.mockProfils = this.mockProfils.filter(p => p.id !== id);
    this.chargerProfils();
    return of(undefined).pipe(delay(300));
  }

  // ========== ACTIONS DE MODERATION ==========

  validerProfil(id: number, raison: string): Observable<ProfilAdmin> {
    return this.mettreAJourProfil(id, { statut: 'Actif' });
  }

  suspendreTemporairement(id: number, duree: number, raison: string): Observable<ProfilAdmin> {
    return this.mettreAJourProfil(id, { statut: 'Suspendu' });
  }

  reactiverProfil(id: number): Observable<ProfilAdmin> {
    return this.mettreAJourProfil(id, { statut: 'Actif' });
  }

  ajouterAvertissement(id: number, raison: string, details: string): Observable<ActionModeration> {
    const action: ActionModeration = {
      id: Math.floor(Math.random() * 1000),
      profilId: id,
      type: 'AVERTISSEMENT',
      description: details,
      raison: raison,
      dateAction: new Date().toISOString(),
      statut: 'EFFECTUEE'
    };
    return of(action).pipe(delay(300));
  }

  bloquerProfil(id: number, raison: string): Observable<ProfilAdmin> {
    return this.mettreAJourProfil(id, { statut: 'Suspendu' });
  }

  envoyerMessage(id: number, sujet: string, contenu: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  // ========== GESTION DES ROLES ==========

  assignerRole(userId: number, nouveauRole: any): Observable<ProfilAdmin> {
    return this.mettreAJourProfil(userId, { role: nouveauRole });
  }

  retirerRole(userId: number, role: string): Observable<ProfilAdmin> {
    // Dans ce mock, on change juste le rôle par défaut
    return this.mettreAJourProfil(userId, { role: 'ROLE_CONSOMMATEUR' });
  }

  // ========== ANALYTICS ET RAPPORTS ==========

  genererRapportModeration(dateDebut: string, dateFin: string): Observable<RapportModeration> {
    const rapport: RapportModeration = {
      dateDebut,
      dateFin,
      totalProfils: this.mockProfils.length,
      actifs: this.mockProfils.filter(p => p.statut === 'Actif').length,
      suspendus: this.mockProfils.filter(p => p.statut === 'Suspendu').length,
      enAttente: this.mockProfils.filter(p => p.statut === 'En attente').length,
      scoreConfiantMoyen: 78,
      signalementsTotaux: 12,
      actionsEffectuees: 5
    };
    return of(rapport).pipe(delay(300));
  }

  obtenirStatistiques(): Observable<any> {
    return of({
      profilsParRole: {
        ROLE_CONSOMMATEUR: 25,
        ROLE_PRODUCTEUR: 15,
        ROLE_LIVREUR: 10
      },
      evolutionProfils: [5, 8, 12, 15, 20]
    }).pipe(delay(300));
  }

  obtenirHistoriqueActions(profilId: number): Observable<ActionModeration[]> {
    const actions: ActionModeration[] = [
      {
        id: 1,
        profilId,
        type: 'VALIDATION',
        description: 'Validation manuelle du compte',
        raison: 'Documents conformes',
        dateAction: '2026-03-15T10:00:00Z',
        statut: 'EFFECTUEE'
      }
    ];
    return of(actions).pipe(delay(300));
  }

  obtenirActionsEnAttente(): Observable<ActionModeration[]> {
    return of([]).pipe(delay(300));
  }

  approuverAction(actionId: number): Observable<ActionModeration> {
    return of({} as ActionModeration).pipe(delay(300));
  }

  rejeterAction(actionId: number, raison: string): Observable<ActionModeration> {
    return of({} as ActionModeration).pipe(delay(300));
  }

  // ========== UTILITAIRES ==========

  calculerNiveauRisque(profil: ProfilAdmin): 'Faible' | 'Modéré' | 'Élevé' {
    if (profil.scoreConfiance >= 85 && profil.nbSignalements === 0) return 'Faible';
    if (profil.scoreConfiance >= 60 && profil.nbSignalements <= 2) return 'Modéré';
    return 'Élevé';
  }

  extraireInitiales(nom: string): string {
    return nom
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  formaterDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
