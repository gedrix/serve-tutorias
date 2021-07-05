import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { pluck } from "rxjs/operators";
import { InformacionDoncente, Reserva, ReservaGenerada } from "../core/model/reserva";
import { MainService } from "./main.service";

@Injectable({
  providedIn:'root'
})
export class ReservaService{
  constructor(private http: HttpClient ){}


  getListarDiasReservados(externalDocente): Observable<InformacionDoncente>{
    const url = `${MainService.apiUrl}/docente/listadiasreservados/${externalDocente}`;
    return this.http.get(url).pipe(pluck('data'));
  }

  postReservatutorias(data){
    const url = `${MainService.apiUrl}/reservatutorias`;
    return this.http.post(url,data).pipe(pluck('data'));
  }

  getListarReservas(externalEstudiante):Observable<Array<ReservaGenerada>>{
    const url = `${MainService.apiUrl}/reserva/listar/${externalEstudiante}`;
    return this.http.get(url).pipe(pluck('data'));
  }

  postCancelarReserva(externalReserva,data){
    const url = `${MainService.apiUrl}/estudiante/cancelar/${externalReserva}`;
    return this.http.post(url,data).pipe(pluck('data'));
  }

  getEncuestasEvaluar(externalEstudiante):Observable<Array<ReservaGenerada>>{
    const url = `${MainService.apiUrl}/estudiante/encuestas-pendientes/${externalEstudiante}`;
    return this.http.get(url).pipe(pluck('data'));
  }

  postGuardarEncuesta(data){
    const url = `${MainService.apiUrl}/estudiante/actividad`;
    return this.http.post(url,data).pipe(pluck('data'));
  }

}
