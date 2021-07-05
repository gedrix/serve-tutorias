import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'angular-reactive-validation';
import { AuthService } from 'src/app/core/services/auth.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { DocenteService } from 'src/app/services/docentes.service';
import { EstudianteService } from 'src/app/services/estudiantes.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent implements OnInit {

  formularioUsuario: FormGroup;
  formularioClave: FormGroup;
  tipoUsuario: number;
  datosPersona: any;

  ciclo = [
    {name: '1 Ciclo', code: 1},
    {name: '2 Ciclo', code: 2},
    {name: '3 Ciclo', code: 3},
    {name: '4 Ciclo', code: 4},
    {name: '5 Ciclo', code: 5},
    {name: '6 Ciclo', code: 6},
    {name: '7 Ciclo', code: 7},
    {name: '8 Ciclo', code: 8},
    {name: '9 Ciclo', code: 9},
    {name: '10 Ciclo', code: 10},
    {name: 'Titulacion especial', code: "titulacion especial"},
  ]
  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private estudianteService: EstudianteService,
    private authService: AuthService

  ) {
    this.tipoUsuario = this.authService.tipoUsuario;
    //debugger;
    this.preguntarExistencia();
    this.formularioUsuario = fb.group({
      nombres: [null,Validators.required("Esta campo es requerido")],
      apellidos: [null,Validators.required("Esta campo es requerido")],
      ciclo: [],
      paralelo: []
    })

    this.formularioClave = fb.group({
      clave: [null,Validators.required("Esta campo es requerido")],
      repetirClave: [null,Validators.required("Esta campo es requerido")],
    })
  }

  ngOnInit(): void {
  }

  guardarDatos() {
    if (this.formularioUsuario.valid) {
      if (this.tipoUsuario == 1) {
        this.docenteService.postGuardarInformacionUsuario(
          this.formularioUsuario.getRawValue(),
          this.authService.datosUsuario.externalUsuario).subscribe(_=>{
            this.authService.iniciarSesion(this.authService.temData);    //arreglar
          });
      } else {
        const data = {
          "nombres":  this.formularioUsuario.get('nombres').value,
          "apellidos":  this.formularioUsuario.get('apellidos').value,
          "paralelo":  this.formularioUsuario.get('paralelo').value,
          "ciclo": this.formularioUsuario.get('ciclo').value.code
        }

        this.estudianteService.postGuardarInformacionUsuario(
          //this.formularioUsuario.getRawValue(),
          data,
          this.authService.datosUsuario.externalUsuario).subscribe(_=>{
            if (!this.authService.externalEstudiante) {
              this.authService.iniciarSesion(this.authService.temData);
            }
          });
      }
    } else {
      marcarCamposVacios(this.formularioUsuario);
    }
  }

  guardarClave(){
    if (this.formularioClave.valid) {
      if (this.formularioClave.get('clave').value === this.formularioClave.get('repetirClave').value) {
        const data = {
          "externalUsuario" : this.authService.externalUsuarioPrincipal,
          "clave": this.formularioClave.get('clave').value
        }
        this.docenteService.postCambiarClave(data).subscribe();
      }else{
       alert("claves incorrectas");
      }

    }
  }

  preguntarExistencia(){
    if (this.tipoUsuario == 1) {
      this.docenteService.getPerfilDocente(this.authService.externalUsuarioPrincipal).subscribe(_ =>{
        //debugger ;
        this.datosPersona = _;
        if (this.datosPersona) {
          this.formularioUsuario.get('nombres').setValue(this.datosPersona.nombres);
          this.formularioUsuario.get('apellidos').setValue(this.datosPersona.apellidos);
        }
      });

    }else{
      this.estudianteService.getPerfilEstudiante(this.authService.externalUsuarioPrincipal).subscribe(_ => {
        //debugger;
        this.datosPersona = _;
        if (this.datosPersona) {
          this.formularioUsuario.get('nombres').setValue(this.datosPersona.nombres);
          this.formularioUsuario.get('apellidos').setValue(this.datosPersona.apellidos);
          //this.formularioUsuario.get('ciclo').setValue({'code':});
          this.formularioUsuario.get('ciclo').setValue(this.ciclo.find(_ => _.code == this.datosPersona.ciclo));
          this.formularioUsuario.get('paralelo').setValue(this.datosPersona.paralelo);


        }
      });

    }


  }
}
