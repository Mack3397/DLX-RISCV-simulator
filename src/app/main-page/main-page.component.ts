import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Injector } from '@angular/core';
import { Registri } from '../registri/registri';
import { ActivatedRoute } from '@angular/router';
import { Interpreter } from '../interpreters/interpreter';
import { Memory } from '../memory/model/memory';
import { MatSidenav } from '@angular/material/sidenav';
import { Eprom } from '../memory/model/eprom';

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

  @Input() sidebarOpened: boolean;
  @Output() sidebarOpenedChange: EventEmitter<number> = new EventEmitter();

  constructor(private route: ActivatedRoute, injector: Injector) {
    this.memory = new Memory();
    //inizializzo 1 GB di memoria;
    this.memory.add(Eprom, 0x00000000, 0x07FFFFFF, injector);
    this.memory.add('RAM A', 0x10000000, 0x1FFFFFFF);
    this.memory.add('RAM B', 0x20000000, 0x27FFFFFF);
    this.memory.add('RL', 0x28000000, 0x29FFFFFF);
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
