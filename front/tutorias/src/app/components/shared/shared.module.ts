import { NgModule } from "@angular/core";
import { ReactiveValidationModule } from "angular-reactive-validation";
import { FooterComponent } from "./footer/footer.component";
import { InputInvalidoComponent } from "./input-invalido/input-invalido.component";

@NgModule({
  declarations: [
    InputInvalidoComponent,
    FooterComponent
  ],
  exports:[
    InputInvalidoComponent,
    FooterComponent
  ],
  imports: [
    ReactiveValidationModule
  ],
  providers: []
})
export class SharedModule { }
