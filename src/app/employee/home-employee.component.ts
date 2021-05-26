import { Component, OnInit } from '@angular/core';
import {IEmployee} from './IEmployee';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from './employee.service';
import {ISkill} from './ISkill';
import {ChartType} from 'chart.js';
import { ISupervisor } from './ISupervisor';
import { IEmpSup } from './IEmpSup';

@Component({
  selector: 'app-home-employee',
  templateUrl: './home-employee.component.html',
  styleUrls: ['./home-employee.component.css']
})
export class HomeEmployeeComponent {

  employees: IEmployee[] = [];
  IEmpSups: IEmpSup[] = [];
  supvs: ISupervisor[] = [];
  public names: string[] = [];
  supN_arr: string[] = [];
  supN_set = new Set();
  public skillNames: string[] = [];
  public dArray: number[][];
  chartType: ChartType = 'bar';
  dup = 0;

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

  empSup: IEmpSup = {
    id: 0,
    fullName: '',
    status: 0,
    score: 0,
    supervisors: []
  }


  employeeForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', Validators.required],
    skills: this.fb.array([
      this.addSkillFormGroup()
    ]),
    supervisors: this.fb.array([
      this.addSupervisorFormGroup()
    ]),
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
    this.employeeService.getEmpSup(id).subscribe(
      (empSup: IEmpSup) => {
        this.editEmpSup(empSup);
        this.empSup = empSup;
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

  editEmpSup(empSup: IEmpSup): void{
    this.employeeForm.setControl('supervisors', this.setExistingSupervisors(empSup.supervisors));
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

  setExistingSupervisors(supervisors: ISupervisor[]): FormArray {
    const formArray = new FormArray([]);
    supervisors.forEach(s => {
      formArray.push(this.fb.group({
        supId: '',
        supName: s.supId+':'+s.supName+':'+s.tier+':'+'0',
        tier: '',
        status: ''
      }));
    });
    return formArray;
  }

  addSkillButtonClick(): void {
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());
  }

  addSupervisorButtonClick(): void {
    (this.employeeForm.get('supervisors') as FormArray).push(this.addSupervisorFormGroup());
  }

  removeSkillButtonClick(skillGroupNumber: number): void {
    (this.employeeForm.get('skills') as FormArray).removeAt(skillGroupNumber);
  }

  removeSupervisorButtonClick(supNumber: number): void {
    (this.employeeForm.get('supervisors') as FormArray).removeAt(supNumber);
  }


  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      expYears: ['', Validators.required],
      proficiency: ['beginner', Validators.required]
    });
  }


  addSupervisorFormGroup(): FormGroup {
    return this.fb.group({
      supId: [''],
      supName: ['None', Validators.required],
      tier: [''],
      status: ['']
    });
  }


  getSkills(): FormArray {
    return (this.employeeForm.get('skills') as FormArray);
  }

  getSupervisors(): FormArray {
    return (this.employeeForm.get('supervisors') as FormArray);
  }

  onSubmit(): void {
    this.MapFormValuesToEmpModel();
    if (this.dup === 0 && this.supN_arr.length === this.supN_set.size) {
      if (this.employee.id === 0)
      {
        this.employeeService.getEmployees().subscribe(
          (empls) => {
            let flag = 0;
            empls.forEach(e => {
              if(e.fullName === this.employee.fullName){
                flag = 1;
              }
            });
            if(flag == 0){
              this.employeeService.addEmpSup(this.empSup).subscribe(
                () => {},
                (err: any) => console.log(err)
              );
              this.employeeService.addEmployee(this.employee).subscribe(
                () => {
                  this.clearForm();
                  this.getUpdatedList();
                },
                (err: any) => console.log(err)
              );
            }
            else {
              window.alert('Employee with this username already exists');
            }
          },
          (err: any) => console.log(err)
        );
        
      }
      else {
        this.employeeService.getEmployees().subscribe(
          (empls) => {
            let flag = 0;
            empls.forEach(e => {
              if (e.fullName === this.employee.fullName && e.id !== this.employee.id) {
                flag = 1;
              }
            });
            if (flag === 0) {
              this.employeeService.updateEmpSup(this.empSup).subscribe(
                () => {},
                (err: any) => console.log(err)
              );
              this.employeeService.updateEmployee(this.employee).subscribe(
                () => this.router.navigate(['/home']),
                (err: any) => console.log(err)
              );
            }
            else {
              window.alert('Cannot change name to that of another employee of company');
            }
          },
          (err: any) => console.log(err)
        );
      }
    }
    else {
      if (this.dup === 1)
      {
        window.alert('User and supervisor cannot have same username');
      }
      else {
        window.alert('One Supervisor cannot occupy more than 1 tier');
      }
    }
  }

  MapFormValuesToEmpModel(): void {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.email = this.employeeForm.value.email;
    this.employee.skills = this.employeeForm.value.skills;
    this.empSup.fullName = this.employeeForm.value.fullName;
    this.empSup.status = 0;
    this.empSup.score = 0;
    let sups = this.employeeForm.value.supervisors;
    this.supvs = [];
    this.supN_arr = [];
    this.supN_set.clear();
    this.dup = 0;
    sups.forEach((s: { supName: string; }) => {
      console.log(s);
      if(s.supName !== 'None') {
       let k:ISupervisor = {supId: 0, supName: '', tier: 0, status: 0};
       let arr = s.supName.split(':');
       k.supId = Number(arr[0]);
       k.supName = arr[1];
       k.tier = Number(arr[2]);
       k.status = Number(arr[3]);
       if(k.supName === this.employee.fullName){
         this.dup = 1;
       }
       this.supN_arr.push(k.supName);
       this.supN_set.add(k.supName);
       this.supvs.push(k);
      }
    });
    this.empSup.supervisors = this.supvs;
  }

  clearForm(): void {
    this.employeeForm.reset();
    while ((this.employeeForm.get('skills') as FormArray).length > 0) {
      (this.employeeForm.get('skills') as FormArray).removeAt((this.employeeForm.get('skills') as FormArray).length - 1);
    }
    (this.employeeForm.get('skills') as FormArray).push(this.addSkillFormGroup());

    while ((this.employeeForm.get('supervisors') as FormArray).length > 0) {
      (this.employeeForm.get('supervisors') as FormArray).removeAt((this.employeeForm.get('supervisors') as FormArray).length - 1);
    }
    (this.employeeForm.get('supervisors') as FormArray).push(this.addSupervisorFormGroup());
  }


  editButtonClick(employeeId: number): void {
    this.router.navigate(['/home', employeeId]);
  }

  deleteButtonClick(employeeId: number): void {
    this.employeeService.getEmpSups().subscribe(
      (empSups) => {
        empSups.forEach(e => {
          let i = 0;
          let ind = 0;
          let flag = 0;
          e.supervisors.forEach(s => {
            if(s.supId === employeeId){
              ind = i;
              flag = 1;
            }
            i++;
          });
          if (flag === 1) {
          e.supervisors.splice(ind, 1);
          let t = 1;
          e.supervisors.forEach(s => {
            s.tier = t;
            t++;
          });
          this.employeeService.updateEmpSup(e).subscribe(
            () => {},
            (err: any) => console.log(err)
          );
          }
        });
        this.employeeService.deleteEmpSup(employeeId).subscribe(
          () => {},
          (err: any) => console.log(err)
        );
      },
      (err: any) => console.log(err)
    );
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
