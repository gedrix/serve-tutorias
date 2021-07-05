export interface DatosUsuario {
  correo: string;
  tipoUsuario: number;
  externalUsuario: string;
  externalDocente?: string;
  externalEstudiante?: string;
  nombreUsuario?: string;
  externalPeriodo?:string;
  tipoDocente?:string;
  menu: Menu[];
}

interface Menu {
  menu: string;
  label: string;
  icono:string;
}
