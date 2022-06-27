import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthResponseModel } from '../models/auth-response-model.model';
import { of,Observable, Subject, BehaviorSubject } from 'rxjs';
import { GlobalConstants } from '../global-constants.model';
import { UserForAuthenticationModel } from '../models/user-for-authentication-model.model';
import { UserForRegistrationModel } from '../models/user-for-registration-model.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  formDataLogin: UserForAuthenticationModel = new UserForAuthenticationModel();
  readonly LoginUrl = GlobalConstants.apiURL + 'Authenticate/Login';
  readonly RegisterUrl = GlobalConstants.apiURL + 'Authenticate/RegisterSeller';
  private authChangeSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authChanged: Observable<boolean> = this.authChangeSub.asObservable();
  
  constructor(public router: Router,public http: HttpClient, public fb: FormBuilder) { }

  loginUser(body: InModelAuth): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(this.LoginUrl, body)
  }

  registerUser(body: InModelRegister) {
    return this.http.post(this.RegisterUrl, body);
  }

  checkIfAuthenticated(){
    debugger
    let token = localStorage.getItem('token')?.toString();
    if(token ==''|| token==null){
      this.sendAuthStateChangeNotification(false);
    }
    else{
      this.sendAuthStateChangeNotification(true);
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    this.sendAuthStateChangeNotification(false);
  }
  sendAuthStateChangeNotification(isAuthenticated: boolean) {
    this.authChangeSub.next(isAuthenticated);
  }
}


class InModelAuth {
  In: UserForAuthenticationModel = new UserForAuthenticationModel();
}
class InModelRegister {
  In: UserForRegistrationModel = new UserForRegistrationModel();
}
