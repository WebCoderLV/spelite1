import { Injectable, signal } from '@angular/core';

interface GameResult {
  gameId: number;
  p: number;
  a: number;
  win: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ResultsGlobalSignal {
  public result = signal<GameResult>({
    gameId: 0,
    p: 0,
    a: 0,
    win: false
  });
}
