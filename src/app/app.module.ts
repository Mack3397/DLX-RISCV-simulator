import "../polyfills"
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegistriComponent } from './registri/registri.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormatPipe } from './pipes/format.pipe';
import { MemoryComponent } from './memory/memory.component';
import { DemoMaterialModule } from './sidenav/material-module';
import { SidenavOverviewExample } from './sidenav/sidenav-overview-example';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { DocumentazioneComponent } from './documentazione/documentazione.component';

@NgModule({
   declarations: [
      AppComponent,
      EditorComponent,
      MainPageComponent,
      RegistriComponent,
      FormatPipe,
      MemoryComponent,
      SidenavOverviewExample,
      DocumentazioneComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      CodemirrorModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatToolbarModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      MatNativeDateModule,
      HttpClientModule,
      DemoMaterialModule
   ],
   entryComponents: [
      SidenavOverviewExample
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
