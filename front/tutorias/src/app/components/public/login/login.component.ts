import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorDeclaration, Validators } from 'angular-reactive-validation';
import { Rutas } from 'src/app/core/constants/Rutas';
import { AuthService } from 'src/app/core/services/auth.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // styles:[
  //   '.fondo{ background-image: url(/assets/images/unlFondo.jpeg); background-repeat: no-repeat; background-size: 100% 100%; filter: blur(6px);}'
  // ]
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;

  verFormRegistro = false;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router:Router,
    private usuarioSeriece:UsuarioService
  ) {
    const esRegistro = ValidatorDeclaration.wrapNoArgumentValidator(control=>{
      return !this.verFormRegistro || control.value? null : { 'requerido': {'message':'Este campo es requerido'} };
    },'requerido');
    this.formLogin = this.fb.group({
      correo: [null, [Validators.required('LLena todos los campos')]],
      clave: [null, [Validators.required('LLena todos los campos')]],
      tipo: [null, [esRegistro()]]
    });
  }
  ngOnInit(): void {
  }

  logearse() {
    const respuesta = this.vaidarFormulario();
    if (!respuesta) {
      return;
    }
    this.AuthService.iniciarSesion(respuesta);
  }

  registrarse(){
    const respuesta = this.vaidarFormulario();
    if (!respuesta) {
      return;
    }
    this.usuarioSeriece.postRegistroUsuario(respuesta).subscribe(_=>{
      this.AuthService.iniciarSesion(respuesta,Rutas.registroDatos);
    });
  }

  vaidarFormulario(){
    if (!this.formLogin.valid) {
      marcarCamposVacios(this.formLogin);
      return false;
    }
    return this.formLogin.getRawValue();
  }

  regresar(){
    this.router.navigateByUrl(Rutas.paginaInicial);
  }

  formRegistro(){
    this.verFormRegistro = !this.verFormRegistro;
    this.formLogin.reset();
  }

}
