import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export type Documentation = {name: string, type: string, syntax: string, description: string};

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.sass']
})
export class DocumentationComponent implements OnInit {

  documentation: Documentation[];
  search: string = '';

  get documentationFiltered() {
    return this.documentation.filter(val => val.name.startsWith(this.search.toLocaleUpperCase()));
  }

  constructor(route: ActivatedRoute) {
    route.data.subscribe(data => {
      this.documentation = data.documentation
    })
  }

  ngOnInit() { }

}
