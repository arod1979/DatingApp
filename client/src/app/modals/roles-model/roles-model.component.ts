import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-model',
  templateUrl: './roles-model.component.html',
  styleUrls: ['./roles-model.component.css']
})
export class RolesModelComponent implements OnInit {
   title = "";
   availableRoles: string[] = [];
   selectedRoles: string[] = [];
   username = '';
   
   constructor(public bsModalRef: BsModalRef) {}
   ngOnInit(): void {

   }

   updateChecked(checkedValue: string) {
     if (this.selectedRoles.includes(checkedValue)) {
        this.selectedRoles = this.selectedRoles.filter(r => r !== checkedValue)
     }else{
      this.selectedRoles.push(checkedValue);
     }
   }
}
