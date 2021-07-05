import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rutas } from 'src/app/core/constants/Rutas';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  tipoUsuario: number;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.tipoUsuario = this.authService.tipoUsuario;
   }
  nombreUsuario: string = "";
  items: any[];
  menus : any[];
  ngOnInit(): void {


    this.nombreUsuario = this.authService.datosUsuario.nombreUsuario ? this.authService.datosUsuario.nombreUsuario : 'Usuario' ;
    if (this.authService.datosUsuario.tipoDocente == '2') {
      this.items = [
        {
          label: 'Opciones',
          items: [

            {
              label: 'Configuración general',
              icon: 'pi pi-cog',
              routerLink: '/docente/configuracion'
            },
            {
              label: 'Configuración usuario',
              icon: 'pi pi-cog',
              routerLink: '/docente/configuracion-usuario'
            },
            {
              label: 'Mi perfil',
              icon: 'pi pi-user-edit',
              routerLink: 'registro-datos'
            },
            {
              label: 'Salir',
              icon: 'pi pi-sign-out',
              command: () => this.cerrarSesion()
            },
          ]
        }
      ];
    }else{
      this.items = [
        {
          label: 'Opciones',
          items: [
            {
              label: 'Mi perfil',
              icon: 'pi pi-user-edit',
              routerLink: 'registro-datos'
            },
            {
              label: 'Salir',
              icon: 'pi pi-sign-out',
              command: () => this.cerrarSesion()
            },
          ]
        }
      ];
    }
    if (this.tipoUsuario == 1) {
      this.menus = [
        {
          label: 'Opciones',
          items: [
            {
              label: 'Reservas Pendientes',
              icon: 'pi pi-calendar',
              routerLink: 'docente/admin-docente'
            },
            {
              label: 'Reportes Tutorías',
              icon: ' pi pi-file-pdf',
              routerLink: 'docente/reporte-docente'
            },
            {
              label: 'Registro Materia',
              icon: 'pi pi-book',
              routerLink: 'docente/registro-materia'
            },
            {
              label: 'Registro Dias',
              icon: 'pi pi-clock',
              routerLink: 'docente/registro-dias-tutoria'
            },
          ]
        }
      ];
    }else{
      this.menus = [
        {
          label: 'Opciones',
          items: [
            {
              label: 'Solicitar Reserva',
              icon: 'pi pi-file',
              routerLink: 'estudiante/solicitar-reserva'
            },
            {
              label: 'Mis reservas',
              icon: 'pi pi-calendar',
              routerLink: 'estudiante/listar-reservas-tutorias'
            },
            {
              label: 'Citas Reagendadas',
              icon: 'pi pi-check-circle',
              routerLink: 'estudiante/reagendar-tutoria'
            },
          ]
        }
      ];
    }


  }

  cerrarSesion(){
    this.authService.cerrarSesion();
  }
}
