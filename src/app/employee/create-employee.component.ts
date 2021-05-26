import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent {
  pageTitle = '';
  employee: IEmployee = {
    id: 0,
    fullName: '',
    email: '',
    skills: []
  };
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private router: Router
              ) { }

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

    getEmployee(id: number): void {
       this.employeeService.getEmployee(id).subscribe(
         (employee: IEmployee) => {
           this.editEmployee(employee),
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
          () => this.router.navigate(['list']),
          (err: any) => console.log(err)
        );
      }
      else {
        this.employeeService.updateEmployee(this.employee).subscribe(
          () => this.router.navigate(['list']),
          (err: any) => console.log(err)
        );
      }
    }

    MapFormValuesToEmpModel(): void {
      this.employee.fullName = this.employeeForm.value.fullName;
      this.employee.email = this.employeeForm.value.email;
      this.employee.skills = this.employeeForm.value.skills;
    }
}
