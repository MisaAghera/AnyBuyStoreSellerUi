import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { SubcategoriesService } from '../shared/services/subcategories.service';
import { CategoryModel } from '../shared/models/category-model.model';
import { SubcategoryModel } from '../shared/models/subcategory-model.model';
import { DiscountModel } from '../shared/models/discount-model.model';
import { DiscountsService } from '../shared/services/discounts.service';
import { ProductModel } from '../shared/models/product-model.model';
import { ProductService } from '../shared/services/products.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { CustomValidation } from '../shared/providers/custom-validators';

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
  public isUserAuthenticated: boolean = false;
  selectedFile?: File;

  newProductForm: FormGroup = new FormGroup({
    productId: new FormControl(''),
      subcategory: new FormControl(''),
      discount: new FormControl(''),
      productName: new FormControl(''),
      productDescription: new FormControl(''),
      price: new FormControl(''),
      brand: new FormControl(''),
      quantity: new FormControl(''),
      productImg: new FormControl(''),
  });
  productId: number = 0;
  submitted: boolean = false;


  constructor(public ProductService: ProductService,
    public CategoriesService: CategoriesService,
    public DiscountsService: DiscountsService,
    public SubcategoriesService: SubcategoriesService,
    public authService: AuthenticationService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder) { }


  async getCategories(): Promise<void> {
    await this.CategoriesService.getAll().subscribe(result => {
      this.Categorylist = result;
    });
  }

  async onSelectSubcategory(CategoryId: number): Promise<void> {
    await this.SubcategoriesService.getAll(CategoryId).subscribe(result => {
      this.SubcategoryList = result;
    });
  }

  // onSelectFile(fileInput: any) {
  //   this.selectedFile = <File>fileInput.target.files[0];
  // }

  async getDiscounts(): Promise<void> {
    await this.DiscountsService.getAll().subscribe(result => {
      this.DiscountList = result;
    });
  }

  async onFileChanged(e: any) {
    this.selectedFile = <File>e.target.files[0];;
  }

  async onSubmit(formValues: any) {
    this.submitted = true;
    if (this.newProductForm.invalid) {
      return;
    }

    const formValue = { ...formValues };
    const formData = new FormData();
    formData.append('brand',formValue.brand);
    formData.append('description', formValue.productDescription);
    formData.append('discountId',  formValue.discount);
    formData.append('name', formValue.productName);
    formData.append('price',formValue.price);
    formData.append('productSubcategoryId',  formValue.subcategory);
    formData.append('quantity', formValue.quantity);
    formData.append('productImg', this.selectedFile!);
    let userid = localStorage.getItem("userId") ;
    formData.append('userId',userid!);
debugger
    // var productDetails: ProductModel = new ProductModel();
    // productDetails.brand = formValue.brand;
    // productDetails.description = formValue.productDescription;
    // productDetails.discountId = formValue.discount;
    // productDetails.name = formValue.productName;
    // productDetails.price = formValue.price;
    // productDetails.productSubcategoryId = formValue.subcategory;
    // productDetails.quantity = formValue.quantity;
    // productDetails.imageUrl = 'img.jpg';
    // productDetails.productImg = this.selectedFile!;
    // productDetails.userId = Number(localStorage.getItem("userId"));
    if (this.productId == 0 || this.productId == null  ) {
     debugger
      await this.ProductService.add(formData).subscribe({
        next: (_) => {
          document.getElementById("success-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.style.display = "none";
          document.getElementById("success-alert")!.innerHTML = "added successfully";
        },
        error: (err: HttpErrorResponse) =>  {
           document.getElementById("danger-alert")!.style.display = "block";
        document.getElementById("danger-alert")!.innerHTML = "something went wrong";}
      })
    }
    else {
      let productid = this.productId.toString();
      formData.append('id', productid);
      // productDetails.id = Number(this.productId);
      await this.ProductService.update(formData).subscribe({
        next: (_) =>{
          document.getElementById("success-alert")!.style.display = "block";
          document.getElementById("danger-alert")!.style.display = "none";
          document.getElementById("success-alert")!.innerHTML = "updated successfully";
        },
        error: (err: HttpErrorResponse) =>  {
           document.getElementById("danger-alert")!.style.display = "block";
        document.getElementById("danger-alert")!.innerHTML = "something went wrong";}
      })
    }
  }

  async getCategoryId(subcategoryId: number) {
    await this.CategoriesService.getBySubCategoryId(subcategoryId).subscribe(async res => {
      this.selectedCategory.id = res;
      await this.onSelectSubcategory(this.selectedCategory.id);
    }
    )
  };

  async setValuesInForm(res: any) {
    this.newProductForm.controls["productId"].setValue(res.id);
    this.newProductForm.controls["subcategory"].setValue(res.productSubcategoryId);
    this.newProductForm.controls["discount"].setValue(res.discountId);
    this.newProductForm.controls["productName"].setValue(res.name);
    this.newProductForm.controls["productDescription"].setValue(res.description);
    this.newProductForm.controls["price"].setValue(res.price);
    this.newProductForm.controls["brand"].setValue(res.brand);
    this.newProductForm.controls["quantity"].setValue(res.quantity);
    
    this.productId = res.id;
  }

  async initialValues(productId: number) {
    await this.ProductService.getById(productId).subscribe(
      async res => {
        await this.getCategories();
        await this.getCategoryId(res.productSubcategoryId);
        await this.setValuesInForm(res);
      }
    )
  }

  
 
  ngOnInit(): void {

    this.newProductForm = this.formBuilder.group({
      productId:  [''],
      subcategory: ['', [Validators.required]],
      discount:  [''],
      productName:  ['', [Validators.required]],
      productDescription:  ['', [Validators.required]],
      price:  ['', [Validators.required]],
      brand:  ['', [Validators.required]],
      quantity:  ['', [Validators.required]],
      productImg:['',[Validators.required]]
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
  get f(): { [key: string]: AbstractControl } {
    return this.newProductForm.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.newProductForm.reset();
  }
}

// class InModel {
//   In: ProductModel = new ProductModel();
// }