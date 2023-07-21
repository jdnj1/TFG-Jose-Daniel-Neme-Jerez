import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { loginform } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(formData: any){
    return this.http.post(`${environment.apiBaseUrl}/login`, formData).pipe(
      tap((res: any) =>{
        // Se almacena el token en el localStorage del navegador
        localStorage.setItem('token', res.token);
        // Se almacena tambien los datos del usuario menos su contraseña por seguridad
        delete res.user.password;
        localStorage.setItem('user', JSON.stringify(res.user));
        console.log(formData.remember)
        // Si se marca el boton recordar se guarda el email en el localStorage
        if(formData.remember){
          localStorage.setItem('email', formData.email);
        }
        else{
          localStorage.removeItem('email');
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  validateToken(){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/login/token`, {
      headers: {'x-token': token}
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      }),
      map((res: any) => {
        return true;
      }),
      catchError(err => {
        console.warn(err);
        localStorage.removeItem('token');
        return of(false);
      })
    );
  }

  // Funciones GET, POST, PUT y DELETE de los usuarios
  getUsers(desde: any){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/users`, {
      headers: {'x-token': token},
      params: {'desde': desde}
    });
  }

  getUserSearch(query: any){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/users`,{
      headers: {'x-token': token},
      params: {'query': query}
    });
  }

  getUserById(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/users/${id}`, {
      headers: {'x-token': token}
    });
  }

  createUser(userData: any){
    const token = localStorage.getItem('token') || '';

    return this.http.post(`${environment.apiBaseUrl}/users/`, userData, {
      headers: {'x-token': token}
    });
  }

  updateUser(userData: any, id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.put(`${environment.apiBaseUrl}/users/${id}`, userData, {
      headers: {'x-token': token}
    });
  }

  deleteUser(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.delete(`${environment.apiBaseUrl}/users/${id}`, {
      headers: {'x-token': token}
    });
  }

}
