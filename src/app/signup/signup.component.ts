import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserForRegistrationModel } from '../shared/models/user-for-registration-model.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      userName: new FormControl(''),
      gender: new FormControl(''),
      age: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('')
    });
  }

  // public validateControl = (controlName: string) => {
  //   return this.registerForm.get(controlName).invalid && this.registerForm.get(controlName).touched
  // }

  // public hasError = (controlName: string, errorName: string) => {
  //   return this.registerForm.get(controlName).hasError(errorName)
  // }

  registerUser = (registerFormValue:any) => {
    const formValues = {... registerFormValue };
  
    
    var userForRegister: InModel = new InModel();
    userForRegister.In.username = formValues.username;
    userForRegister.In.password = formValues.password;
    userForRegister.In.age = formValues.age;
    userForRegister.In.gender = formValues.gender;
    userForRegister.In.confirmPassword = formValues.confirmPassword;
    userForRegister.In.email = formValues.email;
  
    this.authService.registerUser(userForRegister)
    .subscribe({
      next: (_) => console.log("Successful registration"),
      error: (err: HttpErrorResponse) => console.log(err.error.errors)
    })
  }
}
class InModel{
  In: UserForRegistrationModel = new UserForRegistrationModel();
}


