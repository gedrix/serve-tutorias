import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
//InicioSessionInterceptorService  =  LoggingInterceptorService
@Injectable()
export class LoggingInterceptorService implements HttpInterceptor{

  constructor(private messageService: MessageService){}
  intercept(solicitud: HttpRequest<any>, siguiente: HttpHandler): Observable<HttpEvent<any>> {
    return siguiente.handle(solicitud).pipe(tap(event=>{
      if(event.type == HttpEventType.Response){
        console.log("Respuesta de llegada");
        this.messageService.add({severity:'success', summary:'Correcto', detail: event.body?.mensaje});
        // if(event.body?.mensaje){
        //   this.messageService.add({severity:'success', summary:'Correcto', detail: event.body?.mensaje});
        // }
      }
    }));
  }

}
