import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mainUrls } from '../environments/baseUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly baseUrl = mainUrls.baseUrl;

  getProducts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/products`);
  }
  getSpecificProduct(id: string): Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/api/v1/products/${id}`);
  }
  getProductsPagination(page: number):Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/api/v1/products?page=${page}`)
  }
  getProductsWithCategory(catId: string, page: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/products?page=${page}&category[in]=${catId}`)
  }
  getProductsWithSubCategory(catId: string, subCatId: string, page: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/products?page=${page}&category[in]=${catId}&category[in]=${subCatId}`);
  }
  getProductsWithBrand(page: number, brandId:string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/products?page=${page}&brand=${brandId}`);
  }


}
