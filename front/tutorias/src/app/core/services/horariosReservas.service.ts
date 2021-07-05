import { FechaReservaDiaponible, HorasDisponibles, Reserva } from "../model/reserva";

export class HorariosReservasService{

  diasSemana: string[] = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
  fechasDeshabilitadas: Array<Date> = [];// que se dehabilten todas las fechas que ya se encuentran ocupadas
  fechasDisponibles: FechaReservaDiaponible[] = []; // para almacenar dias con horas de tutoria disponibles
  diasDesabilitados = []; // que se deshabiliten todos los dias que no se consideran para tutoria del codente
  datosDiasDocente: Reserva[];

  idDia = -1;

  constructor(){}

  estructurarInfoDocentes(datos:Reserva[]){
    //Recive los dias que el docente tiene tutorias
    this.reiniciarDatos();
    this.datosDiasDocente = datos;
    const h = new Date().toISOString().substr(0,10).split('-');
        for(let i = parseInt(h[2])-1; i >= 1 ; i--){
          const dia = parseInt(h[2])-i;
          this.fechasDeshabilitadas.push(new Date(new Date().setDate(dia)));
        };

        const diasDeTutoria = [];//almacenar indices para dias de tutorias
        // buscamos y almacenamos los indices donde coincidan los dias para omitirlos en la siguiente busqueda
        datos.forEach(elemento=>{
          this.diasSemana.forEach((dia,index)=>{
            if(dia == elemento.dia.toUpperCase()){
              diasDeTutoria.push(index);
              this.organizarDiasDisponibles(elemento);
            }});
        });
        this.diasSemana.forEach((dia,index)=>!diasDeTutoria.some(_=>_ == index)?this.diasDesabilitados.push(index):null);
  }

  private organizarDiasDisponibles(dia:Reserva){
    if(dia.fechaReserva){
      const arregloDiasReservados = [];
      dia.fechaReserva.forEach(diaReserva=>{
        if(!arregloDiasReservados.some(_=>_ == diaReserva.fecha)){
          arregloDiasReservados.push(diaReserva.fecha);
          let contadorDiasReservados = dia.fechaReserva.filter(_=>_.fecha == diaReserva.fecha);
          if(contadorDiasReservados.length < dia.horario.length){
            const objeto = {};
            objeto['fecha'] = diaReserva.fecha;
            objeto['horas'] = [];
            dia.horario.forEach(horario=>{
              const horaInicio = horario.hora_inicio.split('.')[0];
              objeto['horas'].push({
                hora_inicio: horaInicio,
                hora_fin: horario.hora_fin,
                disponible: !contadorDiasReservados.some(r=>r.hora_tutoria == horaInicio),
                tipo_tutoria: horario.tipo_tutoria
              });
            });
            this.fechasDisponibles.push(objeto as FechaReservaDiaponible);
          }else{
            const diaDesabilitado = new Date(new Date(diaReserva.fecha).setDate(new Date(diaReserva.fecha).getDate()+1));
            this.fechasDeshabilitadas.push(diaDesabilitado);
          }
        }
      })
    }
  }

  determinarEstadoDia(dia: Date): Array<HorasDisponibles> { // devolver una lista de tipo HorasDisponibles
    this.idDia = dia.getDay();
    const horario = this.datosDiasDocente?.find(_=>_.dia.toUpperCase() == this.diasSemana[this.idDia]).horario;
    const diaSeleccionado = dia.toISOString().substring(0,10);
    const dataDia = this.fechasDisponibles.find(_=>_.fecha == diaSeleccionado);
    if(!dataDia){
      let horasDisponibles: HorasDisponibles[] = [];
      horario?.forEach(_=>{
        horasDisponibles.push({
          hora_inicio: _.hora_inicio.substring(0,8),
          hora_fin: _.hora_fin,
          disponible: true,
          tipo_tutoria:_.tipo_tutoria,
        });
      });
      return horasDisponibles
    }else{
      return dataDia.horas;
    }
  }

  get nombreDia(){ return this.diasSemana[this.idDia];};

  private reiniciarDatos(){
    this.diasDesabilitados = [];
    this.fechasDisponibles = [];
    this.fechasDeshabilitadas = [];
  }

}
