import { Pipe, PipeTransform } from "@angular/core";
// Para usarlo hay que llamarlo dentro de las declaraciones en el module
// es preferible creare un modulo exclusiovo para los pipes y asi exportarlo al modulo donde se desee usarlos
// pera que una clase funcione como un pipe a paerte de extender de la interfaz PipeTransform
// debe implementar el decorador Pipe e indicar el nombre con el que se lo va a indentificar en las plantillas

@Pipe({
  //name:"acortarCarateres"
  name:"filtrarDatos"
})
export class AcortarPipe implements PipeTransform{
/*
  transform(value: any, ...args: any[]) {
    if(value.length > 10){
      return `${value.substr(0,10)}...` ;
    }
    return value;
  }
*/

// este pipe puede ser usado junto a un ngFor de la siguiente forma
// ngFor ="let server of servers | filtrarDatos:filtroTexto:'status"
// previo a presentar en la vista toma el arreglo y lo filtra
// value seria un arreglo en esta ocacion
// NOTA: NO ES RECOMENDABLE FILTRAR LISTAS MEDIANTE PIPES, LE COSTARIA RENDIMIENTO A AL APLICACION.
  transform(value: any, filtro:string, propName:string){
    if(value.length === 0 || filtro){
      return value;
    }
    const arrayData = [];
    for(const item of value){
      if(item[propName] === filtro){
        arrayData.push(item);
      }
    }
    return arrayData;
  }
}
