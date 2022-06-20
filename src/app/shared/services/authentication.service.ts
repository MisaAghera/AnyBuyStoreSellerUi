import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthResponseModel } from '../models/auth-response-model.model';
import { Observable, Subject } from 'rxjs';
import { GlobalConstants } from '../global-constants.model';
import { UserForAuthenticationModel } from '../models/user-for-authentication-model.model';
import { UserForRegistrationModel } from '../models/user-for-registration-model.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  formDataLogin: UserForAuthenticationModel = new UserForAuthenticationModel();
  readonly LoginUrl = GlobalConstants.apiURL + 'Authenticate/Login';
  readonly RegisterUrl = GlobalConstants.apiURL + 'Authenticate/RegisterCustomer';

  private authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  loginUser(body: InModelAuth): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(this.LoginUrl, body)
  }

  registerUser(body: InModelRegister) {
    return this.http.post(this.RegisterUrl, body);
  }

  logout() {
    localStorage.removeItem("token");
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
