import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IProductVariantsCreate } from '../../core/Models/IProductVariantsCreate';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [FormsModule , ReactiveFormsModule , CommonModule],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.css'
})
export class StepTwoComponent {


  constructor(private _route:ActivatedRoute , private _http:HttpClient , private fb: FormBuilder) {
   this.productId = this._route.snapshot.params['id'];
   console.log(this.productId)

   this.uploadForm = this.fb.group({
    file: [null]
  });
  }
  productId:number = 0
  ProductVariant:IProductVariantsCreate = {} as IProductVariantsCreate
  UploadSuccess:boolean = false
  uploadForm: FormGroup;
selectedFile: File = {} as File;
  ProductForm:FormGroup = new FormGroup({
    color:new FormControl('',[Validators.required , Validators.minLength(3)]),
    size:new FormControl('',[Validators.required]),
    quantity:new FormControl('',[Validators.required , Validators.min(1)]),})

    uploaded:boolean = false
    ImagePath:string = ``




UploadImage(file:File):Observable<any>
{
   const FormDat = new FormData()
   FormDat.append('file' , file)
   return this._http.post(`https://localhost:44322/api/Product/upload` ,FormDat )
}

onFileSelect(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
  this.uploaded = true
}


onSubmit() {
  const formData = new FormData();
  formData.append('file', this.selectedFile); // 'file' should match the parameter name in the backend

  // Make HTTP request to your backend endpoint
  this._http.post<{message:string , filePath:string}>('https://localhost:44322/api/Product/upload', formData)
    .subscribe(response => {
      this.ImagePath = response.filePath
      this.UploadSuccess = true;
      console.log('Upload successful', response);
    }, error => {
      console.error('Upload error', error);
    });
}


AddProduct()
{
    this.ProductVariant.color = this.ProductForm.controls['color'].value
    this.ProductVariant.size = this.ProductForm.controls['size'].value
    this.ProductVariant.image = this.ImagePath
    this.ProductVariant.productId = this.productId
    this.ProductVariant.quantity = this.ProductForm.controls['quantity'].value
    console.log(this.ProductVariant)

    this._http.post<{success:boolean , data:IProductVariantsCreate,message:string}>
    (`https://localhost:44322/api/Product/CreateProductVariant`, this.ProductVariant)
    .subscribe((res)=>{
      console.log(res)
    })




}




}
