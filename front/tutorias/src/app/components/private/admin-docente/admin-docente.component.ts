import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'angular-reactive-validation';
import { calendarioEspaniol } from 'src/app/core/constants/idiomas';
import { ReservaGeneradaDocente } from 'src/app/core/model/reserva';
import { AuthService } from 'src/app/core/services/auth.service';
import { HorariosReservasService } from 'src/app/core/services/horariosReservas.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { DocenteService } from 'src/app/services/docentes.service';
import { ReservaService } from 'src/app/services/reservas.service';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-admin-docente',
  templateUrl: './admin-docente.component.html',
  styleUrls: ['./admin-docente.component.scss'],
  providers: [HorariosReservasService]
})
export class AdminDocenteComponent implements OnInit {

  es = calendarioEspaniol;

  calendarOptions: CalendarOptions;


  lista: Array<ReservaGeneradaDocente> = [];

  //calendario reservas
  listaCalendario: Array<ReservaGeneradaDocente> = [];
  listaReserva: any = [];

  mostrarFomularioCancelacion = 0;
  posicionIndice = -1;
  formularioCancelacion: FormGroup;
  formularioActividad: FormGroup;
  formularioReagendacion: FormGroup;
  listaParticipantesTutoria: { code: string, name: string, asistencia: boolean }[] = [];

  listaHorasDisponibles = [];
  diasDesabilitados: any[];
  fechasDeshabilitadas: Date[];

  tipoVista=1;
  diaSeleccionado = null;

  constructor(
    private docenteService: DocenteService,
    private reservaService: ReservaService,
    private horariosReservasService: HorariosReservasService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.traerDatos();
    this.formularioCancelacion = this.fb.group({
      motivo: ['', Validators.required('LLena todos los campos.')]
    });
    this.formularioActividad = this.fb.group({
      fecha: [{ value: null, disabled: true }],
      hora: [{ value: null, disabled: true }],
      modalidadTutoria: [{ value: null, disabled: true }],
      tipoTutoria: [{ value: null, disabled: true }],
      temaTutoria: [{ value: null, disabled: true }],

      //campos que se van al api
      externalReserva: [[{ value: null, disabled: true }]],
      actividad: [],
      youtube: [],
      repositorio: [],
      informacionTesista: [],
      modalidad: [],
      participantes: []
    });
    this.formularioReagendacion = this.fb.group({
      solicitante: [{ value: null, disabled: true }],
      modalidadTutoria: [{ value: null, disabled: true }],
      tipoTutoria: [{ value: null, disabled: true }],
      temaTutoria: [{ value: null, disabled: true }],

      externalReserva: [],
      mensaje: [],
      fecha: [],
      dia: [{ value: null, disabled: true }],
      horaInicio: [],
      horaFin: [{ value: null, disabled: true }]
    });
    this.formularioReagendacion.get('fecha').valueChanges.subscribe(dia => {
      if (dia) {
        this.listaHorasDisponibles = [];
        const tipoTutoria = this.formularioReagendacion.get('tipoTutoria').value == 'Académica' ? 0 : 1;
        this.horariosReservasService.determinarEstadoDia(dia).forEach(dato => {
          this.formularioReagendacion.get('dia').setValue(this.horariosReservasService.nombreDia);
          if (dato.disponible && dato.tipo_tutoria == tipoTutoria) {
            this.formularioReagendacion.get('horaFin').setValue(dato.hora_fin);
            this.listaHorasDisponibles.push({
              code: dato.hora_inicio,
              name: dato.hora_inicio
            })
          }
        });
      }
    });

  }

  private traerDatos() {

    this.docenteService.getListarReservasDocentes(this.authService.externalUsuario).subscribe(_ => {
      this.lista = _;
      this.inicializarCalendario(_);
    });
    this.reservaService.getListarDiasReservados(this.authService.externalUsuario).subscribe(datos => {
      this.horariosReservasService.estructurarInfoDocentes(datos.horarios); // es llamado desde el servicio
      this.diasDesabilitados = this.horariosReservasService.diasDesabilitados;
      this.fechasDeshabilitadas = this.horariosReservasService.fechasDeshabilitadas;
    })
  }



  ngOnInit(): void {

  }

  private inicializarCalendario(listaEventos?:any) {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      locale: esLocale,
      selectable: true,
      //dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      events: listaEventos ? listaEventos.map(({temaTutoria,fecha},index)=>({ title: temaTutoria, date: fecha, id: index })) : [],
    };
  }
  idEventoSeleccionado: string;
  handleEventClick(selectInfo: EventClickArg) {
    this.diaSeleccionado = this.lista[selectInfo.event.id];
    this.idEventoSeleccionado = selectInfo.event.id ;
  }

  verFormularioActividad(index) {
    this.mostrarFomularioCancelacion = 1;
    const objeto: ReservaGeneradaDocente = this.lista[index];
    this.posicionIndice = index;
    objeto.nombresParticipantes.forEach(_ => this.listaParticipantesTutoria.push({
      name: _.estudiante,
      code: _.externalEstudiante,
      asistencia: false
    }));
    this.formularioActividad.get('externalReserva').setValue(`${objeto.externalReserva}`);
    this.formularioActividad.get('hora').setValue(`${objeto.hora}`);
    this.formularioActividad.get('fecha').setValue(`${objeto.fecha}`);
    this.formularioActividad.get('temaTutoria').setValue(`${objeto.temaTutoria}`);
    this.formularioActividad.get('tipoTutoria').setValue(`${objeto.tipoTutoria ? 'Titulación' : 'Académica'}`);
    this.formularioActividad.get('modalidadTutoria').setValue(`${objeto.modalidad == 1 ? 'Individual' : 'Grupal'}`);
  }

  guardarRegistroActividad() {
    if (this.formularioActividad.valid) {
      const listaNombres = this.lista[this.posicionIndice].nombresParticipantes;
      const formulario = this.formularioActividad.getRawValue();
      const listaEstudiantes = [];
      listaNombres.forEach(_ => {
        const asistio = formulario.participantes?.some(e => e.code == _.externalEstudiante);
        listaEstudiantes.push({
          external: _.externalEstudiante,
         // asistencia: asistio ? 1 : 0,
         asistencia: asistio ? 0: 1,
        });
      });
      formulario.participantes = listaEstudiantes;
      this.docenteService.postRegistrarActividadTutoria(formulario).subscribe(_ => {
        console.log(_);
        this.resetearDatos();
        this.traerDatos();
      });
    } else {
      marcarCamposVacios(this.formularioActividad);
    }
  }



  //reagendacion de tutorias
  presentarFormularioReagendacion(index) {
    this.mostrarFomularioCancelacion = 2;
    const objeto: ReservaGeneradaDocente = this.lista[index];
    this.posicionIndice = index;
    this.formularioReagendacion.get('externalReserva').setValue(objeto.externalReserva);
    this.formularioReagendacion.get('temaTutoria').setValue(objeto.temaTutoria);
    this.formularioReagendacion.get('solicitante').setValue(objeto.nombresSolicitante);
    this.formularioReagendacion.get('modalidadTutoria').setValue(`${objeto.modalidad == 1 ? 'Individual' : 'Grupal'}`);
    this.formularioReagendacion.get('tipoTutoria').setValue(`${objeto.tipoTutoria ? 'Titulación' : 'Académica'}`);
  }
  guardarReagendacion() {
    if (this.formularioReagendacion.valid) {
      const objeto = this.formularioReagendacion.getRawValue();
      objeto.fecha = new Date(objeto.fecha).toISOString().substring(0, 10);
      objeto.horaInicio = objeto.horaInicio.name;
      this.docenteService.postRegendarTutoria(objeto).subscribe(_ => {
        console.log('listo');
        this.resetearDatos();
        this.traerDatos();
      })
    } else {
      marcarCamposVacios(this.formularioActividad);
    }
  }





  //Cancelar reserva
  cancelarReserva(index) {
    this.posicionIndice = index;
    this.mostrarFomularioCancelacion = 3;
  }

  guardarCancelacion() {
    if (this.formularioCancelacion.valid) {
      const obj = {
        motivo: this.formularioCancelacion.get('motivo').value
      };

      this.docenteService.postCancelarReservaDocente(obj, this.lista[this.posicionIndice].externalReserva).subscribe(_ => {
        this.resetearDatos();
        this.traerDatos();
      });

    } else {
      marcarCamposVacios(this.formularioCancelacion);
    }
  }


  resetearDatos() {
    this.posicionIndice = -1;
    this.listaParticipantesTutoria.length = 0;
    this.mostrarFomularioCancelacion = null;
    this.formularioCancelacion.reset();
    this.formularioActividad.reset();
    this.formularioReagendacion.reset();
    this.listaHorasDisponibles = [];
  }
}
