import { CheckRequestComponent } from "./main/check-request/check-request.component";
import { ContractComponent } from "./main/contract/contract.component";
import { DelaychequerequestComponent } from "./main/delaychequerequest/delaychequerequest.component";
import { LandingComponent } from "./main/landing/landing.component";
import { LocalserviceComponent } from "./main/localservice/localservice.component";
import { PaymentComponent } from "./main/payment/payment.component";
import { RequestServiceComponent } from "./main/request-service/request-service.component";
import { ServicesComponent } from "./main/services/services.component";

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
  {
    path: 'Payment',
    component: PaymentComponent,
    pathMatch: 'full'
  },
  {
    path: 'Services',
    component: ServicesComponent,
    pathMatch: 'full'
  },
  {
    path: 'RequestService',
    component: RequestServiceComponent,
    pathMatch: 'full'
  },
  {
    path: 'Localservice',
    component: LocalserviceComponent,
    pathMatch: 'full'
  },
  {
    path: 'Delaychequerequest',
    component: DelaychequerequestComponent,
    pathMatch: 'full'
  },
  {
    path: 'CheckRequest',
    component: CheckRequestComponent,
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