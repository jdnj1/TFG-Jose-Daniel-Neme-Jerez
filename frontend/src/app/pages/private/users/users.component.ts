import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageComponent } from 'src/app/layouts/pagination/page.component';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('searchClear', { static: true }) searchClearElement!: ElementRef<HTMLElement>;
  @ViewChild('msg', { static: true }) msgElement!: ElementRef<HTMLElement>;
  @ViewChild('searchField', { static: true }) searchFieldElement!: ElementRef<HTMLElement>;

  @ViewChild(PageComponent) pagination!: PageComponent;

  // Array donde se almacenan los usuarios obtenidos
  userArray: any = [];
  totalUsers: number = 0;

  // Variable para comprobar el email del usuario que esta en la lista
  appUser: string = '';


  // Form de búsqueda de usuarios
  searchForm = this.fb.group({
    searchQuery: ['']
  });

  lastSearch: any;

  // Contador para la barra de búsqueda
  timer: any;


  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.getUsers(0);
    this.appUser = this.userService.email;
  }

  ngAfterViewInit(): void {
    this.searchClearElement.nativeElement.style.display = 'none';
    this.msgElement.nativeElement.style.display = 'none';

    // Eventos para hacer que la busqueda se haga al pasar un tiempo solo y no hacer una peticion cada vez que se intriduce una letra
    this.searchFieldElement.nativeElement.addEventListener('keyup', () =>{
      clearTimeout(this.timer);
      this.timer = setTimeout(() =>{
        this.search();
      }, 1000)
    });

    this.searchFieldElement.nativeElement.addEventListener('keydown', () =>{
      clearTimeout(this.timer);
    });
  }

  getUsers(page: any, query?: any){
    if(!query) query = '';

    // Se hace la peticion al servicio de los usuarios para obtener la lista de estos
    this.userService.getUsers(page, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.userArray = res.users;
        this.totalUsers = res.page.total;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  createUser(){
    this.router.navigateByUrl('/create-user');
  }

  updateUser(index: any){
    this.router.navigateByUrl(`/edit-user/${this.userArray[index].idUser}`);
  }

  deleteUser(index: any){
    // Se lanza un mensaje modal para que el usuario confirme si quiere eliminar al usuario seleccionado
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar usuario',
      text: 'Va a eliminar a este usuario. Esta acción no se puede revertir.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#dc3545',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        this.userService.deleteUser(this.userArray[index].idUser).subscribe({
          next: (res: any) => {
            this.alertService.success('Usuario eliminado');

            this.pagination.numPage = 0;

            this.getUsers(0);
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error('Error al eliminar usuario');
          }
        })
      }
    });
  }

  // Funciones relacionadas con la barra de búsqueda
  search(){
    // Se comprueba que el fomrulario este correcto
    console.log(this.searchForm.valid)
    if(!this.searchForm.valid){
      return;
    }
    console.log("hokla")

    this.lastSearch = this.searchForm.value.searchQuery;

    this.getUsers(0, this.lastSearch);
  }

  cleanSearch(){
    this.searchForm.get('searchQuery')?.setValue('');
    this.lastSearch = '';
    this.checkSearch();
  }

  checkSearch(){
    // Cuando esta vacio
    if(this.searchForm.value.searchQuery === ''){
      // Se esconde el boton de limpiar el input
      this.searchClearElement.nativeElement.style.display = 'none';
      this.getUsers(0);
      this.msgElement.nativeElement.style.display = 'none';
    }
    // Cuando no esta vacio
    else{
      // Se muestra el boton
      this.searchClearElement.nativeElement.style.display = 'inline-block';
    }
  }

  recieveArray(page: any){
    this.getUsers(page*10, this.lastSearch);

  }

}
