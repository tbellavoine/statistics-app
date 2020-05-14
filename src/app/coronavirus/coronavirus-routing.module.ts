import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoronavirusComponent } from './coronavirus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DefinitionComponent } from './definition/definition.component';
import { ProtectionComponent } from './protection/protection.component';
import { WorldmapComponent } from './worldmap/worldmap.component';

const coronavirusRoutes: Routes = [
  { path: '', component: CoronavirusComponent, children: [
    { path: '', redirectTo:'dashboard', pathMatch: 'full'},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'worldmap', component: WorldmapComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(coronavirusRoutes)],
  exports: [RouterModule]
})
export class CoronavirusRoutingModule { }
