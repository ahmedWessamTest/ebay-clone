import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { mainUrls } from '../environments/baseUrl';
import { jwtDecode } from 'jwt-decode';
import { IUserToken } from '../interfaces/iuser-token';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { IUserData } from '../interfaces/iuser-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
  private readonly baseUrl = mainUrls.baseUrl;
  globalUserToken: WritableSignal<IUserToken> = signal({} as IUserToken);
  globalUserData: WritableSignal<IUserData> = signal({} as IUserData);

  setRegister(data: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/api/v1/auth/signup`, data)
  }
  setLogin(data: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/api/v1/auth/signin`, data)
  }
  setUserToken(): void {
    if (localStorage.getItem('userToken')) {
      this.globalUserToken.set(jwtDecode(localStorage.getItem('userToken')!));
    }
  }
  logOut(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData')
    this.globalUserToken.set(null!);
    this._Router.navigate(['/login']);
  }
  setForgotPassword(data: string): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }
  setVerifyCode(data: string): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }
  setResetPassword(data: string): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/api/v1/auth/resetPassword`, data);
  }
  saveUserData(data: object): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      localStorage.setItem('userData', JSON.stringify(data));
    }
  }
  pathUserData(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (localStorage.getItem('userData')) {
        this.globalUserData.set(JSON.parse(localStorage.getItem('userData')!));
      }
    }
  }

}
