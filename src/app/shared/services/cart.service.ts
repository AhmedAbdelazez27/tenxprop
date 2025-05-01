import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
interface UserData {
  userName: string;
  IdNumber: string;
  BeneficentName: string;
  MobileNumber1: string;
  EmailAddress: string;
  userId: string;

}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  private userData: UserData | null = null; 

  private cartCountSubject = new BehaviorSubject<number>(0);
  private userDataSubject = new BehaviorSubject<UserData | null>(null); 

  cartCount$ = this.cartCountSubject.asObservable(); 
  userData$ = this.userDataSubject.asObservable();

  constructor() {
    setTimeout(()=>{
      const item = localStorage.getItem('items');
      const parsedItem = item ? JSON.parse(item) : [];
      this.cartItems = JSON.parse(JSON.stringify(parsedItem))
    },1000)
  }
  addToCart(item: any): void { 
    if (Array.isArray(item)) {
      console.log('Item is an array:', item);
      this.cartItems = [...this.cartItems, ...item];
    } else if (item && typeof item === 'object') {
      console.log('Item is an object:', item);
      this.cartItems.push(item);
    } else {
      console.log('Item is neither an array nor an object or is null/undefined');
    }
    this.cartCountSubject.next(this.cartItems.length); 
  }

  setUserName(userData?: UserData): void {

    this.userData = userData||null; 
    localStorage.setItem('userData',JSON.stringify(userData)||"")
    this.userDataSubject.next(userData||null); 
  }

  getUserName(): UserData | null {
    return this.userData; 
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  removeFromCart(length: number): void {
    this.cartCountSubject.next(length); 
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartCountSubject.next(this.cartItems.length); 
  }

  getCartCount(): number {
    return this.cartItems.length;
  }
}
