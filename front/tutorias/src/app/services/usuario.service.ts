import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { pluck } from "rxjs/operators";
import { MainService } from "./main.service";

@Injectable({
  providedIn:'root'
})
export class UsuarioService{
  constructor(
    private http:HttpClient
  ){}

  postRegistroUsuario(data){
    const url = `${MainService.apiUrl}/usuario/registro`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postRecuperarClave(data){
    const url = `${MainService.apiUrl}/recuperar-clave`;
    return this.http.post(url, data).pipe(pluck('data'));

  }
}
