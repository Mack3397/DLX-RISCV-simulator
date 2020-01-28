import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DLXInterpreter } from './interpreters/DLX.interpreter';


const routes: Routes = [
  { path: '', redirectTo: '/dlx', pathMatch: 'full' },
  { 
    path: 'dlx',
    component: MainPageComponent,
    data: {
      interpreter: new DLXInterpreter(),
      editorMode: 'dlx'
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
