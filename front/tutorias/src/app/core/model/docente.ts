export interface Docente{
  nombres: string;
  apellidos: string;
  correo?: string;
  estado?: string;
  tipoDocente?: string;
  tipoUsuario?: string;
  externalUsuario?: string;
  externalDocente?: string;

}

export interface DocenteMaterias{
  materia:{
    name: string,
    code: string,
    externalMateriaDocente: string
  },
  periodoAcademico: string
}


// para obtener todos los dias de tutoria que tene un docente
export interface HoraDia {
  horaInicio: string;
  horaFin: string;
  tipoTutoria: number;
  externalHora: string;
}
export interface HorasTutoria{
  dia: string;
  externalDia: string;
  horaDia: HoraDia[];
}



