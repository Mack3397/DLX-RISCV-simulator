import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { Registers } from '../registers/registers';
import { CodeService } from '../services/code.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent {

  registers: Registers;
  sidebarMode: string = 'side';

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  @Input() sidebarOpened: boolean;
  @Output() sidebarOpenedChange: EventEmitter<number> = new EventEmitter();

  constructor(
    public codeService: CodeService,
    route: ActivatedRoute,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver.observe('(max-width: 935px)').subscribe(result => {
      if (result.matches) {
        this.sidebarMode = 'over'
      } else {
        this.sidebarMode = 'side'
      }
    });
    route.data.subscribe(data => {
      this.registers = data.registers;
      this.codeService.interpreter = data.interpreter;
      this.codeService.editorMode = data.editorMode;
      this.codeService.load();
    })
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
