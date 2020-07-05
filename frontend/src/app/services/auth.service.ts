import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  login(form: {email: string; password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/api/users/login`, form)
      .pipe(
        tap(response => {
          this.user$.next(response.user);
          this.setToken('token', response.accessToken);
          this.setToken('refreshToken', response.refreshToken);
        })
      );
  }

  register(form: {email: string; password: string; name: string}) {
    return this.http.post(`/api/users/signup`, form);
  }

  getCurrentUser(): Observable<User> {
    return this.user$.pipe(
      switchMap(user => {
        // check if we already have user data
        if (user) {
          return of(user);
        }

        const token = localStorage.getItem('token');
        // if there is token then fetch the current user
        if (token) {
          return this.fetchCurrentUser();
        }

        return of(null);
      })
    );
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`/api/users/current-user`)
      .pipe(
        tap(user => {
          this.user$.next(user);
        })
      );
  }

  refreshToken(): Observable<{accessToken: string; refreshToken: string}> {
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<{accessToken: string; refreshToken: string}>(`/api/users/refresh-token`,
      {
        refreshToken
      }).pipe(
        tap(response => {
          this.setToken('token', response.accessToken);
          this.setToken('refreshToken', response.refreshToken);
        })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.user$.next(null);
  }

  private setToken(key: string, token: string): void {
    localStorage.setItem(key, token);
  }
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

interface RegisterResponse{
  message: string;
}