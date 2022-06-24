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
import { AuthenticationService } from '../shared/services/authentication.service';
import { ActivatedRoute } from '@angular/router';

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
  file: any;
  public isUserAuthenticated: boolean = false;
  //selectedFile?: File;

  newProductForm: FormGroup = new FormGroup({});
  labelImport: any;
  profileForm: any;
  productId :number =0;

  constructor(public ProductService: ProductService,
    public CategoriesService: CategoriesService,
    public DiscountsService: DiscountsService,
    public SubcategoriesService: SubcategoriesService,
    public authService: AuthenticationService
    , public route: ActivatedRoute) { }

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

  onFileChanged(e: any) {
    this.file = e.target.files[0];
  }

  onSubmit = (formValues: any) => {

    const formValue = { ...formValues };

    var productDetails: InModel = new InModel();
    productDetails.In.brand = formValue.brand;
    productDetails.In.description = formValue.productDescription;
    productDetails.In.discountId = formValue.discount;
    productDetails.In.name = formValue.productName;
    productDetails.In.price = formValue.price;
    productDetails.In.productSubcategoryId = formValue.subcategory;
    productDetails.In.quantity = formValue.quantity;
    productDetails.In.imageUrl = 'img.jpg';
    // productDetails.In.productImg = this.file;
    productDetails.In.userId = Number(localStorage.getItem("userId"));

debugger
if(this.productId ==0 && this.productId==null){
  this.ProductService.add(productDetails).subscribe({
    next: (_) => console.log("Successfully added"),
    error: (err: HttpErrorResponse) => console.log(err.error.errors)
  })
}
else{
  productDetails.In.id =Number(this.productId);
  productDetails.In.imageUrl = "img.jpg";
  this.ProductService.update(productDetails).subscribe({
    next: (_) => console.log("Successfully updated"),
    error: (err: HttpErrorResponse) => console.log(err.error.errors)
  })
}
  
  }
  initialValues(productId: number) {
    this.ProductService.getById(productId).subscribe(
      res => {
        this.newProductForm.controls["productId"].setValue(res.id);
        this.newProductForm.controls["subcategory"].setValue(res.productSubcategoryId);
        this.newProductForm.controls["discount"].setValue(res.discountId);
        this.newProductForm.controls["productName"].setValue(res.name);
        this.newProductForm.controls["productDescription"].setValue(res.description);
        this.newProductForm.controls["price"].setValue(res.price);
        this.newProductForm.controls["brand"].setValue(res.brand);
        this.newProductForm.controls["quantity"].setValue(res.quantity);
        //img
        this.productId = res.id;
      }
    )
    debugger
  }

  ngOnInit(): void {
    this.newProductForm = new FormGroup({
      productId :new FormControl(''),
      subcategory: new FormControl(''),
      discount: new FormControl(''),
      productName: new FormControl(''),
      productDescription: new FormControl(''),
      price: new FormControl(''),
      brand: new FormControl(''),
      quantity: new FormControl(''),
      //formFileImg: new FormControl(''),
    });
    this.authService.authChanged
      .subscribe(res => {
        this.isUserAuthenticated = res;
      })

    this.getCategories();
    this.onSelectSubcategory(this.selectedCategory.id);
    this.getDiscounts();

    this.route.paramMap.subscribe(params => {
      var productId = Number(params.get('id'));
      this.initialValues(productId);
    });

  }
}


class InModel {
  In: ProductModel = new ProductModel();
}