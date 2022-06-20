import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponseModel } from '../shared/models/auth-response-model.model'; 
import { UserForAuthenticationModel } from '../shared/models/user-for-authentication-model.model'; 
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service'; 
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  private returnUrl: string | undefined; 

  loginForm: FormGroup = new FormGroup({});
  errorMessage: string = '';
  showError: boolean | undefined;

  constructor(private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // validateControl = (controlName: string) => {
  //   return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched
  // }

  // hasError = (controlName: string, errorName: string) => {
  //   return this.loginForm.get(controlName).hasError(errorName)
  // }
  
  loginUser = (loginFormValue:any) => {
    this.showError = false;
    const login = {... loginFormValue };
  
    
    var userForAuth: InModel = new InModel();
    userForAuth.In.username = login.username;
    userForAuth.In.password = login.password;


    this.authService.loginUser(userForAuth)
    .subscribe({
      next: (res:AuthResponseModel) => {
       localStorage.setItem("token", res.token);
       this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
       this.router.navigate([this.returnUrl]);
    },
    error: (err: HttpErrorResponse) => {
      this.errorMessage = err.message;
      this.showError = true;
    }})
  
  }
}


class InModel{
  In: UserForAuthenticationModel = new UserForAuthenticationModel();
}