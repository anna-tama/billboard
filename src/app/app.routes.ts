
import { Routes } from '@angular/router';
import { FormularioComponent } from './pages/form/formulario.component';
import { CarteleraComponent } from './pages/cartelera/cartelera.component';
import { HistoricComponent } from './pages/historic/historic.component';

export const routes: Routes = [
  { path: '', component: FormularioComponent },
  { path: 'form', component: FormularioComponent },
  { path: 'cartelera', component: CarteleraComponent },
  { path: 'historic', component: HistoricComponent }
];
