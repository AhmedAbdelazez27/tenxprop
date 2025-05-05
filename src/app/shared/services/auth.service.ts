// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor(private _HttpClient: HttpClient) { }

//   logIn(data:any){
//     return this._HttpClient.post('https://core.shelfc.com/api/Auth/Login',data)
//   };

//   // saveUserDataInLocalStorage(token:any) {
//   //   localStorage.setItem("token", token)
//   // };

//   // removeUserDataFromLocalStorage() {
//   //   localStorage.removeItem("token")
//   // };

//   // getUserTokenFromLocalStorage(): string {
//   //   return localStorage.getItem("token")||''
//   // };

// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) {
    console.log("baseurl = ",this.baseUrl);

  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}api/services/app/PmTenants/Login`, data);
  };

   saveUserDataInLocalStorage(token:any) {
     localStorage.setItem("token", token)
   };
  
   removeUserDataFromLocalStorage() {
     localStorage.removeItem("token")
   };
  
   getUserTokenFromLocalStorage(): string {
     return localStorage.getItem("token")||''
   };

}
