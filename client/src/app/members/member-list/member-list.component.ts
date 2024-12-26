import { Component, OnInit } from '@angular/core';
import { Member} from 'src/app/_models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { MembersService } from 'src/app/_services/members.service';
import { Observable, take } from 'rxjs';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { Gender } from 'src/app/_models/gender';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
    //members$: Observable<Member[]> | undefined; 
    members: Member[] = [];
    pagination: Pagination | undefined;
    userParams: UserParams | undefined;
    //user: User | undefined;
    genders:Gender = new Gender();
    constructor(private memberService: MembersService) {
      this.userParams = memberService.getUserParams();
    }



    ngOnInit(): void {
        //this.members$ = this.memberService.getMembers();
        //this.userParams = new UserParams();
        this.loadMembers();
        
    }
    
    loadMembers() {
      if (this.userParams) {
        this.memberService.setUserParams(this.userParams);
        this.memberService.getMembers(this.userParams).subscribe({
          next: response => {
               if (response.result && response.pagination) {
                this.members = response.result;
                this.pagination = response.pagination;
                }
            }
          });
        }
      }
      

    resetFilters() {
        this.userParams = this.memberService.resetUserParams();
        this.loadMembers();
    
    }

    pageChanged(event:any) {
      if (this.userParams && this.userParams.pageNumber !== event.page) {
        this.userParams.pageNumber = event.page;
        this.loadMembers();
      }
    }  
  
}
