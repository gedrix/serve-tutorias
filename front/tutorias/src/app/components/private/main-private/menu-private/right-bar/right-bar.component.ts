import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent implements OnInit {

  menu = [];
  menuResponsive = [];
  sidemenu: string;
  menuRight: any = [];
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    //this.menuResponsive = this.authService.menu;

      this.sidemenu="ocultar";

     for (let index = 0; index < this.authService.menu.length; index++) {
       this.menu.push({
         "label": this.authService.menu[index].label,
         //"icon": 'pi pi-fw pi-plus',
         "icon": this.authService.menu[index].icono,
         "routerLink":  this.authService.menu[index].menu
       });

     }

  }


  expanded(){
    if(this.sidemenu=="ocultar"){
        this.sidemenu="mostrar"
    }else if(this.sidemenu=="mostrar"){
        this.sidemenu="ocultar"
    }
}

}
