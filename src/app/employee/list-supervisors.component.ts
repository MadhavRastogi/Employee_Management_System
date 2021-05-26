import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmpSup } from './IEmpSup';
import { ISupervisor } from './ISupervisor';

@Component({
  selector: 'app-list-supervisors',
  templateUrl: './list-supervisors.component.html',
  styleUrls: ['./list-supervisors.component.css']
})
export class ListSupervisorsComponent {

  empSups: IEmpSup[] = [];
  max = 0;
  mSup:ISupervisor[] = [];

  constructor(private employeeService: EmployeeService,
              private router: Router) {}
  empSupssList = this.employeeService.getEmpSups().subscribe(
      (listEmpSups) => {
        this.empSups = listEmpSups;
        this.empSups.forEach(e => {
          if(e.supervisors.length > this.max){
            this.max = e.supervisors.length;
            this.mSup = e.supervisors;
          }
        });
      },
      (err) => console.log(err)
    );

  /*editButtonClick(employeeId: number): void {
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
*/

}
