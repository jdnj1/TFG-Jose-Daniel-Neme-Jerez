import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getQr(){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/qr/`,{
      headers: {'x-token': token}
    });
  }

  updateQr(formData: any, id: Number){
    const token = localStorage.getItem('token') || '';

    return this.http.put(`${environment.apiBaseUrl}/qr/${id}`, formData, {
      headers: {'x-token': token},
    });
  }

  deleteQr(id: Number){
    const token = localStorage.getItem('token') || '';

    return this.http.delete(`${environment.apiBaseUrl}/qr/${id}`,{
      headers: {'x-token': token},
    });
  }

}

