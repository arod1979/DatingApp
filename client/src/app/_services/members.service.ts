import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { AccountService } from './account.service';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService)
  baseurl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams | undefined;
  
  constructor() {
    this.userParams = new UserParams();
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams:UserParams) {
    this.userParams =  userParams;
  }

  resetUserParams() {
    this.userParams = new UserParams();
    return this.userParams;
  }

  getMembers(userParams: UserParams) {

    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    // if (this.members.length > 0) return of(this.members);
    return this.getPaginatedResult<Member[]>(this.baseurl+'users', params).pipe
    (map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }
    ))
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
    const member = [...this.memberCache.values()]
      .reduce((arr, elem)=>arr.concat(elem.result), [])
      .find((member:Member)=>member.userName === username);

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
  
  addLike(username:string)
  {
      return this.http.post(this.baseurl + 'likes/' + username, {})
  }

  getLikes(predicate:string)
  {
    return this.http.get<Member[]>(this.baseurl + 'likes?predicate=' + predicate);
  }

}
