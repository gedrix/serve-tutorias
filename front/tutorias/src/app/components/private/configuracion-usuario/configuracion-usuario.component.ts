import { Component, OnInit } from '@angular/core';
import { Docente } from 'src/app/core/model/docente';
import { DocenteService } from 'src/app/services/docentes.service';
import { ConfirmationService } from 'primeng/api';
import { Estudiante } from 'src/app/core/model/Estudiante';
import { EstudianteService } from 'src/app/services/estudiantes.service';

@Component({
  selector: 'app-configuracion-usuario',
  templateUrl: './configuracion-usuario.component.html',
  styleUrls: ['./configuracion-usuario.component.scss']
})
export class ConfiguracionUsuarioComponent implements OnInit {
  docenteCis: Docente[];
  estudianteCis: Estudiante[];
  constructor(
    private docenteService: DocenteService,
    private estudianteService: EstudianteService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.traerDocentes();
    this.getEstudianteCis();
  }
  traerDocentes() {
    this.docenteService.getDocenteCis().subscribe(_ => {
      this.docenteCis = _
    });
  }

  getEstudianteCis(){
    this.estudianteService.getEstudianteCis().subscribe(_ => {
      this.estudianteCis = _
    });
  }

  eliminarDocente(indice, event){
    this.confirmationService.confirm({
      target: event.target,
      message: '¿seguro que desea eliminar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept:() => {
        this.estudianteService.getCambiarEstado(this.docenteCis[indice].externalUsuario).subscribe(_ => {
          //this.periodoCis.splice(indice, 1);
          this.docenteCis[indice].estado = '0';
        });
      },
      rejectLabel: 'No',
      reject: () => { }
    });
    //alert(this.docenteCis[indice].externalUsuario);
  }
  activarDocente(indice, event){
    this.confirmationService.confirm({
      target: event.target,
      message: '¿seguro que desea activar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept:() => {
        this.estudianteService.getCambiarEstado(this.docenteCis[indice].externalUsuario).subscribe(_ => {
          //this.periodoCis.splice(indice, 1);
          this.docenteCis[indice].estado = '1';
        });
      },
      rejectLabel: 'No',
      reject: () => { }
    });
    //alert(this.docenteCis[indice].externalUsuario);
  }

///estudiante
eliminaEstudiante(indice, event){
  this.confirmationService.confirm({
    target: event.target,
    message: '¿seguro que desea eliminar?',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Si',
    accept:() => {
      this.estudianteService.getCambiarEstado(this.estudianteCis[indice].externalUsuario).subscribe(_ => {
        //this.periodoCis.splice(indice, 1);
        this.estudianteCis[indice].estado = '0';
      });
    },
    rejectLabel: 'No',
    reject: () => { }
  });
}
activarEstudiante(indice, event){
  this.confirmationService.confirm({
    target: event.target,
    message: '¿seguro que desea activar?',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Si',
    accept:() => {
      this.estudianteService.getCambiarEstado(this.estudianteCis[indice].externalUsuario).subscribe(_ => {
        //this.periodoCis.splice(indice, 1);
        this.estudianteCis[indice].estado = '1';
      });
    },
    rejectLabel: 'No',
    reject: () => { }
  });
}

}
