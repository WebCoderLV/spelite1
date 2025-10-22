import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../models/user-interface';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly URL: string = 'http://localhost:8080/api/v1';

  private http: HttpClient = inject(HttpClient);

  logIn(userData: UserInterface): Observable<HttpResponse<number>> {
    return this.http.post<number>(this.URL + '/user', userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response',
    });
  }

}
