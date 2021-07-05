import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { MainPublicComponent } from './main-public/main-public.component';
import { RecuperarClaveComponent } from './recuperar-clave/recuperar-clave.component';


const routes: Routes = [{
  path:'',
  component: MainPublicComponent,
  children: [
      {path:'login',component: LoginComponent},
      {path:'inicio',component: InicioComponent},
      { path: 'recuperar-clave', component: RecuperarClaveComponent}
  ]
    // {path:'login',component: LoginComponent},
    // {path:'inicio',component: InicioComponent},
    // { path: 'recuperar-clave', component: RecuperarClaveComponent}

}]


@NgModule({
  imports: [ RouterModule.forChild( routes ) ],
  exports: [ RouterModule ]
})
export class PublicRoutingModule {}
