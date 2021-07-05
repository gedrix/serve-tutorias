import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';


import { SolicitarReservaComponent } from './solicitar-reserva/solicitar-reserva.component';
import { PrivateRoutingModule } from './private-routing.module';
import { MainPrivateComponent } from './main-private/main-private.component';
import { ReactiveValidationModule } from 'angular-reactive-validation';
import { SharedModule } from '../shared/shared.module';
import { AdminDocenteComponent } from './admin-docente/admin-docente.component';
import { ListarTutoriasReservadasComponent } from './listar-tutorias-reservadas/listar-tutorias-reservadas.component';
import { ReagendacionEstudianteComponent } from './reagendacion-estudiante/reagendacion-estudiante.component';
import { ReportesComponent } from './reportes/reportes.component';
import { MenuPrivateModule } from './main-private/menu-private/menu-private.module';
import { RegistroMateriaComponent } from './registro-materia/registro-materia.component';
import { RegistroDiasTutoriaComponent } from './registro-dias-tutoria/registro-dias-tutoria.component';
import { PipesModule } from 'src/app/core/pipes/pipe.module';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';


import { FullCalendarModule } from '@fullcalendar/angular'; // the main //connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { ConfiguracionUsuarioComponent } from './configuracion-usuario/configuracion-usuario.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    SolicitarReservaComponent,
    ListarTutoriasReservadasComponent,
    MainPrivateComponent,
    AdminDocenteComponent,
    ReagendacionEstudianteComponent,
    ReportesComponent,
    RegistroMateriaComponent,
    RegistroDiasTutoriaComponent,
    RegistroUsuarioComponent,
    ConfiguracionComponent,
    ConfiguracionUsuarioComponent
  ],
  exports: [
    MainPrivateComponent
  ],
  imports: [
    RouterModule,
    PrivateRoutingModule,
    ReactiveValidationModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MenuPrivateModule,
    PipesModule,
    FullCalendarModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class PrivateModule { }
