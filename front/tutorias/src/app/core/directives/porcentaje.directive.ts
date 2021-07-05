import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPorcentaje]'
})
export class PorcentajeDirective implements OnInit{

  @Input() defaultColor: string = 'transparent';
  @Input() highlightColor: string = 'blue';

  // se enlaza la propiedd style.backgroundColor (unido sin guiones) a la varialbe  backgroundColor
  @HostBinding('style.backgroundColor') backgroundColor:String;

  constructor(private elementRef: ElementRef,private renderer: Renderer2) { }
  ngOnInit(){
    this.backgroundColor = this.defaultColor;
    //this.renderer.setStyle(this.elementRef.nativeElement,'background-color','blue');
  }

  @HostListener('mouseenter') mouseOver(eventData:Event){
    //this.renderer.setStyle(this.elementRef.nativeElement,'background-color','blue'); // funciona
    this.backgroundColor = this.highlightColor;
  }

  @HostListener('moeseleave') mouseleave(eventData:Event){
    //this.renderer.setStyle(this.elementRef.nativeElement,'background-color','transparent'); // funciona
    this.backgroundColor = this.defaultColor;
  }

}
