import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, NotificationsComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header *ngIf="showLayout"></app-header>
      
      <main class="flex-grow transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" [ngClass]="{
        'pt-[280px] pb-12': showLayout && isSearchPage && isAtTop, 
        'pt-[130px] pb-12': showLayout && (isSearchPage && !isAtTop || !isSearchPage),
        'pt-0': !showLayout
      }">
        <router-outlet></router-outlet>
      </main>
      <app-footer *ngIf="showFooter"></app-footer>
      <app-notifications></app-notifications>
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  titre = 'agrima-ecommerce';
  isSearchPage = false;
  isAtTop = true;
  showLayout = true;
  showFooter = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.updateRouteVisibility(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRouteVisibility(event.urlAfterRedirects);
      }
    });
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  checkScroll() {
    this.isAtTop = window.pageYOffset === 0;
  }

  private updateRouteVisibility(url: string): void {
    this.isSearchPage = url.startsWith('/catalogue');
    this.showLayout = !url.includes('/connexion') && !url.includes('/inscription');
    this.showFooter = this.showLayout && !url.includes('/vendez-avec-nous');
  }
}
