import { ResolveFn } from '@angular/router';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { inject } from '@angular/core';

export const memberDetailedResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MembersService);
  return memberService.getMember(route.paramMap.get('username')!)  
};
