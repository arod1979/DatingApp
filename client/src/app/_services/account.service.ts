import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseURL = 'https://localhost:5001/api/';
  constructor(private http: HttpClient) { }
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  login(model:User) {
    return this.http.post<User>(this.baseURL+ 'account/login', model).pipe(
      map((response:any) => {
         const user = response;
         if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
         }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseURL+ 'account/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    console.log('hello');
    this.currentUserSource.next(null);
  }
}

