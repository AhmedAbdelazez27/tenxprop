import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingService {
  // private baseUrl = 'http://compassint.ddns.net:2036/api/services/app/'
    private baseUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }

  getContracts(params:any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmContract/GetAllPmcontractPortal`,
      { params: httpParams });
  }
  getPayments(params:any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmContract/GetAllPmcontractDataForPortal`,
      { params: httpParams });
  }
  getservices(params:any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/JobOrder/GetAllFmMaintRequisitionsHdrPortal`,
      { params: httpParams });
  }
 
  GetAllPmLocalservicePortal(params:any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmContract/GetAllPmLocalservicePortal`,
      { params: httpParams });
  }

  createRequestChequeDelay(requestData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}api/services/app/RequestCheckDelay/CreateRequestCheckDelay`, requestData);
  };

  uploadAttachment(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.baseUrl}api/services/app/RequestCheckDelay/UploadAttach`, formData);
  };

}