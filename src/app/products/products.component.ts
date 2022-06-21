import { Component, OnInit,Input } from '@angular/core';
import { ProductService } from '../shared/services/products.service'; 
import { ProductModel } from '../shared/models/product-model.model';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @Input() SubcategoryId :number = 0;
  ProductList? : ProductModel[];

  constructor(public service:ProductService) { }

  getProducts(SubcategoryId: number): void{
    this.service.getAllBySubcategoryId(SubcategoryId).subscribe(result =>{
      this.ProductList = result;
    });
  }
  // getProducts():void{
  //   this.service.getAll();
  // }
   ngOnInit() {
    this.getProducts(this.SubcategoryId);
  }
 

}
