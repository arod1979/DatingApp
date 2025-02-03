import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-model',
  templateUrl: './roles-model.component.html',
  styleUrls: ['./roles-model.component.css']
})
export class RolesModelComponent implements OnInit {
   username = "";
   availableRoles: string[] = [];
   selectedRoles: string[] = [];
   
   updateChecked(checkedValue: string) {
      const index = this.selectedRoles.indexOf(checkedValue);
      index !== -1 ? this.selectedRoles.splice(index, 1):this.selectedRoles.push(checkedValue)
   }
   
   constructor(public bsModalRef: BsModalRef) {}
  ngOnInit(): void {
  }
}
