import {Component} from '@angular/core';

/** @title Basic sidenav */
@Component({
  selector: 'sidenav-overview-example',
  templateUrl: 'sidenav-overview-example.html',
  styleUrls: ['sidenav-overview-example.css'],
})

export class SidenavOverviewExample {
  opened: boolean;
  btnColour='#52A9E1';
  change() {
    if(this.opened) this.btnColour='#52A9E1';
    else this.btnColour= '#4E4E4E';
  }
}
