import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <div *ngFor="let notif of (notifications$ | async)"
           (mouseenter)="pauseTimer(notif.id)"
           (mouseleave)="resumeTimer(notif.id)"
           [@slideIn]
           class="p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slideIn"
           [ngClass]="getNotificationClasses(notif.type)">
        
        <!-- Icône -->
        <span class="text-xl flex-shrink-0">
          <span *ngIf="notif.type === 'success'"><img width="24" height="24" src="assets/icones/succes.webp" alt="ok" class="inline-block align-middle mr-1"/></span>
          <span *ngIf="notif.type === 'error'"><img width="24" height="24" src="assets/icones/icons8-cancel-100.webp" alt="x" class="inline-block align-middle mr-1"/></span>
          <span *ngIf="notif.type === 'warning'">⚠️</span>
          <span *ngIf="notif.type === 'info'">ℹ️</span>
        </span>

        <!-- Message -->
        <div class="flex-1">
          <p class="text-sm font-medium">{{ notif.message }}</p>
        </div>

        <!-- Bouton fermer -->
        <button 
          (click)="removeNotification(notif.id)"
          class="flex-shrink-0 text-xl hover:opacity-70 transition-opacity">
          ✕
        </button>

        <!-- Barre de progression -->
        <div *ngIf="notif.duration" 
             class="absolute bottom-0 left-0 h-1 bg-current opacity-30 animate-shrinkWidth"
             [style.animation-duration.ms]="notif.duration">
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes shrinkWidth {
      from {
        width: 100%;
      }
      to {
        width: 0;
      }
    }

    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }

    .animate-shrinkWidth {
      animation: shrinkWidth linear forwards;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications$ = this.notificationService.notifications$;
  private pausedTimers = new Set<string>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {}

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  pauseTimer(id: string): void {
    this.pausedTimers.add(id);
  }

  resumeTimer(id: string): void {
    this.pausedTimers.delete(id);
  }

  getNotificationClasses(type: string): string {
    const baseClasses = 'border-l-4 text-gray-900';
    const typeClasses: { [key: string]: string } = {
      'success': 'bg-green-50 border-green-500 text-green-900',
      'error': 'bg-red-50 border-red-500 text-red-900',
      'warning': 'bg-yellow-50 border-yellow-500 text-yellow-900',
      'info': 'bg-blue-50 border-blue-500 text-blue-900'
    };
    return `${baseClasses} ${typeClasses[type] || ''}`;
  }
}
