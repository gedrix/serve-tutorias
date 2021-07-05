import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Rutas } from 'src/app/core/constants/Rutas';
import { Router } from '@angular/router';
import { ValidatorDeclaration, Validators } from 'angular-reactive-validation';

import { AuthService } from 'src/app/core/services/auth.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.scss']
})
export class RecuperarClaveComponent implements OnInit {

  formRecuperar: FormGroup;

  constructor(
    private router:Router,
    private fb: FormBuilder,
    private usuarioSeriece:UsuarioService

  ) {
    this.formRecuperar = this.fb.group({
      correo: [null, [Validators.required('LLena todos los campos')]],

    });
  }

  ngOnInit(): void {  }

  vaidarFormulario(){
    if (!this.formRecuperar.valid) {
      marcarCamposVacios(this.formRecuperar);
      return false;
    }
    return this.formRecuperar.getRawValue();
  }


  recuperar(){
    const respuesta = this.vaidarFormulario();
    if (!respuesta) {
      return;
    }else{
      this.usuarioSeriece.postRecuperarClave(respuesta).subscribe();
    }
  }

  regresar(){
    this.router.navigateByUrl(Rutas.paginaInicial);
  }

}
