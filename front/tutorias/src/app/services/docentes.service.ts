import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { Docente, DocenteMaterias, HorasTutoria } from '../core/model/docente';
import { EstudiantesCancelacion, DocenteCancelacion, ReporteEncuesta, ReporteAcademica, EstudianteTitulacion, ReportTitulacion, PeriodoAcademico } from '../core/model/reportes';
import { ReservaGeneradaDocente } from '../core/model/reserva';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  /*
  PARA AGREGAR PARAMETROS A UNA PETICION SE PUEDE AGREGAR, AL FINAL DE LA URL UN OBJETO JAVASCRIPT EJEM:
  this.http.get(
    url,
    {
      headers : new HttpHeaders({'llave':'valor}),
      params : new HttpParams({'llave':'valor})
    })
    .pipe(pluck('data'));

  */
  constructor(private http: HttpClient) { }


  getListarDocentes(): Observable<Array<Docente>> {
    const url = `${MainService.apiUrl}/docente/lista`;
    return this.http.get(url).pipe(pluck('data'));
  }

  //docente actividades
  getListarReservasDocentes(externalDocente: string): Observable<Array<ReservaGeneradaDocente>> {
    const url = `${MainService.apiUrl}/docente/reservas/${externalDocente}`;
    return this.http.get(url).pipe(pluck('data'));
  }

  postCancelarReservaDocente(data: any, externalReserva: string) {
    const url = `${MainService.apiUrl}/docente/cancelar/${externalReserva}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postRegistrarActividadTutoria(data: any) {
    const url = `${MainService.apiUrl}/docente/actividad`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postRegendarTutoria(data: any) {
    const url = `${MainService.apiUrl}/docente/reagendar`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postRegistrarMateria(data: any) {
    const url = `${MainService.apiUrl}/docente/registro-materia`;
    return this.http.post(url, data).pipe(pluck('data'));
  }
  getListarMaterias(): Observable<any> {
    const url = `${MainService.apiUrl}/materia/lista`;
    return this.http.get(url).pipe(
      pluck('data'),
      map((respuesta: any) => respuesta.map(({ externalMateria, materia }) => ({ code: externalMateria, name: materia, externalMateriaDocente: null })))
    );
  }

  getPeriodoAcademico(): Observable<{ nombrePeriodo: string, externalPeriodo: string }> {
    const url = `${MainService.apiUrl}/periodo-actual`;
    return this.http.get(url).pipe(pluck('data'));
  }

  getMateriasDocente(externalDocente: string): Observable<Array<DocenteMaterias>> {
    const url = `${MainService.apiUrl}/docente/lista-materia/${externalDocente}`;
    return this.http.get(url).pipe(
      pluck('data'),
      map((_: any) => _?.map((data: any) => (
        {
          materia: {
            name: data.materia,
            code: data.externalMateria,
            externalMateriaDocente: data.externalMateriaDocente
          },
          periodoAcademico: null
        }
      )))
    );
  }

  postActualizarMateria(data: any) {
    const url = `${MainService.apiUrl}/docente/modificar-materia`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postEliminarMateria(externalMateriaDocente: string) {
    const url = `${MainService.apiUrl}/docente/eliminar-materia/${externalMateriaDocente}`;
    return this.http.post(url, {}).pipe(pluck('data'));
  }

  getListarDiasTutoria(externalDocente: string): Observable<Array<HorasTutoria>> {
    const url = `${MainService.apiUrl}/docente/lista-dia-hora/${externalDocente}`;
    return this.http.get(url).pipe(pluck('data'));
  }

  postGuardarDiasTutorias(externalDocente: string, data) {
    const url = `${MainService.apiUrl}/docente/dias/${externalDocente}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postEliminarDiaHora(externalDia: string) {
    const data = { externalDia };
    const url = `${MainService.apiUrl}/docente/eliminar-dia-hora`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postEliminarHora(externalHora: string) {
    const data = { externalHora };
    const url = `${MainService.apiUrl}/docente/eliminar-hora`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  getListaPeriodos(): Observable<Array<{ code: string, name: string }>> {
    const url = `${MainService.apiUrl}/periodo/lista`;
    return this.http.get(url).pipe(
      pluck('data'),
      map((data: any) => data.map(_ => ({ code: _.externalPeriodo, name: _.nombrePeriodo }))));
  }

  postMateriasPorPeriodo(externalDocente, externalPeriodo): Observable<Array<{ code: string, name: string }>>{
    const data = { externalDocente, externalPeriodo };
    const url = `${MainService.apiUrl}/docente/materias-periodo`;
    return this.http.post(url, data).pipe(
      pluck('data'),
      map((data: any) => data? data.map(_ => ({ code: _.externalMateria, name: _.materia})):null));
  }
  //REPORTES
  postCanceladaPorEstudiantes(externalDoncente, externalPeriodo): Observable<Array<EstudiantesCancelacion>>{
    const data = { externalPeriodo };
    const url = `${MainService.apiUrl}/docente/canceladasest/${externalDoncente}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postCanceladaPorDocente(externalDoncente, externalPeriodo): Observable<Array<DocenteCancelacion>>{
    const data = { externalPeriodo };
    const url = `${MainService.apiUrl}/docente/canceladasdoc/${externalDoncente}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postReporteEncuesta(externalDoncente, externalPeriodo): Observable<Array<ReporteEncuesta>>{
    const data = { externalPeriodo };
    const url = `${MainService.apiUrl}/docente/encuesta/${externalDoncente}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postDocenteTutoriasDadas(externalDoncente, externalPeriodo,externalMateria, paraleloEstudiante):Observable<Array<ReporteAcademica>>{
    const data = { externalPeriodo, externalMateria, paraleloEstudiante };
    const url = `${MainService.apiUrl}/docente/tutoriasdadas/${externalDoncente}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  getListaEstudianteTitulacion(externalDoncente,externalPeriodo){
    const url = `${MainService.apiUrl}/estudiantes-titulacion-periodo/${externalDoncente}/${externalPeriodo}/1`;
    return this.http.get(url).pipe(pluck('data'), map((data:any) => data.map(_ => ({code: _.externalEstudiante, name: _.estudiante})) ));
  }

  posttutorirasTitulacionDadas(externalDoncente, externalPeriodo, externalEstudiante):Observable<Array<ReportTitulacion>>{
    const data = { externalPeriodo, externalEstudiante };
    const url = `${MainService.apiUrl}/docente/tutoriasdadas-titulacion/${externalDoncente}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  postGuardarInformacionUsuario(data,externalUsuario){
    const url = `${MainService.apiUrl}/docente/registro/${externalUsuario}`;
    return this.http.post(url,data).pipe(pluck('data'));
  }

  postCambiarClave(data){
    const url = `${MainService.apiUrl}/usuario-editar`;
    return this.http.post(url,data).pipe(pluck('data'));
  }

  getPeriodo(): Observable<Array<PeriodoAcademico>> {
    const url = `${MainService.apiUrl}/periodo/lista`;
    return this.http.get(url).pipe(pluck('data'));
  }

  postEliminarPeriodo(externalPeriodo: string) {
    const url = `${MainService.apiUrl}/periodo/eliminar/${externalPeriodo}`;
    return this.http.post(url, {}).pipe(pluck('data'));
  }

  postRegistrarPeriodo(data){
    const url = `${MainService.apiUrl}/periodo`;
    return this.http.post(url, data).pipe(pluck('data'));
  }
  postActualizarPeriodo(data, external){
    const url = `${MainService.apiUrl}/periodo/editar/${external}`;
    return this.http.post(url, data).pipe(pluck('data'));
  }


  getCorreoSmt(): Observable<{ correo: string, externalSmt: string, puerto:string }> {
    const url = `${MainService.apiUrl}/smt-lista`;
    return this.http.get(url).pipe(pluck('data'));

  }

  postActualizarCorreoSmt(data: any) {
    const url = `${MainService.apiUrl}/smt-editar`;
    return this.http.post(url, data).pipe(pluck('data'));
  }

  getDocenteCis(): Observable<Array<Docente>> {
    const url = `${MainService.apiUrl}/lista-docente`;
    return this.http.get(url).pipe(pluck('data'));
  }




  getPerfilDocente(external){
    const url = `${MainService.apiUrl}/docente/perfil/${external}`;
    return this.http.get(url).pipe(pluck('data'));
  }
}
