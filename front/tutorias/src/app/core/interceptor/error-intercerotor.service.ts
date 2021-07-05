import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor{

  constructor(
    private messageService: MessageService
  ){}

  intercept(solicitud: HttpRequest<any>,siguiente:HttpHandler): Observable<HttpEvent<any>>{
    return siguiente.handle(solicitud).pipe(catchError((error)=>{
      if(error instanceof HttpErrorResponse){
        console.log('error en la consulta');
        if(error.error instanceof ErrorEvent){
          console.error("Error Event");
        }else{
          switch(error.status){
            case 400:
              this.messageService.add({severity:'warn', summary:'Error', detail:error.error.mensaje});
            break;
            case 500:
              this.messageService.add({severity:'warn', summary:'Error', detail:'Ocurrio un error, intentelo mas tarde.'});
            break;
          }
        }
      }
      return throwError(error);
    }));
  }
}
