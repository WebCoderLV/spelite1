import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { form, max, min, required } from '@angular/forms/signals';
import { takeUntil } from 'rxjs/operators';
import { HTML_CONSTANTS } from '../../../public/rules';
import { Header } from '../header/header';
import { GameGlobalSignal } from '../models/game-global-signal';
import { UserLoginGlobalSignal } from '../models/login-global-signal';
import { UserGlobalSignal } from '../models/user -global-signal';
import { GameService } from '../services/game-service';
import { ResultsGlobalSignal } from '../models/results-global-signal';
import { BaseComponent } from '../shared/base-component';

interface GameResult {
  gameId: number;
  p: number;
  a: number;
  win: boolean;
}

interface GameAttempt {
  result: GameResult;
  inputNumbers: number[];
}

@Component({
  selector: 'app-main',
  imports: [Header],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main extends BaseComponent implements OnInit {
  rules = HTML_CONSTANTS.gameRules;

  gameService = inject(GameService);

  gameRules = signal<boolean>(true);

  userLoginGlobalSignal = inject(UserLoginGlobalSignal);
  gameGlobalSignal = inject(GameGlobalSignal);
  userGlobalSignal = inject(UserGlobalSignal).user;
  result = inject(ResultsGlobalSignal);
  gameAttempts = signal<GameAttempt[]>([]);

  ngOnInit(): void {
    this.gameService.startGame(this.userGlobalSignal().id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.gameGlobalSignal.game.update(() => ({ ...this.gameGlobalSignal.game(), id: response.body! }));
        },
        error: (error) => {
          console.error('Error initializing game:', error);
        }
      });
  }

  onRules(rules: boolean) {
    this.gameRules.set(rules);
  }

  updateNumber1(value: number) {
    this.gameGlobalSignal.game.update(model => ({ ...model, number1: value }));
  }

  updateNumber2(value: number) {
    this.gameGlobalSignal.game.update(model => ({ ...model, number2: value }));
  }

  updateNumber3(value: number) {
    this.gameGlobalSignal.game.update(model => ({ ...model, number3: value }));
  }

  updateNumber4(value: number) {
    this.gameGlobalSignal.game.update(model => ({ ...model, number4: value }));
  }

  protected readonly gameForm = form(this.gameGlobalSignal.game, (path) => {
    required(path.number1, { message: 'Number 1 is required' });
    min(path.number1, 1, { message: 'Number 1 must be at least 1' });
    max(path.number1, 9, { message: 'Number 1 must be a single digit (1-9)' });

    required(path.number2, { message: 'Number 2 is required' });
    min(path.number2, 1, { message: 'Number 2 must be at least 1' });
    max(path.number2, 9, { message: 'Number 2 must be a single digit (1-9)' });

    required(path.number3, { message: 'Number 3 is required' });
    min(path.number3, 1, { message: 'Number 3 must be at least 1' });
    max(path.number3, 9, { message: 'Number 3 must be a single digit (1-9)' });

    required(path.number4, { message: 'Number 4 is required' });
    min(path.number4, 1, { message: 'Number 4 must be at least 1' });
    max(path.number4, 9, { message: 'Number 4 must be a single digit (1-9)' });
  });

  resetGame(newGame: boolean) {
    if (newGame) {
      this.gameAttempts.set([]);
    }
  }

  onSubmit() {
    const { number1, number2, number3, number4 } = this.gameGlobalSignal.game();
    const numbers: number[] = [number1, number2, number3, number4].filter(n => n !== 0);
    const hasUniqueNumbers: boolean = numbers.length === new Set(numbers).size;
    if (this.gameForm().valid() && hasUniqueNumbers) {
      this.gameService.checkGame(this.gameGlobalSignal.game())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.body) {
              const result = response.body as GameResult;
              const inputNumbers = [number1, number2, number3, number4];
              this.gameAttempts.update(attempts => [...attempts, { result, inputNumbers }]);
            }
          },
          error: (error) => {
            console.error('Error checking game:', error);
          }
        });
    } else {
      alert(hasUniqueNumbers ? 'Please fill all fields correctly!' : 'All numbers must be different!');
    }
  }

}
