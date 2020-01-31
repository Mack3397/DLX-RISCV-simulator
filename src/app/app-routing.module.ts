import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DLXInterpreter } from './interpreters/DLX.interpreter';
import { RV32Interpreter } from './interpreters/RV32I.interpreter';
import { RegistriDLX } from './registri/registri.dlx';
import { RegistriRV32I } from './registri/registri.rv32i';


const routes: Routes = [
  { path: '', redirectTo: '/dlx', pathMatch: 'full' },
  { 
    path: 'dlx',
    component: MainPageComponent,
    data: {
      interpreter: new DLXInterpreter(),
      editorMode: 'dlx',
      registri : new RegistriDLX()
    }
  },
  { 
    path: 'rv32i',
    component: MainPageComponent,
    data: {
      interpreter: new RV32Interpreter(),
      editorMode: 'dlx',
      registri : new RegistriRV32I()
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
