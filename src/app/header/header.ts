import { Component, inject, output } from '@angular/core';
import { UserGlobalSignal } from '../services/userGlobalSignal';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { UserLoginGlobalSignal } from '../services/userLoginGlobalSignal';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  user = inject(UserGlobalSignal).user;
  userService = inject(UserService);
  userLoginGlobalSignal = inject(UserLoginGlobalSignal);
  router = inject(Router);

  rules = output<boolean>();
  rulesBoolean: boolean = true;
  showGameRules() {
    this.rulesBoolean = !this.rulesBoolean;
    this.rules.emit(this.rulesBoolean);
  }

  deleteAccount() {
    this.userService.deleteAccount(this.user().id!).subscribe({
      next: () => {
        this.user.set({ id: null, name: '', password: '' });
        this.userLoginGlobalSignal.userLogedIn.set(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error deleting account:', error);
      }
    });
  }

  startNewGame() {
    // TODO: Implement new game logic
  }

  exitGame() {
    this.user.set({ id: null, name: '', password: '' });
    this.userLoginGlobalSignal.userLogedIn.set(false);
    this.router.navigate(['/login']);
  }

}
