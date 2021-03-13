import { Component, OnInit } from '@angular/core';
import {IEmployee} from './IEmployee';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from './employee.service';
import {ISkill} from './ISkill';
import {ChartType} from 'chart.js';

@Component({
  selector: 'app-home-employee',
  templateUrl: './home-employee.component.html',
  styleUrls: ['./home-employee.component.css']
})
export class HomeEmployeeComponent {

  employees: IEmployee[] = [];
  public names: string[] = [];
  public skillNames: string[] = [];
  public dArray: number[][];
  chartType: ChartType = 'bar';

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private router: Router
  ) {
    this.dArray = [];
    for (let i = 0; i < 10; i++) {
      this.dArray[i] = [];
      for (let j = 0; j < 10; j++) {
        this.dArray[i][j] = 0;
      }
    }
    this.employeeService.getEmployees().subscribe(
      (listEmployees) => {
        this.employees = listEmployees;
        this.getNames();
        this.getSkillNames();
        this.getAllData();
      },
      (err) => console.log(err)
    );
  }
  pageTitle = '';
  employee: IEmployee = {
    id: 0,
    fullName: '',
    email: '',
    skills: []
  };


  employeeForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
    skills: this.fb.array([
      this.addSkillFormGroup()
    ])
  });

  Sub = this.route.paramMap.subscribe(params => {
    const empId = params.get('id');
    if (empId){
      this.pageTitle = 'Edit Employee';
      this.getEmployee(Number(empId));
    }
    else{
      this.pageTitle = 'Create Employee';
    }
  });


  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    colors: true
  };

  public doughnutChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    colors: true,
    labelColors: true,
    doughnutLabel: true
  };


  public barChartLabels = this.names;
  public barChartType = this.chartType;
  public doughnutChartType: ChartType = 'doughnut';
  public pieChartType: ChartType = 'pie';
  public lineChartType: ChartType = 'line';
  public horizontalBarChartType: ChartType = 'horizontalBar';
  public polarChartType: ChartType = 'polarArea';
  public barChartLegend = true;

  public barChartData = [
    {data: [0], label: '', backgroundColor: 'rgba(255, 99, 132, 0.2)'},
  ];

  getEmployee(id: number): void {
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (err: any) => console.log(err)
    );
  }

  editEmployee(employee: IEmployee): void{
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      email: employee.email,
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        expYears: s.expYears,
        proficiency: s.proficiency
      }));
    });
    return formArray;
  }

  addSkillButtonClick(): void {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillGroupNumber: number): void {
    (this.employeeForm.get('skills') as FormArray).removeAt(skillGroupNumber);
  }


  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      expYears: ['', Validators.required],
      proficiency: ['beginner', Validators.required]
    });
  }

  getSkills(): FormArray {
    return (this.employeeForm.get('skills') as FormArray);
  }

  onSubmit(): void {
    this.MapFormValuesToEmpModel();
    if (this.employee.id === 0)
    {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => {
          this.clearForm();
          this.getUpdatedList();
        },
        (err: any) => console.log(err)
      );
    }
    else {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['/home']),
        (err: any) => console.log(err)
      );
    }
  }

  MapFormValuesToEmpModel(): void {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.email = this.employeeForm.value.email;
    this.employee.skills = this.employeeForm.value.skills;
  }

  clearForm(): void {
    this.employeeForm.reset();
    while ((this.employeeForm.get('skills') as FormArray).length > 1) {
      (this.employeeForm.get('skills') as FormArray).removeAt((this.employeeForm.get('skills') as FormArray).length - 1);
    }
  }


  editButtonClick(employeeId: number): void {
    this.router.navigate(['/home', employeeId]);
  }

  deleteButtonClick(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      () => this.getUpdatedList(),
      (err: any) => console.log(err)
    );
  }

  getUpdatedList(): void{
    this.employeeService.getEmployees().subscribe(
      (listEmployees) => {
        this.employees = listEmployees;
        this.getNames();
        this.getSkillNames();
        this.getAllData();
        this.router.navigate(['/home']);
      },
      (err) => console.log(err)
    );
  }

  getNames(): void {
    this.names = [];
    this.employees.forEach(s => {
      this.names.push(s.fullName);
    });
    this.barChartLabels = this.names;
  }

  getSkillNames(): void {
    this.skillNames = [];
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
  }

  getAllData(): void {
    this.dArray = [];
    for (let i = 0; i < 10; i++) {
      this.dArray[i] = [];
      for (let j = 0; j < 10; j++) {
        this.dArray[i][j] = 0;
      }
    }
    this.barChartData = [
      {data: [0], label: '', backgroundColor: 'rgba(255, 99, 132, 0.2)'},
    ];

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
  }

}
