import { Routes } from '@angular/router';
import { FlightsComponent } from './search/flights/flights.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'flights', component: FlightsComponent },
];
