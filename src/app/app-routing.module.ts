import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoronavirusModule } from './coronavirus/coronavirus.module';
import { CryptosComponent } from './cryptos/cryptos.component';

const appRoutes: Routes = [
  { path: '', redirectTo:'covid-19', pathMatch: 'full' },
  { path: 'covid-19', loadChildren: () => import(`./coronavirus/coronavirus.module`).then(m => m.CoronavirusModule) },
  { path: 'crypto', component: CryptosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false, initialNavigation: 'enabled' })], // <-- debugging purposes only],
  exports: [RouterModule]
})
export class AppRoutingModule { }
