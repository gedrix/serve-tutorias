import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { calendarioEspaniol } from './core/constants/idiomas';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tutorias';
  es = calendarioEspaniol;
  estaLogeado = null;
  constructor(
    private config: PrimeNGConfig,
    private AuthService:AuthService,
    public router: Router
  ){
    //NOTA:configuracion de idioma NO BORRAR
    this.config.setTranslation(this.es);
    this.AuthService.estadoLogeo.subscribe(info=> this.estaLogeado = !!info);
  }
}
