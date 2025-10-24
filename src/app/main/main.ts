import { Component, signal } from '@angular/core';
import { form, min, max, required } from '@angular/forms/signals';
import { HTML_CONSTANTS } from '../../../public/rules';
import { Header } from '../header/header';
import { GameInterface } from '../models/game-interface';

@Component({
  selector: 'app-main',
  imports: [Header],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  rules = HTML_CONSTANTS.gameRules;
  gameRules = signal<boolean>(true);
  gameModel = signal<GameInterface>({
    number1: 0,
    number2: 0,
    number3: 0,
    number4: 0,
  });

  onRules(rules: boolean) {
    this.gameRules.set(rules);
  }

  protected readonly gameForm = form(this.gameModel) //, (path) => {
  //   required(path.number1, { message: 'Number 1 is required' });
  //   min(path.number1, 1, { message: 'Number 1 must be at least 1' });
  //   max(path.number1, 9, { message: 'Number 1 must be a single digit (1-9)' });

  //   required(path.number2, { message: 'Number 2 is required' });
  //   min(path.number2, 1, { message: 'Number 2 must be at least 1' });
  //   max(path.number2, 9, { message: 'Number 2 must be a single digit (1-9)' });

  //   required(path.number3, { message: 'Number 3 is required' });
  //   min(path.number3, 1, { message: 'Number 3 must be at least 1' });
  //   max(path.number3, 9, { message: 'Number 3 must be a single digit (1-9)' });

  //   required(path.number4, { message: 'Number 4 is required' });
  //   min(path.number4, 1, { message: 'Number 4 must be at least 1' });
  //   max(path.number4, 9, { message: 'Number 4 must be a single digit (1-9)' });
  // });

  onSubmit() {
    if (this.gameForm().valid()) {
      console.log('Form Submitted!', this.gameModel());
    } else {
      console.log('Form is invalid');
    }
  }

}
