import { NgModule } from '@angular/core';
import { HorasPipe } from './horas.pipe';



@NgModule({
  declarations: [
    HorasPipe
  ],
  exports:[
    HorasPipe
  ]
})
export class PipesModule { }
