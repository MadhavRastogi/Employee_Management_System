import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListEmployeesComponent} from './employee/list-employees.component';
import {CreateEmployeeComponent} from './employee/create-employee.component';
import {ChartEmployeesComponent} from './employee/chart-employees.component';
import {HomeEmployeeComponent} from './employee/home-employee.component';
import {RulesEmployeeComponent} from './employee/rules-employee.component';
import {HierarchyEmployeesComponent} from './employee/hierarchy-employees.component';
import {DynamicHierarchyEmployeesComponent} from './employee/dynamic-hierarchy-employees.component';
import { ListSupervisorsComponent } from './employee/list-supervisors.component';
import { ListStatusComponent } from './employee/list-status.component';
import { StatusEmployeesComponent } from './employee/status-employees.component';

const routes: Routes = [
  {path: 'list', component: ListEmployeesComponent},
  {path: 'create', component: CreateEmployeeComponent},
  {path: 'edit/:id', component: CreateEmployeeComponent},
  {path: 'charts', component: ChartEmployeesComponent},
  {path: 'home', component: HomeEmployeeComponent},
  {path: 'home/:id', component: HomeEmployeeComponent},
  {path: 'rules', component: RulesEmployeeComponent},
  {path: 'status', component: ListStatusComponent},
  {path: 'empStatus', component: StatusEmployeesComponent},
  {path: 'supervisors', component: ListSupervisorsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
