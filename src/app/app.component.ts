import { Component, ViewChild, OnInit } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  
  private mainPageComponent: MainPageComponent;
  private _theme: 'light'|'dark';

  sidebarOpened: boolean = false;

  public get theme() : 'light'|'dark' {
    return this._theme;
  }
  
  public set theme(v : 'light'|'dark') {
    this._theme = v;
    const overlayContainerClasses = document.getElementsByTagName('html').item(0).classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(v + '-theme');
  }

  constructor() {}
  
  public onRouterOutletActivate(event : MainPageComponent) {
    this.mainPageComponent = event;
    this.mainPageComponent.sidebarOpened = this.sidebarOpened;
    this.mainPageComponent.sidebarOpenedChange.subscribe((val: boolean) => {
      this.sidebarOpened = val;
    })
  }

  ngOnInit() {
    this.theme = 'dark';
  }

  toggleSidenav() {
    this.sidebarOpened = !this.sidebarOpened;
    this.mainPageComponent.toggleSidenav();
  }

  toggleTheme() {
    if (this._theme == 'dark') {
      this.theme = 'light';
    } else {
      this.theme = 'dark';
    }
  }
}
