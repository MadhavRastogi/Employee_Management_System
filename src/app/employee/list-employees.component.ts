import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent{
  employees: IEmployee[] = [];

  constructor(private employeeService: EmployeeService,
              private router: Router) {}
  employeesList = this.employeeService.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (err) => console.log(err)
    );

  editButtonClick(employeeId: number): void {
    this.router.navigate(['/edit', employeeId]);
  }

  deleteButtonClick(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      () => this.getUpdatedList(),
      (err: any) => console.log(err)
    );
  }

  getUpdatedList(): void{
    this.employeeService.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (err) => console.log(err)
    );
  }
}
