import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../shared/services/products.service';
import { ProductModel } from '../shared/models/product-model.model';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-productsingle',
  templateUrl: './productsingle.component.html',
  styleUrls: ['./productsingle.component.css']
})
export class ProductsingleComponent implements OnInit {
  ProductDetails: ProductModel = new ProductModel();
  public isUserAuthenticated: boolean = false ;

  constructor(public authService: AuthenticationService,public route: ActivatedRoute, public ProductService: ProductService) { }

  getById(id: number): void {
    this.ProductService.getById(id).subscribe(result => {
      this.ProductDetails = result;
    });
  }

  onEditProduct(){
     

  }

  ngOnInit(): void {
    //  this.value = this.authService.canActivate;
     if (localStorage.getItem('authToken')!=null ||localStorage.getItem('authToken')!='') {    
      this.isUserAuthenticated = true
    }  
    
    this.authService.authChanged
    .subscribe(res => {
      this.isUserAuthenticated = res;
    })
    
    this.route.paramMap.subscribe(params => {
      var id = Number(params.get('id'));
      this.getById(id);
    });
  }

}
