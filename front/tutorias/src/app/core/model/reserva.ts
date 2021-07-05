
export interface Horario {
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  tipo_tutoria: number;
}

export interface FechaReserva {
  fecha: string;
  modalidad: number;
  hora_tutoria: string;
  dia_tutoria: string;
}
export interface Reserva {
  dia: string;
  horario: Horario[];
  fechaReserva?: FechaReserva[];
}


export interface MateriasDocente{
  materia:String;
  externalMateria:String;
}
export interface InformacionDoncente {
  horarios: Reserva[];
  materiasDocente: MateriasDocente[];
}



export interface FechaReservaDiaponible{
  fecha: string;
  horas: HorasDisponibles[];
}
export interface HorasDisponibles{
  hora_inicio: String;
  hora_fin: string;
  disponible: boolean;
  tipo_tutoria: number;
}



///  INTERFAZ USADA PARA LISTAR TODAS LAS RESERVAS PARA LOS ESTUDIANTES
export interface ReservaGenerada {
  modalidad: number;
  fecha: string;
  hora: string;
  temaTutoria: string;
  externalReserva: string;
  nombresDocente: string;
}




export interface CitaReagendacion {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  temaTutoria: string;
  externalReserva: string;
  nombresDocente: string;
}

// para la parte de docente

export interface ReservaGeneradaDocente {
  modalidad: number;
  fecha: string;
  hora: string;
  temaTutoria: string;
  externalReserva: string;
  nombresSolicitante: string;
  tipoTutoria:number;
  nombresParticipantes: {estudiante:string,externalEstudiante:string}[];
}
