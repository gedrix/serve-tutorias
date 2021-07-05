import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name:'hora'
})
export class HorasPipe implements PipeTransform{

  transform(value: any, formato) {
    let hora = null;
    if(formato == 'h:m:s'){
      const datos = value.split('.');
      hora = datos[0];
    }else if(formato == 'h:m'){
      let datos = value.split('.');
      datos = datos[0].split(':');
      hora = `${datos[0]}:${datos[1]}`;
    }
    return hora? hora:value;
  }

}
