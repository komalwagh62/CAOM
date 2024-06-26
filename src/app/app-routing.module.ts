import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', component: MapComponent, pathMatch: 'full', canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },

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
