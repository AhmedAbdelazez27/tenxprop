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

  getContracts(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmContract/GetAllPmcontractPortal`,
      { params: httpParams });
  }
  getPayments(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmContract/GetAllPmcontractDataForPortal`,
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


  getservices(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/JobOrder/GetAllFmMaintRequisitionsHdrPortal`,
      { params: httpParams });
  }
  Getcheckdelay(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/RequestCheckDelay/GetAllRequestCheckDelayForPortal`,
      { params: httpParams });
  }
  getContractOptions(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmContract/GetPmContractForPortalSelect2`,
      { params: httpParams });
  }

    Getnotifications(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/User/NotificationsListPortal`,
      { params: httpParams });
  }
  getContractChildrenOptions(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmContract/GetArPdcInterfaceIdSelect2`,
      { params: httpParams });
  }
  GetAllPmLocalservicePortal(params: any): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<any>(`${this.baseUrl}api/services/app/PmProperties/GetAllPmLocalservicePortal`,
      { params: httpParams });
  }
  createRequisition(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post(`${this.baseUrl}api/services/app/JobOrder/CreateService`, data, { headers });
  }
  getComplaintTypes(pageSize: number = 20, pageNumber: number = 1): Observable<any> {
    const url = `${this.baseUrl}api/services/app/FndLookupValues/GetFndLookupValuesSelect2?type=FmMaintRequisitionsHdrComplaintType&pageSize=${pageSize}&pageNumber=${pageNumber}&lang=en-US`;
    return this.http.get<any>(url);
  }
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${this.baseUrl}api/services/app/JobOrder/UploadAttach`;
    return this.http.post<any>(url, formData);
  }
  getloadUnits(id: number,propertyId: number, pageSize: number = 20, pageNumber: number = 1): Observable<any> {
    const url = `${this.baseUrl}api/services/app/JobOrder/GetPmPropertiesUnitsPortal?Id=${id}&propertyId=${propertyId}&pageSize=${pageSize}&pageNumber=${pageNumber}&lang=en-US`;
    return this.http.get<any>(url);
  }
  GetPmProperties(id: number,pageSize: number = 20, pageNumber: number = 1): Observable<any> {
    const url = `${this.baseUrl}api/services/app/PmProperties/GetPmPropertiesForPortalSelect2?Id=${id}&pageSize=20&pageNumber=1&lang=en-US`;
    return this.http.get<any>(url);
  }

  updateRequisition(payload: any): Observable<any> {
    const url = `${this.baseUrl}api/services/app/JobOrder/UpdatePortal`;
    return this.http.post<any>(url, payload);
  }

  renewContract(payload:any){
    const url = `${this.baseUrl}api/services/app/PmContract/RenewContractForPortal`;
    return this.http.post<any>(url, payload);
  }
    printPmContract(id: any, lang: string): Observable<any> {
      debugger;
    const url = `${this.baseUrl}api/services/app/PmContract/GetContractScreenDataPortal?id=${id}&lang=${lang}`;
    return this.http.get<any>(url);
  }
}