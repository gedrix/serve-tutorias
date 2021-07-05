import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'angular-reactive-validation';
import { CitaReagendacion } from 'src/app/core/model/reserva';
import { AuthService } from 'src/app/core/services/auth.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { EstudianteService } from 'src/app/services/estudiantes.service';
import { ReservaService } from 'src/app/services/reservas.service';

@Component({
  selector: 'app-reagendacion-estudiante',
  templateUrl: './reagendacion-estudiante.component.html',
  styleUrls: ['./reagendacion-estudiante.component.scss']
})
export class ReagendacionEstudianteComponent implements OnInit {

  lista: Array<CitaReagendacion>= [];
  mostrarFomularioCancelacion = false;
  posicionIndice = -1;
  formularioCancelacion: FormGroup;

  constructor(
    private estudinateService : EstudianteService,
    private fb : FormBuilder,
    private authService: AuthService
  ) {
    this.formularioCancelacion = this.fb.group({
      motivo: ['', Validators.required('LLena todos los campos')]
    });
    this.traerDatos();
  }

  ngOnInit(): void {
  }

  private traerDatos(){
    this.estudinateService.getListarCitasReagendadas(this.authService.externalUsuario).subscribe(_=>{
      this.lista = _;
    });
  }

  aceptarReagendacion(index){
    this.estudinateService.postListarCitasReagendadas({estado:2, motivo:null},this.lista[index].externalReserva).subscribe(_=>{
      console.log('correcto');
      this.traerDatos();
    });
  }

  guardarCancelacion(){
    if(this.formularioCancelacion.valid){
      const objeto = {
        estado:1,
        motivo:this.formularioCancelacion.get('motivo').value
      };
      this.estudinateService.postListarCitasReagendadas(objeto,this.lista[this.posicionIndice].externalReserva).subscribe(_=>{
        this.cancelarEnvio();
        this.traerDatos();
      });
    }else{
      marcarCamposVacios(this.formularioCancelacion);
    }
  }

  cancelarReagendacion(index){
    this.posicionIndice = index;
    this.mostrarFomularioCancelacion = true;
  }

  cancelarEnvio(){
    this.posicionIndice = -1;
    this.mostrarFomularioCancelacion = false;
    this.formularioCancelacion.reset();
  }
}
