import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { ListEmployeesComponent } from './employee/list-employees.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from './employee/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { ChartEmployeesComponent } from './employee/chart-employees.component';
import { ChartsModule } from 'ng2-charts';
import { HomeEmployeeComponent } from './employee/home-employee.component';
import { RulesEmployeeComponent } from './employee/rules-employee.component';
import { Engine } from 'json-rules-engine';
import { HierarchyEmployeesComponent } from './employee/hierarchy-employees.component';
import { DynamicHierarchyEmployeesComponent } from './employee/dynamic-hierarchy-employees.component';
import { ListSupervisorsComponent } from './employee/list-supervisors.component';
import { ListStatusComponent } from './employee/list-status.component';
import { StatusEmployeesComponent } from './employee/status-employees.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateEmployeeComponent,
    ListEmployeesComponent,
    ChartEmployeesComponent,
    HomeEmployeeComponent,
    RulesEmployeeComponent,
    HierarchyEmployeesComponent,
    DynamicHierarchyEmployeesComponent,
    ListSupervisorsComponent,
    ListStatusComponent,
    StatusEmployeesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [EmployeeService, Engine],
  bootstrap: [AppComponent]
})
export class AppModule { }
