import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone : false,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;
  genders = [
      {text: 'man', value: 'man'},
      {text: 'woman', value: 'woman'},
      {text: 'Cis man', value: 'Cis man'},
      {text: 'Cis woman', value: 'Cis woman'},
      {text: 'Trans woman', value: 'Trans woman'},
      {text: 'Trans man', value: 'Trans man'},
      {text: 'Non-binary', value: 'Non-binary'},    
  ];


  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  matchValues(matchTo: string) : ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null: {notmatching: true}
    }
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      sex: ['male', Validators.required],
      gender: ['man', Validators.required], 
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
       
    })
  }

  constructor(private accountService:AccountService, private toastr:ToastrService, private fb: FormBuilder, private router: Router) {}

  register() {
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth: dob}; 
    console.log(values);
    this.accountService.register(values).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
        },
        error: error => this.validationErrors = error
     })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob:string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset())).toISOString().slice(0,10);

  }




}
