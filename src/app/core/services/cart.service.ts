import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { mainUrls } from '../environments/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly baseUrl = mainUrls.baseUrl;
  cartNumber: WritableSignal<number> = signal(0);
  addProductToCart(productId: string): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/api/v1/cart`,
      {
        "productId": productId
      }
    )
  }
  getCartProducts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/cart`);
  }
  removeCartItem(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/api/v1/cart/${id}`);
  }
  updateCartProduct(id: string, count: number): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/api/v1/cart/${id}`, {
      "count": count
    })
  }
  clearCartItems():Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/api/v1/cart`);
  }


}
