import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-documentazione',
  templateUrl: './documentazione.component.html',
  styleUrls: ['./documentazione.component.css']
})
export class DocumentazioneComponent implements OnInit {

@Input() documentazione;

  constructor() { }

  ngOnInit() {
  }

}
