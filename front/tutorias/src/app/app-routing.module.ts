import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guards.service';
import { PaginaNoEncontradaComponent } from './pagina-no-encontrada/pagina-no-encontrada.component';

const routes: Routes = [
  {
    //path:``, pathMatch:'full', redirectTo:`login`
    path:``, pathMatch:'full', redirectTo:`inicio`
  },
  {
    path: ``,
    //canActivate:[AuthGuard],//recive una matriz de todos los guards que se desean aplicar
    loadChildren: () => import('./components/public/public.module').then(m => m.PublicModule),
  },
  {
    path: ``,
    //canActivate:[AuthGuard],//recive una matriz de todos los guards que se desean aplicar
    canActivateChild:[AuthGuard], //para activar seguridades a los hijos.
    loadChildren: () => import('./components/private/private.module').then(m => m.PrivateModule)
  },
  //el orden en las rutas es importante asegurarse que la parte de pagina no encontrada vaya al final, como en este ejemplo
  {
    path:`pagina-no-encontrada`, component:PaginaNoEncontradaComponent
  },
  {
    // `**` los asteriscos indican que se capturará todo ruta que no exista.
    path:`**`, redirectTo:'pagina-no-encontrada'
  }

]

@NgModule({
  imports: [ RouterModule.forRoot( routes, { useHash: true } ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
