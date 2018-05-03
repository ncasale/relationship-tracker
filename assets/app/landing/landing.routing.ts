import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';

const LANDING_ROUTES : Routes = [
  {
    path: '',
    component: LandingComponent
  },
]

export const landingRouting = RouterModule.forChild(LANDING_ROUTES);