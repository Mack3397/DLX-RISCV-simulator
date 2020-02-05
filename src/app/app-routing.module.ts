import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DLXInterpreter } from './interpreters/dlx/dlx.interpreter';
import { RV32Interpreter } from './interpreters/rv32i.interpreter';
import { DLXRegistri } from './registri/dlx.registri';
import { RV32IRegistri } from './registri/rv32i.registri';
import { RV32IDocumentazione } from './documentazione/rv32i.documentazione';
import { DLXDocumentazione } from './documentazione/dlx.documentazione';


const routes: Routes = [
  { path: '', redirectTo: '/dlx', pathMatch: 'full' },
  { 
    path: 'dlx',
    component: MainPageComponent,
    data: {
      interpreter: new DLXInterpreter(),
      editorMode: 'dlx',
      registri: new DLXRegistri(),
      documentation: DLXDocumentazione
    }
  },
  { 
    path: 'rv32i',
    component: MainPageComponent,
    data: {
      interpreter: new RV32Interpreter(),
      editorMode: 'rv32i',
      registri: new RV32IRegistri(),
      documentation: RV32IDocumentazione
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
