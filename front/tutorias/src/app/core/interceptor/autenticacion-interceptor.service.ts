import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class AutenticacionInterceptor implements HttpInterceptor {

  // ejecutara el codigo antes que la soliciutd salga de la aplicación
  // siguiente, haciendo uso de su metodo handle, va a permitir que la peticion salga.
  intercept(solicitud: HttpRequest<any>, siguiente: HttpHandler): Observable<HttpEvent<any>> {
    // clonamos la solicitud pues desamos modificarla
    const nuevaSolicitud = solicitud.clone({
      //NOTA: aqui se puede modificar la url, poues por si solo, 'solicitud es inmutable'
      headers: solicitud.headers.append('Auth','llave-de-autenticacion')
      //solicitud.headers.append('Authorization', 'Bearer '+sessionStorage.getItem("token"))
    });
    console.log('La paticion esta saliendo al servidor. :D ');
    return siguiente.handle(nuevaSolicitud);
  }

}
//NOTA: los interceptores son servicios que a diferencia del resto hay que proporcionarlos de manera especial en los modulos.
// es preferible que esten en lo modulo raiz, para toda la aplicacion.
/* providers:[
    {provide: HTTP_INTERCEPTOR, useClass: AutenticacionInterceptor, multi: true}
  ]
  HTTP_INTERCEPTOR: pertenece al paquete de @angular/common/interceptor, es un token para identificar esa inyección
  multi : sirve para que en caso de haber mas de un interceptor, estos no se solpen y puedan funcionar todos

*/
