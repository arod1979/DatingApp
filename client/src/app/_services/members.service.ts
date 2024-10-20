import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService)
  baseurl = environment.apiUrl;
 
  getMembers() {
    return this.http.get<Member[]>(this.baseurl + 'users');
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseurl + 'users/' + username);
  }

  

}
