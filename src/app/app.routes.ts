
import { Routes } from '@angular/router';
import { FormularioComponent } from './formulario.component';
import { CarteleraComponent } from './cartelera.component';

export const routes: Routes = [
  { path: '', component: FormularioComponent },
  { path: 'cartelera', component: CarteleraComponent }
];
