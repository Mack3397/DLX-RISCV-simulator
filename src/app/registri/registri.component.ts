import { Component, OnInit, Input } from '@angular/core';
import { Registri } from './registri';

@Component({
  selector: 'app-registri',
  templateUrl: './registri.component.html',
  styleUrls: ['./registri.component.sass']
})
export class RegistriComponent implements OnInit {

  @Input() registri: Registri;

  constructor() { }

  ngOnInit() {
  }

}
