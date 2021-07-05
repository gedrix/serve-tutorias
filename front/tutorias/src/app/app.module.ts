import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { PrimeNgModule } from './prime-ng.module';
import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth-guards.service';
import { AutenticacionInterceptor } from './core/interceptor/autenticacion-interceptor.service';
import { ErrorInterceptorService } from './core/interceptor/error-intercerotor.service';


import { PaginaNoEncontradaComponent } from './pagina-no-encontrada/pagina-no-encontrada.component';
import { LoggingInterceptorService } from './core/interceptor/logging-interceptor.service';
import { MessageService } from 'primeng/api';
@NgModule({
  declarations: [
    AppComponent,
    PaginaNoEncontradaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PrimeNgModule
  ],
  providers: [
    //el orden en los interceptores es primordial primero se pone las salidas, luego las entradas y al final los errores
    //{provide: HTTP_INTERCEPTORS, useClass: AutenticacionInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
    MessageService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
