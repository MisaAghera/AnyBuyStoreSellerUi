import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  userName? :string;
  public isUserAuthenticated: boolean = false;
  constructor(private authService: AuthenticationService,private router: Router) { }
  status: boolean = false;
  clickEvent(){
      this.status = !this.status;       
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
    this.userName = localStorage.getItem("userName")? localStorage.getItem("userName")?.toString():'';
  }
  
  ngOnInit(): void {
    this.authService.authChanged
    .subscribe(res => {
      this.isUserAuthenticated = res;
      this.userName = localStorage.getItem("userName")? localStorage.getItem("userName")?.toString():'';
    })
    
  }

 
}
