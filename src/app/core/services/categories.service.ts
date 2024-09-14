import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mainUrls } from '../environments/baseUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly baseUrl = mainUrls.baseUrl;


  getAllCategories():Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/categories`);
  }

  getSpecificCategory(id:string):Observable<any>{
    return this._HttpClient.get(`${this.baseUrl}/api/v1/categories/${id}`);
  }
}
