import { ContractComponent } from "./main/contract/contract.component";
import { LandingComponent } from "./main/landing/landing.component";

export const dashBoardChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  {
    path: 'Home',
    component: LandingComponent,
    pathMatch: 'full'
  },
  {
    path: 'Contract',
    component: ContractComponent,
    pathMatch: 'full'
  },
  // Errors
//   {
//     path: ':lang/Errors',
//     loadComponent: () =>
//       import('./../../components/errors/errors.component').then(
//         (c) => c.ErrorsComponent
//       ),
//     children: errorsChildrenRoutes
//   },
//   {
//     path: 'Errors',
//     loadComponent: () =>
//       import('./../../components/errors/errors.component').then(
//         (c) => c.ErrorsComponent
//       ),
//     children: errorsChildrenRoutes
//   },
//   { path: '**', redirectTo: '/en/Errors' } // Redirect all unknown paths to '/Errors'
];