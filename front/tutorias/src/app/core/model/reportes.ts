export interface EstudiantesCancelacion {
  temaTutoria: string;
  modalidad: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export interface DocenteCancelacion {
  temaTutoria: string;
  modalidad: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

export interface ReporteEncuesta {
  satisfaccion: string;
  dudasAclaradas: string;
  tiempoNecesario: string;
  observacion: string;
}

export interface ReporteAcademica{
  materia: string;
  temaTutoria: string;
  modalidadGI: string;
  fecha: string;
  horaInicio: string;
  HoraFin: string;
  estudiante: string;
  ciclo: string;
  actividad: string;
  youtube: string;
  repositorio: string;
  modalidadVP: string;
}

export interface EstudianteTitulacion{
  estudiante:string;
  externalEstudiante:string;
}

export interface ReportTitulacion{
  estudiante: string;
  temaTrabajo: string;
  modalidadGI: string;
  fechaAseroria: string;
  horaInicio: string;
  HoraFin: string;
  informacionPresentada: string;
}

export interface PeriodoAcademico{
  nombrePeriodo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  externalPeriodo: string;

}
