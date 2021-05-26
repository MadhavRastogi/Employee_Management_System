import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { Router } from '@angular/router';


@Component({
  selector: 'app-chart-employees',
  templateUrl: './chart-employees.component.html',
  styleUrls: ['./chart-employees.component.css']
})
export class ChartEmployeesComponent {

  employees: IEmployee[] = [];
  public names: string[] = [];
  public skillNames: string[] = [];
  public dArray: number[][];
  chartType: ChartType = 'bar';


  constructor(private employeeService: EmployeeService,
              private router: Router) {
    this.dArray = [];
    for (let i = 0; i < 10; i++) {
      this.dArray[i] = [];
      for (let j = 0; j < 10; j++) {
        this.dArray[i][j] = 0;
      }
    }
  }

  employeesList = this.employeeService.getEmployees().subscribe(
    (listEmployees) => {
      this.employees = listEmployees;
      this.getNames();
      this.getSkillNames();
      this.getAllData();
    },
    (err) => console.log(err)
  );

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    colors: true
  };


  public barChartLabels = this.names;
  public barChartType = this.chartType;
  public barChartLegend = true;

  public barChartData = [
    {data: [0], label: '', backgroundColor: 'rgba(255, 99, 132, 0.2)'},
  ];


  getNames(): void {
    this.employees.forEach(s => {
      this.names.push(s.fullName);
    });
  }

  getSkillNames(): void {
    const set = new Set(['']);
    this.employees.forEach(s => {
      s.skills.forEach(k => {
          set.add(k.skillName);
      });
    });

    set.forEach(r => {
      if (r !== '') {
      this.skillNames.push(r);
      }
    });

    console.log(this.skillNames);
  }


  getAllData(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.skillNames.length; i++) {
      const s = this.skillNames[i];
      for ( let j = 0; j < this.employees.length; j++){
        const e = this.employees[j];
        e.skills.forEach(k => {
              if (s === k.skillName) {
                this.dArray[i][j] = k.expYears;
               }
        });
      }
    }

    for ( let i = 0; i < this.skillNames.length; i++)
    {
      let m = 100;
      const c1 = (Math.random() * 50 * m) % 255;
      const c2 = (Math.random() * 100  * m * 72) % 255;
      const c3 = (Math.random() * 200  * m * 30) % 255;
      this.barChartData.push({data: this.dArray[i], label: this.skillNames[i], backgroundColor: `rgba(${c1}, ${c2}, ${c3}, 0.2)`});
      m = m * 90;
    }
    this.barChartData.shift();
    console.log(this.barChartData);
  }
}
