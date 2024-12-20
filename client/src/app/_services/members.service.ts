import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { AccountService } from './account.service';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService)
  baseurl = environment.apiUrl;

  members: Member[] = [];
  
  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    // if (this.members.length > 0) return of(this.members);
    return this.getPaginatedResult<Member[]>(this.baseurl+'users', params)
  }

  private getPaginatedResult<T>(url:string, params: HttpParams) {
    const paginatedResult:PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber:number, pageSize:number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
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
