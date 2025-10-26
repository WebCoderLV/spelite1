import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { GameGlobalSignal } from '../models/game-global-signal';
import { ResultsGlobalSignal } from '../models/results-global-signal';

interface GameResult {
  gameId: number;
  p: number;
  a: number;
  win: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly URL: string = 'http://localhost:8080/api/v1';

  http = inject(HttpClient);

  checkGame(gameModel: any): Observable<HttpResponse<GameResult>> {
    return this.http.post<GameResult>(`${this.URL}/game/check`, gameModel, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }

  startGame(userId: number): Observable<HttpResponse<number>> {
    return this.http.post<number>(`${this.URL}/game/start/${userId}`, null, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }
}
