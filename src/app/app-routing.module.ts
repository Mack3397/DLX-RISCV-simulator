import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DLXInterpreter } from './interpreters/dlx/dlx.interpreter';
import { RV32Interpreter } from './interpreters/rv32i.interpreter';
import { DLXRegistri } from './registri/dlx.registri';
import { RV32IRegistri } from './registri/rv32i.registri';


const routes: Routes = [
  { path: '', redirectTo: '/dlx', pathMatch: 'full' },
  { 
    path: 'dlx',
    component: MainPageComponent,
    data: {
      interpreter: new DLXInterpreter(),
      editorMode: 'dlx',
      registri : new DLXRegistri()
    }
  },
  { 
    path: 'rv32i',
    component: MainPageComponent,
    data: {
      interpreter: new RV32Interpreter(),
      editorMode: 'rv32i',
      registri : new RV32IRegistri()
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
