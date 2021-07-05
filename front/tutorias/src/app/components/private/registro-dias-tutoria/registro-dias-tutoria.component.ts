import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { HorasTutoria } from 'src/app/core/model/docente';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocenteService } from 'src/app/services/docentes.service';

@Component({
  selector: 'app-registro-dias-tutoria',
  templateUrl: './registro-dias-tutoria.component.html',
  styleUrls: ['./registro-dias-tutoria.component.scss']
})
export class RegistroDiasTutoriaComponent implements OnInit {

  nuevoDia = false;
  diasSemana: {}[] = [
    { code: 0, name: 'LUNES' },
    { code: 1, name: 'MARTES' },
    { code: 2, name: 'MIERCOLES' },
    { code: 3, name: 'JUEVES' },
    { code: 4, name: 'VIERNES' }];
  formDiasTutoria: FormGroup;
  listaDiasTutoria: HorasTutoria[];
  constructor(
    private docenteService: DocenteService,
    private fb: FormBuilder,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
    this.formDiasTutoria = fb.group({
      diaSemana: [],
      horaTutoria: fb.array([])
    })
  }

  get listaHoras(): FormArray {
    return this.formDiasTutoria.get('horaTutoria') as FormArray;
  }

  ngOnInit(): void {
    this.docenteService.getListarDiasTutoria(this.authService.externalUsuario).subscribe(_ => this.listaDiasTutoria = _);
  }

  agregarHora() {
    this.listaHoras.push(this.fb.group({
      horaInicio: [],
      horaFin: [],
      tipoTutoria: []
    }))
  }
  borrarDia(index) {
    this.listaHoras.removeAt(index);
  }

  guardarHorasTutorias() {
    if (this.formDiasTutoria.valid) {
      let data: { diaSemana: any, horaTutoria: any[] } = this.formDiasTutoria.getRawValue();
      data.diaSemana = (data.diaSemana.name as string).toLowerCase();
      data.horaTutoria.forEach(element => {
        let inicio = new Date(element.horaInicio);
        let fin = new Date(element.horaFin);
        element.horaInicio = `${inicio.getHours()}:${inicio.getMinutes()}`;
        element.horaFin = `${fin.getHours()}:${fin.getMinutes()}`;
        element.tipoTutoria = element.tipoTutoria.code;
      });
      this.docenteService.postGuardarDiasTutorias(this.authService.externalUsuario, data).subscribe(_ => {
        this.docenteService.getListarDiasTutoria(this.authService.externalUsuario).subscribe(_ => this.listaDiasTutoria = _);
        this.listaHoras.clear();
        this.formDiasTutoria.reset();
        this.nuevoDia = false;
      });
    }
  }

  borrarHora(external: string, event: any){
    this.mensajeAviso(this.docenteService.postEliminarHora(external), event);
  }

  borrarDiaHora(external: string, event: any) {
    this.mensajeAviso(this.docenteService.postEliminarDiaHora(external), event);
  }

  mensajeAviso(servicio: Observable<any>, event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Seguro desea eliminar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        servicio.subscribe(_=>this.docenteService.getListarDiasTutoria(this.authService.externalUsuario).subscribe(_ => this.listaDiasTutoria = _));
      },
      rejectLabel: 'No',
      reject: () => { }
    });
  }

}
