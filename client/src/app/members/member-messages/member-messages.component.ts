import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
  imports: [CommonModule]
})
export class MemberMessagesComponent implements OnInit {
  @Input() messages:Message[] = [];
  @Input() username?: string;
  constructor(){}

  ngOnInit(): void {
    
  }



}
