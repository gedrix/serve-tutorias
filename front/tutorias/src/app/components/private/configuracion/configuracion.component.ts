import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'angular-reactive-validation';
import { ConfirmationService } from 'primeng/api';
import { PeriodoAcademico } from 'src/app/core/model/reportes';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { DocenteService } from 'src/app/services/docentes.service';


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  periodoCis: PeriodoAcademico[];
  verFormSmtp = false;
  verFormPedriodo = false;
  formSmt: FormGroup;
  formularioPeriodos: FormGroup;
  externalSmt: string = "";
  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private confirmationService: ConfirmationService
  ) {
    this.formSmt = fb.group({
      clave: [{ value: null, disabled: true }],
      correo: [{ value: null, disabled: true }],
      puerto: [{ value: null, disabled: true }]

    });

    this.formularioPeriodos = fb.group({
      nombrePeriodo: [null, Validators.required("Este campo es requerido")],
      fechaInicio: [null, Validators.required("Este campo es requerido")],
      fechaFin: [null, Validators.required("Este campo es requerido")],
    });

  }

  ngOnInit(): void {
    this.docenteService.getCorreoSmt().subscribe(({ correo, externalSmt, puerto }) => {
      this.formSmt.get('correo').setValue(correo);
      this.formSmt.get('puerto').setValue(puerto);

      this.externalSmt = externalSmt;

    });

    this.traerPeriodos();
  }

  traerPeriodos() {
    this.docenteService.getPeriodo().subscribe(_ => {
      this.periodoCis = _
    });
  }


  eliminar(indice, event) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Seguro desea eliminar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        this.docenteService.postEliminarPeriodo(this.periodoCis[indice].externalPeriodo).subscribe(_ => {
          //this.periodoCis.splice(indice, 1);
          this.periodoCis[indice].estado = '0';
        });
      },
      rejectLabel: 'No',
      reject: () => { }
    });
  }

  editarSmt() {
    if (this.verFormSmtp) {

      if (this.formSmt.valid) {
        const data = {
          externalSmt: this.externalSmt,
          correo: this.formSmt.get('correo').value,
          clave: this.formSmt.get('clave').value,
          puerto: this.formSmt.get('puerto').value,


        };

        this.docenteService.postActualizarCorreoSmt(data).subscribe(_ => {
          // const correo = this.formSmt.get('correo').value;
          // const clave = this.formSmt.get('clave').value;
          // const externalSmt = data.externalSmt;


          this.cancelarSmt();

        });

      }
    } else {
      this.verFormSmtp = true;
      this.formSmt.get('correo').enable();
      this.formSmt.get('clave').enable();
      this.formSmt.get('puerto').enable();

    }
  }

  cancelarSmt() {
    this.verFormSmtp = false;
    this.formSmt.get('correo').disable();
    this.formSmt.get('clave').disable();
    this.formSmt.get('puerto').disable();

  }


  // CODIGO PARA TRABAJAR CON PERIODOS
  indiceEdicion = -1;
  editarPeriodo(indice) {
    this.verFormPedriodo = true;
    this.indiceEdicion = indice;
    this.formularioPeriodos.get('nombrePeriodo').setValue(this.periodoCis[indice].nombrePeriodo);
    this.formularioPeriodos.get('fechaInicio').setValue(this.periodoCis[indice].fechaInicio);
    this.formularioPeriodos.get('fechaFin').setValue(this.periodoCis[indice].fechaFin);
  }

  guardarPeriodo() {
    if (!this.formularioPeriodos.valid) {
      marcarCamposVacios(this.formularioPeriodos);
      return;
    }

    const info = this.formularioPeriodos.getRawValue();
    const i = info.fechaInicio as Date;
    const f = info.fechaFin as Date;
    const data = {
      nombrePeriodo: info.nombrePeriodo,
      fechaInicio: typeof i == 'string'? i:`${i.getFullYear()}-${i.getUTCMonth() +1 }-${ i.getUTCDate()}`,
      fechaFin: typeof f == 'string'? f:`${f.getFullYear()}-${f.getUTCMonth() +1 }-${f.getUTCDate()}`,
    }
    if (this.indiceEdicion > -1) {
      this.docenteService.postActualizarPeriodo(data, this.periodoCis[this.indiceEdicion].externalPeriodo).subscribe(_ => {
        this.traerPeriodos();
        this.cancelarGuardado();
      });
    } else {
      this.docenteService.postRegistrarPeriodo(data).subscribe(_ => {
        this.traerPeriodos();
        this.cancelarGuardado();
      });
    }
  }

  cancelarGuardado() {
    this.indiceEdicion = -1;
    this.formularioPeriodos.reset();
    this.verFormPedriodo = false;
  }

}
