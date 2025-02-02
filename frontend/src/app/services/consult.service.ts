import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getConsults(id: any, desde: any, query?: any){
    const token = localStorage.getItem('token') || '';

    if(!query) query = '';

    return this.http.get(`${environment.apiBaseUrl}/consult`,{
      headers: {'x-token': token},
      params: {
          'idQr': id,
          'desde': desde,
          'query': query
        }
    });
  }

  // getConsultsSearch(id: any, query: any){
  //   const token = localStorage.getItem('token') || '';

  //   return this.http.get(`${environment.apiBaseUrl}/consult`,{
  //     headers: {'x-token': token},
  //     params: {
  //       'idQr': id,
  //       'query': query
  //     }
  //   });
  // }

  getConsultbyId(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/consult/${id}`,{
      headers: {'x-token': token}
    });
  }

  createConsult(formData: any){
    const token = localStorage.getItem('token') || '';

    return this.http.post(`${environment.apiBaseUrl}/consult`, formData, {
      headers: {'x-token': token}
    });
  }

  updateConsult(formData: any, id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.put(`${environment.apiBaseUrl}/consult/${id}`, formData, {
      headers: {'x-token': token}
    });
  }

  downConsult(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.patch(`${environment.apiBaseUrl}/consult/down/${id}`, null, {
      headers: {'x-token': token}
    });
  }

  upConsult(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.patch(`${environment.apiBaseUrl}/consult/up/${id}`, null, {
      headers: {'x-token': token}
    });
  }


  deleteConsult(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.delete(`${environment.apiBaseUrl}/consult/${id}`, {
      headers: {'x-token': token}
    });
  }
}
