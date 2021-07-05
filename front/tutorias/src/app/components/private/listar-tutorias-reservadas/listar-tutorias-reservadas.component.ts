import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'angular-reactive-validation';
import { ReservaGenerada } from 'src/app/core/model/reserva';
import { AuthService } from 'src/app/core/services/auth.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { ReservaService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-listar-tutorias-reservadas',
  templateUrl: './listar-tutorias-reservadas.component.html',
  styleUrls: ['./listar-tutorias-reservadas.component.scss']
})
export class ListarTutoriasReservadasComponent implements OnInit {

  lista: ReservaGenerada[] = []; /// contenedor dos tipos de arreglos en diferentes estados
  listaReservas:  ReservaGenerada[] = [];/// almacenara las reservas que se tengan se puedan cancelar
  vistaEvaluarTutorias = false;


  mostrarFomularioCancelacion = 0; // 0 para ver tablas, 1 para ver formulario cancelacion y 2 para llenar encuenta
  posicionReservaAcancelar = -1;
  formularioCancelacion : FormGroup;
  formularioEncuesta : FormGroup;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.formularioCancelacion = this.fb.group({
      motivo: ['', Validators.required('LLena todos los campos.')]
    });

    this.formularioEncuesta = this.fb.group({
      dudasAclaradas: [null, Validators.required('LLena todos los campos.')],
      satisfaccion:  [null, Validators.required('LLena todos los campos.')],
      tiempoNecesario:  [null, Validators.required('LLena todos los campos.')],
      observacion: ['', Validators.required('LLena todos los campos.')],

      externalEstudiante: [this.authService.externalUsuario],
      externalReserva: [],
    });

    this.solicitarListaReserva();
  }


  private solicitarListaReserva(){
    this.reservaService.getListarReservas(this.authService.externalUsuario).subscribe(reservas=>{
      this.listaReservas = reservas;
      this.lista = this.listaReservas;
      this.vistaEvaluarTutorias = false;
    });
  }

  ngOnInit(): void {
  }

  cancelarReservacion(indice){

    this.mostrarFomularioCancelacion = 1;
    this.posicionReservaAcancelar = indice;
    this.formularioCancelacion.reset();
  }

  guardar(){
    if(this.formularioCancelacion.valid){
      const reserva = this.listaReservas[this.posicionReservaAcancelar];
      const data = this.formularioCancelacion.getRawValue();
      this.reservaService.postCancelarReserva(reserva.externalReserva,data).subscribe(_=>{
        if(!_){
          this.solicitarListaReserva();
        }
      });
      this.cancelarEnvio();
    }else{
      marcarCamposVacios(this.formularioCancelacion);
    }

  }

  mostrarReservasAEvaluar(){
    this.reservaService.getEncuestasEvaluar(this.authService.externalUsuario).subscribe(_=>{
      this.lista = _;
      this.vistaEvaluarTutorias = true;
    })
  }
  mostrarListaReservas(){
    this.lista = this.listaReservas;
    this.vistaEvaluarTutorias = false;
  }


  presentarFormularioEvaluacion(indice){
    this.mostrarFomularioCancelacion = 2;
    this.posicionReservaAcancelar = indice;
    this.formularioEncuesta.get('externalReserva').setValue(this.lista[indice].externalReserva);
  }

  guardarEvaluacion(){
    if(this.formularioEncuesta.valid){
      this.reservaService.postGuardarEncuesta(this.formularioEncuesta.getRawValue()).subscribe(_=>{
        //console.log('guardado');
        this.cancelarEnvio();
        this.mostrarReservasAEvaluar();
      })
    }else{
      marcarCamposVacios(this.formularioEncuesta);
    }

  }


  cancelarEnvio(){
    this.mostrarFomularioCancelacion = 0;
    this.posicionReservaAcancelar = -1;
    this.formularioEncuesta.reset();
  }

}
