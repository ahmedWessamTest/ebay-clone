import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mainUrls } from '../environments/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly _HttpClient = inject(HttpClient);

  getBrands(page: number):Observable<any> {
    return this._HttpClient.get(`${mainUrls.baseUrl}/api/v1/brands?page=${page}`);
  }
}
