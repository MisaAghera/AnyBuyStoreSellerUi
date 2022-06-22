import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { DiscountModel } from '../shared/models/discount-model.model';
import { DiscountsService } from '../shared/services/discounts.service';
import { ProductModel } from '../shared/models/product-model.model';
import { ProductService } from '../shared/services/products.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  selectedCategory: CategoryModel = new CategoryModel();
  Categorylist?: CategoryModel[];
  SubcategoryList?: SubcategoryModel[];
  DiscountList?: DiscountModel[];
  file :any;
  //selectedFile?: File;

  newProductForm : FormGroup = new FormGroup({});
  labelImport: any;
  profileForm: any;

  constructor(public ProductService:ProductService,
    public CategoriesService: CategoriesService, 
    public DiscountsService: DiscountsService,
     public SubcategoriesService: SubcategoriesService) { }
 
  getCategories(): void {
    this.CategoriesService.getAll().subscribe(result => {
      this.Categorylist = result;
    });
  }

  onSelectSubcategory(CategoryId: number): void {
    this.SubcategoriesService.getAll(CategoryId).subscribe(result => {
      this.SubcategoryList = result;
    });
  }

  // onSelectFile(fileInput: any) {
  //   this.selectedFile = <File>fileInput.target.files[0];
  // }
  
  getDiscounts(): void {
    this.DiscountsService.getAll().subscribe(result => {
      this.DiscountList = result;
    });
  }

  onFileChanged(e:any) {
    this.file = e.target.files[0];
  }

  onSubmit =(formValues :any)=>{
    debugger
    const formValue = {...formValues};

    var productDetails :InModel = new InModel();
    productDetails.In.brand = formValue.brand;
    productDetails.In.description = formValue.productDescription;
    productDetails.In.discountId = formValue.discount;
    productDetails.In.name = formValue.productName;
    productDetails.In.price = formValue.price;
    productDetails.In.productSubcategoryId = formValue.subcategory;
    productDetails.In.quantity = formValue.quantity;
   productDetails.In.imageUrl = 'img.jpg';
   // productDetails.In.productImg = this.file;
    productDetails.In.userId = 2;

    this.ProductService.add(productDetails).subscribe({
      next: (_) => console.log("Successfully added"),
      error: (err: HttpErrorResponse) => console.log(err.error.errors)
    })
  }

  ngOnInit(): void {
 this.newProductForm = new FormGroup({
  subcategory: new FormControl(''),
  discount: new FormControl(''),
  productName: new FormControl(''),
  productDescription: new FormControl(''),
  price: new FormControl(''),
  brand: new FormControl(''),
  quantity: new FormControl(''),
  //formFileImg: new FormControl(''),
 });
    this.getCategories();
    this.onSelectSubcategory(this.selectedCategory.id);
    this.getDiscounts();
  }
}


class InModel{
  In: ProductModel = new ProductModel();
}