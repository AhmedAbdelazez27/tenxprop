import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient: HttpClient) { }

  // logIn(data:any){
  //   return this._HttpClient.post('https://core.shelfc.com/api/Auth/Login',data)
  // };

  // saveUserDataInLocalStorage(token:any) {
  //   localStorage.setItem("token", token)
  // };

  // removeUserDataFromLocalStorage() {
  //   localStorage.removeItem("token")
  // };

  // getUserTokenFromLocalStorage(): string {
  //   return localStorage.getItem("token")||''
  // };

}
