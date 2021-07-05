import { FormArray, FormControl, FormGroup } from "@angular/forms";

export const marcarCamposVacios = ( formulario : FormGroup )=>{
  Object.keys(formulario.controls).forEach(field=>{
      const control = formulario.get(field);
      if(control instanceof FormControl){
          control.markAsTouched();
          control.markAsDirty();
      } else if (control instanceof FormGroup){
          marcarCamposVacios(control);
      } else if (control instanceof FormArray){
          control.getRawValue().forEach( (value, i) => {
              control.at(i) instanceof FormGroup && marcarCamposVacios( control.at(i) as FormGroup )
          } )
      }
  })
}
