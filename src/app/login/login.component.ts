import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponseModel } from '../shared/models/auth-response-model.model';
import { UserForAuthenticationModel } from '../shared/models/user-for-authentication-model.model';
import { AuthenticationService } from '../shared/services/authentication.service';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  });
  
  errorMessage: string = '';
  showError: boolean | undefined;

  constructor(private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
      }
    );
  }


  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

  loginUser = (loginFormValue: any) => {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const login = { ...loginFormValue };

    var userForAuth: InModel = new InModel();
    userForAuth.In.username = login.username;
    userForAuth.In.password = login.password;
    this.authService.loginUser(userForAuth)
      .subscribe({
        next: (res: AuthResponseModel) => {
          document.getElementById("success-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.style.display = "none";
          document.getElementById("success-alert")!.innerHTML = "logged in successfully";
          localStorage.setItem("refreshtoken",res.refreshtoken!);
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.userId!.toString());
          localStorage.setItem("userName",res.userName!.toString());
          this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
          this.router.navigate(["/orders"]);
          
        },
        error: (err: HttpErrorResponse) => {
          document.getElementById("danger-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.innerHTML = "either username or password incorrect";
          this.errorMessage = err.message;
          this.showError = true;
        }
      })
  }
}


class InModel {
  In: UserForAuthenticationModel = new UserForAuthenticationModel();
}