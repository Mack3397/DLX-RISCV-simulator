import { Component, OnInit } from '@angular/core';
import { Registri } from '../registri/registri';
import { ActivatedRoute } from '@angular/router';
import { Interpreter } from '../interpreters/interpreter';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {

  editorMode: string;
  interpreter: Interpreter;

  registri = new Registri();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.editorMode = data.editorMode;
      this.interpreter = data.interpreter;
    })
  }

  onRun(line: string) {
    this.interpreter.run(line, this.registri);
  }

}
