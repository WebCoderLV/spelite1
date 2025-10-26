import { Component, inject, output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UserGlobalSignal } from '../models/user -global-signal';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { UserLoginGlobalSignal } from '../models/login-global-signal';
import { GameService } from '../services/game-service';
import { GameGlobalSignal } from '../models/game-global-signal';
import { BaseComponent } from '../shared/base-component';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header extends BaseComponent {
  user = inject(UserGlobalSignal).user;
  userService = inject(UserService);
  gameService = inject(GameService);
  userLoginGlobalSignal = inject(UserLoginGlobalSignal);
  gameGlobalSignal = inject(GameGlobalSignal)
  router = inject(Router);

  rules = output<boolean>();
  newGame = output<boolean>();
  rulesBoolean: boolean = true;
  showGameRules() {
    this.rulesBoolean = !this.rulesBoolean;
    this.rules.emit(this.rulesBoolean);
  }

  deleteAccount() {
    this.userService.deleteAccount(this.user().id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.user.set({ id: 0, name: '', password: '' });
          this.userLoginGlobalSignal.logedIn.set(false);
          this.gameGlobalSignal.game.set({ id: null, number1: 0, number2: 0, number3: 0, number4: 0 });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error deleting account:', error);
        }
      });
  }

  startNewGame() {
    this.gameService.startGame(this.user().id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.gameGlobalSignal.game.set({ id: response.body!, number1: 0, number2: 0, number3: 0, number4: 0 });
          this.newGame.emit(true);
        },
        error: (error) => {
          console.error('Error starting new game:', error);
        }
      });
  }

  exitGame() {
    this.user.set({ id: 0, name: '', password: '' });
    this.gameGlobalSignal.game.set({ id: 0, number1: 0, number2: 0, number3: 0, number4: 0 });
    this.userLoginGlobalSignal.logedIn.set(false);
    this.router.navigate(['/login']);
  }

}
