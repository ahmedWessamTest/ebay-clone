import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { mainUrls } from '../environments/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly baseUrl = mainUrls.baseUrl;
  closeList: WritableSignal<boolean> = signal(true);

  getSubCategoryOnCategory(id: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/categories/${id}/subcategories`);
  }
}
