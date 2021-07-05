import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDocenteComponent } from './admin-docente/admin-docente.component';
import { ConfiguracionUsuarioComponent } from './configuracion-usuario/configuracion-usuario.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { ListarTutoriasReservadasComponent } from './listar-tutorias-reservadas/listar-tutorias-reservadas.component';
import { MainPrivateComponent } from './main-private/main-private.component';
import { ReagendacionEstudianteComponent } from './reagendacion-estudiante/reagendacion-estudiante.component';
import { RegistroDiasTutoriaComponent } from './registro-dias-tutoria/registro-dias-tutoria.component';
import { RegistroMateriaComponent } from './registro-materia/registro-materia.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SolicitarReservaComponent } from './solicitar-reserva/solicitar-reserva.component';

const routes: Routes = [{
  path: '',
  component: MainPrivateComponent,
  children: [
    {
      path: 'estudiante',
      children: [
        { path: 'solicitar-reserva', component: SolicitarReservaComponent },
        { path: 'listar-reservas-tutorias', component: ListarTutoriasReservadasComponent },
        { path: 'reagendar-tutoria', component: ReagendacionEstudianteComponent },
        /*
        para pasar datos por rutasd donde id indica el nombre de acceso y los ":" son necesarios
        { path: 'reagendar-tutoria/:id/:nombrePersona', component: ReagendacionEstudianteComponent },
        en el html se deberia usar [routerLink]="['/ruta_componente',parametro1,(parametro2 || tipo_ruta ejem:'5 || edicion')]"
        para obtener desde el componente el dato pasado como paremetro en la url debemos hacer uso de
        ActivedRoute y e su metodo snapShot.params['nombre_de_variable_en_la_ruta'],
        si cargado el componente se quiere enviar nuevos datos a la misma ruta, lo que hay que realizar
        es subscribirse al observable (permite susbscribirse a eventos que pueden llegar a suceder en le futuro)
        en snapShot.params.subscribe. Al destruirse el componente es importante que se cierre la subscripcion
        pues estas ocupan espacio en memoria; para hacer esto se debe llamar al metodo unsubscriber, puede ser instanciado
        subscribiendo una variable al subscritor( variable = Subscription) y en el onDestroy indeicar variable.unsubscriber.


        QUERYPARAMS Y FRAGMENTS
        Cuando se quiere pasar parametros por rutas se puede hacer uso de QueryParams que nos permitira agregar datos a nuestra ruta en diferentes formas,
        entre estas tenemos: estutiante/12/perfil?cedula=0987654321&materia=compiladores#cargando
        para enviar estos desde un enlace hacemos uso de lo siguiente:

          <a
            [routerLink]="['/estudiante',12,'perfil']"
            [queryParams]="{cedula:0987654321,materia:'compiladores'}"
            fragment="cargando"
          ></a>

        para enviar los queryParams desde codigose realiza lo siguiente

          router.navigate(['/server',id,'perfil'],{cedula:0987654321,materia:'compiladores'},fragment:'cargando')

        Para recuperar estos datos desde el codigo, debemos usar ActivedRoute, y de esta clase hacer uso del metodo
        routerActive.snapshot.queryParams o routerActive.snapshot.fragment, estos metodos al igual que params, posen observables para poder
        suscribirse a los cambios.

        Si queremos saber en que ruta se encuentra actualmente el usuario se hace uso de ActivatedRoute, que nos indica la ruta acutal en la que nos encontramos.
        y cuando se navega a otra ruta solo se lo pasa como parametro a navigate.
        route:ActivatedRoute
        router: Router
        this.router.navidate([`../`],{relativeTo: this.route})  // navegar a un nivel mas alto, navegando con ralacion a la ruta actual



        Enrutamientos Anidados
        las rutas anidadas permiten segmentar las urls declarando un ruta padre y los hijos puedan seguirla. como se hace en eset archivo.
        Si una ruta hijo contiene datos entonces solo se declara la variable es esa ruta.

        Guards
        los guars nos permiten establecer condiciones de seguridad para nuestras rutas
        */
      ]
    },
    {
      path: 'docente',
      children: [
        { path: 'admin-docente', component: AdminDocenteComponent },
        { path: 'reporte-docente', component: ReportesComponent },
        { path: 'registro-materia', component: RegistroMateriaComponent },
        { path: 'registro-dias-tutoria', component: RegistroDiasTutoriaComponent },
        { path: 'configuracion', component: ConfiguracionComponent },
        { path: 'configuracion-usuario', component: ConfiguracionUsuarioComponent },

      ]
    },
    {
      path:'registro-datos',
      component:RegistroUsuarioComponent
    },

  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
