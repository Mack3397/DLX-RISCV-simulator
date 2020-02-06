import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export type Documentazione = {name: string, type: string, syntax: string, description: string};

@Component({
  selector: 'app-documentazione',
  templateUrl: './documentazione.component.html',
  styleUrls: ['./documentazione.component.sass']
})
export class DocumentazioneComponent implements OnInit {

  documentazione: Documentazione[];
  search: string = '';

  get documentazioneFiltrata() {
    return this.documentazione.filter(val => val.name.startsWith(this.search.toLocaleUpperCase()));
  }

  constructor(route: ActivatedRoute) {
    route.data.subscribe(data => {
      this.documentazione = data.documentation
    })
  }

  ngOnInit() { }

}
