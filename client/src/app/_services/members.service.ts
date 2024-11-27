import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { AccountService } from './account.service';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService)
  baseurl = environment.apiUrl;

  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;
  
  getMembers(page?:number, itemsPerPage?: number) {
    let params = new HttpParams();
    if (page && itemsPerPage){
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);

    }
    // if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseurl + 'users', {observe:'response', params}).pipe(
      map(response => {
         if (response.body) {
          this.paginatedResult.result = response.body;
         }
         const pagination = response.headers.get('Pagination');
         if (pagination) {
          this.paginatedResult.pagination = JSON.parse(pagination);
         }
         return this.paginatedResult;
      })
    )
  }

  getMember(username: string) {
    const member = this.members.find(x=>x.userName === username);
    if (member) return of(member);

    return this.http.get<Member>(this.baseurl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseurl + 'users', member).pipe(
      map(() => {
         const index = this.members.indexOf(member);
         this.members[index] = {...this.members[index], ...member};
           
      })
    )

  }

  setMainPhoto(photoId:number) 
  {
    return this.http.put(this.baseurl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId:number)
  {
      return this.http.delete(this.baseurl + 'users/delete-photo/' + photoId);
  }
  

}
