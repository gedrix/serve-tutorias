import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PrimeNgModule } from 'src/app/prime-ng.module';

import { LoginComponent } from './login/login.component';
import { MainPublicComponent } from './main-public/main-public.component';
import { PublicRoutingModule } from './public-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveValidationModule } from 'angular-reactive-validation';
import { SharedModule } from '../shared/shared.module';
import { InicioComponent } from './inicio/inicio.component';
import { RecuperarClaveComponent } from './recuperar-clave/recuperar-clave.component';

@NgModule({
  declarations: [
    LoginComponent,
    InicioComponent,
    RecuperarClaveComponent,
    MainPublicComponent
  ],
  exports:[
    MainPublicComponent
  ],
  imports: [
    RouterModule,
    PublicRoutingModule,
    ReactiveValidationModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: []
})
export class PublicModule { }
