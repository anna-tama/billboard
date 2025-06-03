
import { Routes } from '@angular/router';
import { FormularioComponent } from './pages/form/formulario.component';
import { BillboardComponent } from './pages/billboard/billboard.component';
import { HistoricComponent } from './pages/historic/historic.component';

export const routes: Routes = [
  { path: '', component: FormularioComponent },
  { path: 'form', component: FormularioComponent },
  { path: 'billboard', component: BillboardComponent },
  { path: 'historic', component: HistoricComponent }
];
