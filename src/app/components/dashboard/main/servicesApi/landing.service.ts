import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingService {
  // private baseUrl = 'http://compassint.ddns.net:2036/api/services/app/'
  private baseUrl = 'https://api.saudcharity.ae/api/services/app/'
  constructor(private http: HttpClient) { }

  getSlider(): Observable<any> {
    
    return this.http.get<any>(`${this.baseUrl}PrSliderSettings/GetAllSliders`);
  }
  getDonations(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteQuickDonation/GetAllWebsiteQuickDonation`)
  }

  getEmergencys(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}TmProjectCampain/GetWebsiteTmProjectCampain `)
  }

  getSingleEmergency(id:any): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}TmProjectCampain/GetWebsiteTmProjectCampain?Id=${id}`)
  }

  getAllWebsiteStatistic(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteStatistics/GetAllWebsiteStatistic?IsActive=true&StatisticsTypeLkpId=12442`)
  }

  getAllHalls(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteHallsCouncils/GetAllWebsiteHallsCouncils?HallsCouncilsTypeLkpId=12450`)
  }

  getAllCouncils(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteHallsCouncils/GetAllWebsiteHallsCouncils?HallsCouncilsTypeLkpId=12451`)
  }

  getSingleHallCouncils(id:any): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteHallsCouncils/GetDetailForWebsiteById?Id=${id}`)
  }

  getAllTmAutoCouponsForWebsite(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}TmAutoCoupons/GetAllTmAutoCouponsForWebsite`)
  }

  getAllPartnersForWebsite():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}WebsiteOurPartners/GetAllWebsiteOurPartnersForWebsite `)
  }

}
