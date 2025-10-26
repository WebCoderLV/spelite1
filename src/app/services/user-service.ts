import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly URL: string = 'http://localhost:8080/api/v1';

  private http: HttpClient = inject(HttpClient);

  logIn(userData: Signal<any>): Observable<HttpResponse<number>> {
    return this.http.post<number>(this.URL + '/user', userData(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }

  deleteAccount(userId: number): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.URL}/user/${userId}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    });
  }

}
