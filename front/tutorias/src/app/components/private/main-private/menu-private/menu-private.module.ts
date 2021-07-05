import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PrimeNgModule } from "src/app/prime-ng.module";
import { RightBarComponent } from "./right-bar/right-bar.component";
import { TopBarComponent } from "./top-bar/top-bar.component";

@NgModule({
  declarations:[
    TopBarComponent,
    RightBarComponent
  ],
  exports:[
    TopBarComponent,
    RightBarComponent
  ],
  imports:[
    PrimeNgModule
  ]
})
export class MenuPrivateModule { }
