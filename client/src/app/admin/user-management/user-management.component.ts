import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModelComponent } from 'src/app/modals/roles-model/roles-model.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[]=[];
  bsModalRef: BsModalRef<RolesModelComponent> = new BsModalRef<RolesModelComponent>();
  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ];
  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
   this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    })
  }

  openRolesModal(user:User) {
    const config = {
      class:'modal-lg',
      initialState:{
        username: user.username,
        title: 'User roles',
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
        }
      
      }
    
      this.bsModalRef = this.modalService.show(RolesModelComponent, config);

      this.bsModalRef.onHide?.subscribe(() => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayEqual(selectedRoles!, user.roles))
        {
          this.adminService.updateUserRole(user.username, selectedRoles!).subscribe({
             next: roles => user.roles = roles
          })
        }
      })
    }
    private arrayEqual(arr1: any[], arr2: any[])
    {
      return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
    }
  
}
