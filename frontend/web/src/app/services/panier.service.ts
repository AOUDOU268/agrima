import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private articles: Article[] = [];
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  
  articles$ = this.articlesSubject.asObservable();

  constructor() {
    this.chargerPanier();
  }

  ajouterArticle(article: Article): void {
    const existant = this.articles.find(a => a.produitId === article.produitId);
    
    if (existant) {
      existant.quantite += article.quantite;
    } else {
      this.articles.push(article);
    }
    
    this.sauvegarderPanier();
    this.articlesSubject.next([...this.articles]);
  }

  supprimerArticle(produitId: number): void {
    this.articles = this.articles.filter(a => a.produitId !== produitId);
    this.sauvegarderPanier();
    this.articlesSubject.next([...this.articles]);
  }

  mettreAJourQuantite(produitId: number, quantite: number): void {
    const article = this.articles.find(a => a.produitId === produitId);
    if (article) {
      article.quantite = quantite;
      if (article.quantite <= 0) {
        this.supprimerArticle(produitId);
      } else {
        this.sauvegarderPanier();
        this.articlesSubject.next([...this.articles]);
      }
    }
  }

  viderPanier(): void {
    this.articles = [];
    this.sauvegarderPanier();
    this.articlesSubject.next([]);
  }

  obtenirArticles(): Article[] {
    return [...this.articles];
  }

  obtenirTotal(): number {
    return this.articles.reduce((total, article) => total + (article.prix * article.quantite), 0);
  }

  obtenirNombreArticles(): number {
    return this.articles.reduce((total, article) => total + article.quantite, 0);
  }

  private sauvegarderPanier(): void {
    localStorage.setItem('panier', JSON.stringify(this.articles));
  }

  private chargerPanier(): void {
    const panier = localStorage.getItem('panier');
    if (panier) {
      this.articles = JSON.parse(panier);
      this.articlesSubject.next([...this.articles]);
    }
  }
}
