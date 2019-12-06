import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegistriComponent } from './registri/registri.component';
import { HexPipe } from './pipes/hex.pipe';
import { CodelineDirective } from './directives/codeline.directive';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    MainPageComponent,
    RegistriComponent,
    HexPipe,
    CodelineDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
