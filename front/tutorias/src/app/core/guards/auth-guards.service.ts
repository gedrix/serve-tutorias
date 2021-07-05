import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Rutas } from "../constants/Rutas";
import { AuthService } from "../services/auth.service";

@Injectable() // se lo agrega solo para poder agregar un servicio a esta servicio
//es necesario implementar CanActivate para que pueda trabajar con las rutas
export class AuthGuard implements CanActivateChild{

  estaLogeado = false;

  // injectamos Router para que en caso de que ya no este logeado redireccionarlo al login
  constructor(private AuthService:AuthService, private router:Router){}

  canActivateChild(router:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean> | boolean{
    return this.AuthService.estadoLogeo.pipe(map(estaLogeado=>{
      //  podemos redireccionar llamando a Rutas.login o dejando '' que funciona igual pues esta configurado
      //  en el router principal que si es vacio lo redirija al login
      return estaLogeado? estaLogeado:this.router.createUrlTree(['']);
    }));

  }

  // para definir condiciones para los hijos hay que implmentarlo llamando CanActivateChild a la clase
  // canActivateChild(router:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{

  //   return this.estaLogeado;
  // }
}
