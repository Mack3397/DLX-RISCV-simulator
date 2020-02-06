import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  sidebarOpened: boolean = false;

  private mainPageComponent: MainPageComponent;
  
  public onRouterOutletActivate(event : MainPageComponent) {
    this.mainPageComponent = event;
    this.mainPageComponent.sidebarOpened = this.sidebarOpened;
    this.mainPageComponent.sidebarOpenedChange.subscribe((val: boolean) => {
      this.sidebarOpened = val;
    })
  }

  toggleSidenav() {
    this.sidebarOpened = !this.sidebarOpened;
    this.mainPageComponent.toggleSidenav();
  }
}
