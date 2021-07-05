import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'angular-reactive-validation';
import { ConfirmationService } from 'primeng/api';
import { Docente } from 'src/app/core/model/docente';
import { AuthService } from 'src/app/core/services/auth.service';
import { marcarCamposVacios } from 'src/app/core/validator/validadores';
import { DocenteService } from 'src/app/services/docentes.service';

@Component({
  selector: 'app-registro-materia',
  templateUrl: './registro-materia.component.html',
  styleUrls: ['./registro-materia.component.scss']
})
export class RegistroMateriaComponent implements OnInit {

  materias = [];
  materiasDocente = [];

  formMateria: FormGroup;
  externalPeriodo: string = "";
  indiceActualizacion = -1;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
    this.formMateria = fb.group({
      materia: [null, Validators.required("Este campo es requerido")],
      periodoAcademico: [{ value: null, disabled: true }]
    });
  }

  ngOnInit(): void {
    //treaemos todas las materias
    this.docenteService.getListarMaterias().subscribe(_ => this.materias = _);
    //traemos el periodo academico y dentro de el a los materias que tenga el docente
    this.docenteService.getPeriodoAcademico().subscribe(({ nombrePeriodo, externalPeriodo }) => {
      this.formMateria.get('periodoAcademico').setValue(nombrePeriodo);
      this.externalPeriodo = externalPeriodo;
      this.docenteService.getMateriasDocente(this.authService.externalUsuario).subscribe(_ => {
        _?.forEach(data => data.periodoAcademico = nombrePeriodo);
        this.materiasDocente = _;
      });
    });
  }

  guardarMateria() {

    if (this.formMateria.valid) {
      const data = {
        externalDocente: this.authService.externalUsuario,
        externalMateria: this.formMateria.get('materia').value.code,
        externalPeriodo: this.externalPeriodo,
        externalMateriaDocente: this.indiceActualizacion > -1 ? this.materiasDocente[this.indiceActualizacion].materia.externalMateriaDocente : null
      };

      if (this.indiceActualizacion == -1) {
        this.docenteService.postRegistrarMateria(data).subscribe(({ externalMateriaDocente }) => {
          const dataMateria = this.formMateria.get('materia').value;
          dataMateria.externalMateriaDocente = externalMateriaDocente;
          this.materiasDocente.push({
            materia: dataMateria,
            periodoAcademico: this.formMateria.get('periodoAcademico').value
          })
        });
      } else {
        this.docenteService.postActualizarMateria(data).subscribe(_ => {
          const materia = this.formMateria.get('materia').value;
          materia.externalMateriaDocente = data.externalMateriaDocente;
          this.materiasDocente[this.indiceActualizacion].materia = materia;
          this.cancelarEdicion();
        });
      }
    } else {
      marcarCamposVacios(this.formMateria);
    }
  }

  modificar(materia, index) {
    this.indiceActualizacion = index;
    this.formMateria.get('materia').setValue(this.materias.find(_ => _.code == materia.code));
  }
  cancelarEdicion() {
    this.indiceActualizacion = -1;
    this.formMateria.get('materia').setValue(null);
    this.formMateria.get('materia').clearValidators();
  }

  eliminar(indice, event) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Seguro desea eliminar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'Si',
      accept: () => {
        this.docenteService.postEliminarMateria(this.materiasDocente[indice].materia.externalMateriaDocente).subscribe(_=>{
          this.materiasDocente.splice(indice,1);
        });
      },
      rejectLabel:'No',
      reject: () => {}
    });
  }
}
