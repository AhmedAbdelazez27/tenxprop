// src/app/services/payment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  // private apiUrl = 'http://compassint.ddns.net:2036/api/payment/PaymentRequest'; // Your backend API endpoint
  private apiUrl = 'https://api.saudcharity.ae/api/payment/PaymentRequest'; // Your backend API endpoint

  constructor(private http: HttpClient) {}

  /**
   * This method sends a payment request to the backend to create a payment session.
   * @param paymentData Data for the payment request (order ID, amount, etc.)
   * @returns Observable of the backend response containing accessCode and encRequest.
   */
  createPaymentSession(paymentData: any): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }
}
