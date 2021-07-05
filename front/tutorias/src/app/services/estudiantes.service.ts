import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { pluck, map, filter } from 'rxjs/operators';
import { Estudiante } from '../core/model/Estudiante';
import { CitaReagendacion } from '../core/model/reserva';
import { MainService } from './main.service';

@Injectable({
  providedIn:'root'
})
export class EstudianteService{
  constructor(private http: HttpClient ){}

  getListarEstudiantes(curso):Observable<Array<Estudiante>>{
    const url = `${MainService.apiUrl}/estudiante/curso/${curso}`;
    return this.http.get(url).pipe(pluck('data'));
  }
  getListarCitasReagendadas(external_id):Observable<Array<CitaReagendacion>>{
    const url = `${MainService.apiUrl}/estudiante/citas-reagendada/${external_id}`;
    return this.http.get(url).pipe(pluck('data'));
  }

  postListarCitasReagendadas(data, externalReserva){
    const url = `${MainService.apiUrl}/estudiante/citas-ac/${externalReserva}`;
    return this.http.post(url,data).pipe(pluck('data'));
  }

  postGuardarInformacionUsuario(data,externalUsuario){
    const url = `${MainService.apiUrl}/persona/registro/${externalUsuario}`;
    return this.http.post(url,data).pipe(pluck('data'));
  }

  getEstudianteCis(): Observable<Array<Estudiante>> {
    const url = `${MainService.apiUrl}/lista-estudiante`;
    return this.http.get(url).pipe(pluck('data'));
  }

  getCambiarEstado(externalDocente: string){
    const url = `${MainService.apiUrl}/banear-usuario/${externalDocente}`;
    return this.http.post(url,{}).pipe(pluck('data'));
  }

  getPerfilEstudiante(external){
    const url = `${MainService.apiUrl}/estudiante/perfil/${external}`;
    return this.http.get(url).pipe(pluck('data'));
  }
}
