import { Component, OnInit } from '@angular/core';
import { Registri } from './registri';

@Component({
  selector: 'app-registri',
  templateUrl: './registri.component.html',
  styleUrls: ['./registri.component.sass']
})
export class RegistriComponent implements OnInit {

  registri = new Registri();

  constructor() { }

  ngOnInit() {
  }

}
