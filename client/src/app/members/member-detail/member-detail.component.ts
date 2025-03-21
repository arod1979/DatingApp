import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];

  constructor(private route: ActivatedRoute, private memberService: MembersService, 
    private messageService: MessageService) {}

  ngOnInit(): void {
      this.route.data.subscribe({
          next: data => this.member = data['member']
      })

      this.route.queryParams.subscribe({
          next: params => {
            params['tab'] && this.selectTab(params['tab'])
          }
      })

      this.getImages();

      
  }
  
   onTabActivated(data:TabDirective) {
       this.activeTab = data;
       if (this.activeTab.heading == "Messages") {
          this.loadMessages();
       }
   }

   loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: response => this.messages =response
      })
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  getImages() {
    if (!this.member) return;
    for (const photo of this.member?.photos) {
      this.images.push(new ImageItem({src:photo.url, thumb: photo.url}))
    }
  }
}
