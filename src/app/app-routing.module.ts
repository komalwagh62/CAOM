import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AppModule } from './app.module';

const routes: Routes = [
  {
    path: '', component: MapComponent,
  },
  // {
  //   path: '', 
  //   loadChildren: () => import('./app.module').then(m => m.AppModule)

  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
