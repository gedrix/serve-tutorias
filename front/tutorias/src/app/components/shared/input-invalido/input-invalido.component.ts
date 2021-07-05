import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-invalido',
  templateUrl: './input-invalido.component.html',
  styleUrls: ['./input-invalido.component.scss'],

})
export class InputInvalidoComponent implements OnInit {
  @Input() nombreControlError: string = " ";
  constructor() { }

  ngOnInit(): void {
  }

}
