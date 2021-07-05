import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';
import { Rutas } from '../constants/Rutas';
import { DatosUsuario } from '../model/usuario';

@Injectable()
export class AuthService {

  estadoLogeo = new BehaviorSubject<boolean>(null);// permitira que cuando se subscriban a el se pueda obtener el ultimo valor que se ingreso
  datosUsuario: DatosUsuario;

  temData;

  constructor(
    private http: HttpClient,
    private router: Router
  ){
    this.autoLogear();
  }

  iniciarSesion(data, urlRedireccion?:string){
    const url =`${ MainService.apiUrl}/usuario/login`;
    this.temData = data;
    this.http.post<DatosUsuario>(url,data).pipe(pluck('data')).subscribe((_:DatosUsuario)=>{
      this.datosUsuario = _;
      localStorage.setItem('datosUsuario', JSON.stringify(_));
      this.estadoLogeo.next(true);
      if(this.temData && !urlRedireccion) this.temData = null;
      this.router.navigateByUrl(
        !urlRedireccion?
        _.tipoUsuario == 1?Rutas.adminDocente:Rutas.solicitarReserva
        : urlRedireccion
      );
    });
  }

  cerrarSesion(){
    localStorage.removeItem('datosUsuario');
    this.estadoLogeo.next(null);
    this.router.navigateByUrl(Rutas.login);
  }


  autoLogear(){
    this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
    this.estadoLogeo.next(null);
    if(this.datosUsuario){
      this.estadoLogeo.next(true);
    }
  }

  get externalUsuario():string{
    return this.datosUsuario.tipoUsuario == 1? this.datosUsuario.externalDocente : this.datosUsuario.externalEstudiante;
  }

  get externalUsuarioPrincipal():string{
    return this.datosUsuario.externalUsuario;
  }

  get externalEstudiante():string{
    return this.datosUsuario.externalEstudiante;
  }

  get nombreUsuario():string{
    return this.datosUsuario.nombreUsuario;
  }


  get tipoUsuario(): number{
    return this.datosUsuario.tipoUsuario;
  }
  get menu(){
    return this.datosUsuario.menu;
  }

}


///  para llamar un servicio dentre de cualquier componente
///  en le docorador del componente se lo debe llamar mediante
/// providers:[nombre_del_servicio]
/// o si no se desea llamarlo dentro de los providers se le debe agregar al
/// al servicio el decorador @Injectable que contega la opcion providedIn:'root'
/// como en este servicio.


















