import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Registri } from '../registri/registri';
import { ActivatedRoute } from '@angular/router';
import { Interpreter } from '../interpreters/interpreter';
import { Memory } from '../memory/memory';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {

  editorMode: string;
  interpreter: Interpreter;
  memory: Memory;
  registri: Registri;

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  @Input() opened: boolean = false;
  @Output() openedChange: EventEmitter<number> = new EventEmitter();

  constructor(private route: ActivatedRoute) {
    this.memory = new Memory();
    //inizializzo 1 GB di memoria;
    this.memory.add('RAM', 0x10000000, 0x20000000);
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.editorMode = data.editorMode;
      this.interpreter = data.interpreter;
      this.registri = data.registri;
    })
  }

  onRun(line: string) {
    this.interpreter.run(line, this.registri, this.memory);
  }

  doParseTags(code: string) {
    this.interpreter.parseTags(code);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
