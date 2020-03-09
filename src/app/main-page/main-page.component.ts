import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Registers } from '../registers/registers';
import { CodeService } from '../services/code.service';
import { MemoryService } from '../services/memory.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnDestroy {

  private routeDataSub: Subscription;
  private breakpointSub: Subscription;

  registers: Registers;
  sidebarMode: string = 'side';

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  @Input() sidebarOpened: boolean;
  @Output() sidebarOpenedChange: EventEmitter<number> = new EventEmitter();

  isFormDirty: boolean;

  constructor(
    public codeService: CodeService,
    public memoryService: MemoryService,
    route: ActivatedRoute,
    breakpointObserver: BreakpointObserver
  ) {
    this.breakpointSub = breakpointObserver.observe('(max-width: 935px)').subscribe(result => {
      if (result.matches) {
        this.sidebarMode = 'over'
      } else {
        this.sidebarMode = 'side'
      }
    });
    this.routeDataSub = route.data.subscribe(data => {
      this.registers = data.registers;
      this.codeService.interpreter = data.interpreter;
      this.codeService.editorMode = data.editorMode;
      this.codeService.load();
    })
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  ngOnDestroy() {
    if (this.routeDataSub) this.routeDataSub.unsubscribe();
    if (this.breakpointSub) this.breakpointSub.unsubscribe();
  }
}
