import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Validators } from 'angular-reactive-validation';
import { calendarioEspaniol } from 'src/app/core/constants/idiomas';
import { Horario, HorasDisponibles } from 'src/app/core/model/reserva';
import { AuthService } from 'src/app/core/services/auth.service';
import { HorariosReservasService } from 'src/app/core/services/horariosReservas.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { DocenteService } from 'src/app/services/docentes.service';
import { EstudianteService } from 'src/app/services/estudiantes.service';
import { ReservaService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-solicitar-reserva',
  templateUrl: './solicitar-reserva.component.html',
  styleUrls: ['./solicitar-reserva.component.scss'],
  providers:[HorariosReservasService]
})
export class SolicitarReservaComponent implements OnInit {



  listaDocentes: any;
  listaMaterias: any[];
  listaEstudiantes: any[] = [];
  listaHoras: HorasDisponibles[] = [];
  diasDesabilitados = [];// se los llena con datos del servicio horariosReservasService
  fechasDeshabilitadas: Array<Date> = [];// se los llena con datos del servicio horariosReservasService
  formReserva: FormGroup;




  es = calendarioEspaniol;


  constructor(
    private docenteService: DocenteService,
    private reservaService: ReservaService,
    private estudianteService: EstudianteService,
    private horariosReservasService: HorariosReservasService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.listaMaterias = [];
    this.formReserva = this.fb.group({
      docente: new FormControl(null,[Validators.required('Campo requerido')]),
      // materia: new FormControl(null,[Validators.required('Campo requerido')]),
      materia: new FormControl(null),
      fecha: new FormControl(null,[Validators.required('Campo requerido')]),
      horaTutoria: new FormControl(null,[Validators.required('Campo requerido')]),
      motivo: new FormControl(null,[Validators.required('Campo requerido')]),
      participantes: new FormControl(null)
    });

    this.formReserva.get('docente').valueChanges.subscribe(docente=>{
      //Esta peticion trae los dias de tutoria por docente
      if(docente){
        this.reservaService.getListarDiasReservados(docente.code).subscribe(datos=>{
          this.horariosReservasService.estructurarInfoDocentes(datos.horarios); // es llamado desde el servicio
          this.diasDesabilitados = this.horariosReservasService.diasDesabilitados;
          this.fechasDeshabilitadas = this.horariosReservasService.fechasDeshabilitadas;
          this.listaMaterias = [];
          if(datos.materiasDocente.length>1){
            datos.materiasDocente.forEach(_=>{
              this.listaMaterias.push({
                code:_.externalMateria,
                name:_.materia
              })
            })
          }else if(datos.materiasDocente.length == 1){
            this.listaMaterias = null;
            this.formReserva.get('materia').setValue({
              code:datos.materiasDocente[0].externalMateria,
              name:datos.materiasDocente[0].materia
            })
          }
        });
      }

    });

    this.formReserva.get('fecha').valueChanges.subscribe(dia=>{
      this.listaHoras = dia? this.horariosReservasService.determinarEstadoDia(dia):[]; // retornara un arreglo de tipo HorasDisponibles
    });


    //Esta peticion trae toda la lista de docentes
    this.docenteService.getListarDocentes().subscribe(datos=>{
      this.listaDocentes =  datos.map(_=>({
        name : _.apellidos+' '+_.nombres,
        code : _.externalDocente,
        tipo: _.tipoDocente,
        external_docente: _.externalUsuario
      }));
    });

    //Esta peticion trea toda la lista de estudiantes
    this.estudianteService.getListarEstudiantes(this.authService.externalUsuario).subscribe(estudiantes=>{
      estudiantes.forEach(estudiante=>
        estudiante.externalEstudiante!=this.authService.externalUsuario?
        this.listaEstudiantes.push({
          code: estudiante.externalEstudiante,
          name: `${estudiante.nombres} ${estudiante.apellidos}`,
        }):null
      )
    });
  }

  ngOnInit(): void {
  }

  solicitarReserva(){
    if(this.formReserva.valid){
      const diasSemana = this.horariosReservasService.diasSemana;
      const horatutoria : Horario = this.formReserva.get('horaTutoria').value;
      const fecha = new Date(this.formReserva.get('fecha').value);
      const participantes = this.formReserva.get('participantes').value? (this.formReserva.get('participantes').value as []).map((_:any)=>_.code):[];
      participantes.push(this.authService.externalUsuario);
      const objeto = {};
      objeto['externalEstdudiante'] = this.authService.externalUsuario;
      objeto['externalDocente'] = this.formReserva.get('docente').value?.code;
      objeto['fecha'] = fecha.toISOString().substring(0,10);
      objeto['temaTutoria'] = this.formReserva.get('motivo').value;
      objeto['dia'] = diasSemana.find((_,index)=> index==fecha.getDay()).toLowerCase();
      objeto['horaInicio'] = horatutoria.hora_inicio.trim();
      objeto['horaFin'] = horatutoria.hora_fin.trim();
      objeto['tipoTutoria'] = horatutoria?.tipo_tutoria;
      objeto['participantes'] = participantes;
      objeto['externalMateria'] = horatutoria?.tipo_tutoria == 1? null: this.formReserva.get('materia').value.code;

      this.reservaService.postReservatutorias(objeto).subscribe(_=>{
        alert("su petición fue enviada con exito");
        this.formReserva.reset();
        this.listaHoras.length = 0;
        this.diasDesabilitados.length = 0;
        this.fechasDeshabilitadas.length = 0;
      });
    }else{
      marcarCamposVacios(this.formReserva);
    }
  }

//const dR =new Date(diaReserva.fecha);//new Date(new Date().setDate(new Date(diaReserva.fecha).getDate()+1)).getUTCDate();
//const hoy = new Date().toISOString().substr(0,10).split('-');
}
