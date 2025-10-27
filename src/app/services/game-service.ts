import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GameResult } from '../models/game-interfaces';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly URL = 'http://localhost:8080/api/v1';
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as const
  };

  private readonly http = inject(HttpClient);

  checkGame(gameModel: any): Observable<HttpResponse<GameResult>> {
    return this.http.post<GameResult>(`${this.URL}/game/check`, gameModel, this.httpOptions);
  }

  startGame(userId: number): Observable<HttpResponse<number>> {
    return this.http.post<number>(`${this.URL}/game/start/${userId}`, null, this.httpOptions);
  }
}
