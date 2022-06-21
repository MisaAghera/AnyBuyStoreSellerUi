import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/products.service'; 
import { ProductModel } from '../shared/models/product-model.model'; 
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() Product? :ProductModel;
  constructor(public service:ProductService) { }
  
  ngOnInit(): void {
    this.Product;
  }
 
}


