import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mainUrls } from '../environments/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly _HttpClient = inject(HttpClient)
  private readonly baseUrl = mainUrls.baseUrl
  getAllOrders(userId: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/api/v1/orders/user/${userId}`)
  }
  setCheckOut(cartId: string, checkoutObject: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${mainUrls.baseServerUrl}`, {
      "shippingAddress": checkoutObject
    })
  }
}
