import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { GalleriaModule } from 'primeng/galleria';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import {  SharedModule } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';


@NgModule({
  imports: [
    SharedModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    GalleriaModule,
    RadioButtonModule,
    PanelModule,
    ListboxModule,
    CalendarModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelMenuModule,
    TableModule,
    DropdownModule,
    MenuModule,
    ConfirmPopupModule,
    ToastModule,
    MessagesModule,
    MessageModule,

  ],
  exports: [
    SharedModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    GalleriaModule,
    RadioButtonModule,
    PanelModule,
    ListboxModule,
    CalendarModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelMenuModule,
    TableModule,
    DropdownModule,
    MenuModule,
    ConfirmPopupModule,
    ToastModule,
    MessagesModule,
    MessageModule
  ],
  bootstrap: [AppComponent]
})
export class PrimeNgModule { }
