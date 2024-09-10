import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { mainUrls } from '../environments/baseUrl';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly baseUrl = mainUrls.baseUrl;
  wishListUpdate: WritableSignal<IProduct[]> = signal([]);
  setWishList(productId: string): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/api/v1/wishlist`, {
      "productId": productId
    })
  }
  removeWishlist(productId: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/api/v1/wishlist/${productId}`);
  }
  getUserWishList(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/wishlist`);
  }
}
