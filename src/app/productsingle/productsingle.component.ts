import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../shared/services/products.service';
import { ProductModel } from '../shared/models/product-model.model';
import { AuthenticationService } from '../shared/services/authentication.service';
import { DiscountModel } from '../shared/models/discount-model.model';
import { DiscountsService } from '../shared/services/discounts.service';
@Component({
  selector: 'app-productsingle',
  templateUrl: './productsingle.component.html',
  styleUrls: ['./productsingle.component.css']
})
export class ProductsingleComponent implements OnInit {
  ProductDetails: ProductModel = new ProductModel();
  DiscountDetails: DiscountModel = new DiscountModel();
  public isUserAuthenticated: boolean = false;
  public isValidProductOwner:boolean = false;

  constructor(public authService: AuthenticationService,
    public route: ActivatedRoute,
    public ProductService: ProductService,
    public DiscountService: DiscountsService) { }

  async getById(id: number): Promise<void> {
   await this.ProductService.getById(id).subscribe(async result => {
      this.ProductDetails = result;
      await this.getDiscountFunction(result);
      await this.IsValidOwner(result);
    });

  }

  async getDiscountFunction(result: ProductModel) {
    await this.DiscountService.GetById(result.discountId!).subscribe(
      res => {
        this.DiscountDetails = res;
      }
    );
  }

  async IsValidOwner(result:ProductModel)
  {
    debugger
    var userId  = Number(localStorage.getItem("userId"));
     this.isValidProductOwner = result.userId==userId?true:false;

  }

  ngOnInit(): void {
    
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
