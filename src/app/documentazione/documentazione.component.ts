import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documentazione',
  templateUrl: './documentazione.component.html',
  styleUrls: ['./documentazione.component.css']
})
export class DocumentazioneComponent implements OnInit {

  documentazione: any[];

  constructor(route: ActivatedRoute) {
    route.data.subscribe(data => {
      this.documentazione = data.documentation
    })
  }

  ngOnInit() { }

}
