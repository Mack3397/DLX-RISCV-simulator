import "../polyfills"
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegistersComponent } from './registers/registers.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormatPipe } from './pipes/format.pipe';
import { MemoryComponent } from './memory/memory.component';
import { MaterialModule } from './material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { DocumentationComponent } from './documentation/documentation.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

@NgModule({
   declarations: [
      AppComponent,
      EditorComponent,
      MainPageComponent,
      RegistersComponent,
      FormatPipe,
      MemoryComponent,
      DocumentationComponent,
      MessageDialogComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      CodemirrorModule,
      BrowserAnimationsModule,
      ReactiveFormsModule,
      MatNativeDateModule,
      HttpClientModule,
      MaterialModule
   ],
   entryComponents: [
      MessageDialogComponent
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
