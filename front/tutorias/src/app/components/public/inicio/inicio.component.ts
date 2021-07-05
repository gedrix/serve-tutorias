import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  images = [{
            "previewImageSrc": "assets/images/vfinal.png",
            "thumbnailImageSrc": "assets/images/vfinal.png",
            "alt": "Description for Image 1",
            "title": "Title 1"
        }
];

  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

displayBasic2: boolean;
  constructor(
    private router: Router,

  ) { }

  ngOnInit() {

}




}
