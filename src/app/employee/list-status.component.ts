import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { max } from 'rxjs/operators';
import { EmployeeService } from './employee.service';
import { IEmpSup } from './IEmpSup';
import { ISupervisor } from './ISupervisor';
import {Engine, Event} from 'json-rules-engine';

@Component({
  selector: 'app-list-status',
  templateUrl: './list-status.component.html',
  styleUrls: ['./list-status.component.css']
})
export class ListStatusComponent{
 
  empSups: IEmpSup[] = [];
  max = 0;
  mSup:ISupervisor[] = [];
  id = 0;
  cid = 0;
  score = 0;
  submitted = 0;
  flags: boolean[] = [];
  supervisors: ISupervisor[] = [];
  rules: any = [];
  brules: any = [];
  facts = {
    rcstatus: 0,
    status0: 1
  };
  bfacts = {
    status: 0
  };
  engine = new Engine();
  bengine = new Engine();
  empsupp: IEmpSup = {
    id: 0,
    fullName: '',
    status: 0,
    score: 0,
    supervisors: []
  };

  statusForm = this.fb.group({
    empId: ['', Validators.required],
    score: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
  });

  constructor(private employeeService: EmployeeService,
              private router: Router,
              private fb: FormBuilder,
              ) {}
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

  OnSubmit(): void {

    this.submitted = 1;
    this.supervisors = [];
    this.flags = [];
    this.rules = [];
    this.brules = [];
    this.id = this.statusForm.value.empId;
    this.score = this.statusForm.value.score;
    this.cid = this.id;

    this.employeeService.getEmpSup(this.id).subscribe(
      async (empSup) => {
        this.empsupp = empSup;
        await this.createBorderRules();

        if(this.empsupp.supervisors.length === 0) {
          this.bfacts.status = 4;
        }
        else {
          if (this.empsupp.score === this.score){
            this.bfacts.status = this.empsupp.status;
            if (this.bfacts.status === -1){
              this.bfacts.status = 2;
            }
          }
          else {
            this.bfacts.status = 3;
          }
        }

        this.bengine = new Engine();
        this.brules.forEach((r: any) => {
          this.bengine.addRule(r);
        });
        await this.bengine.run(this.bfacts);
      },
      (err) => console.log(err)
    );

  }

  async sendStatus(supId: number, tier:number, status: number): Promise<void> {

    this.flags[tier-1] = true;
    
    this.engine = new Engine();

    this.facts.rcstatus = status;

    if (status === 1){
        this.empsupp.supervisors[tier-1].status = 1;
        if (tier === this.empsupp.supervisors.length) {
            this.empsupp.status = 1;
        }
    }
    else if (status === 0) {
        this.empsupp.supervisors[tier-1].status = -1;
        this.empsupp.status = -1;
    }

    this.employeeService.updateEmpSup(this.empsupp).subscribe(
      () => {
        this.employeeService.getEmpSups().subscribe(
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
      },
      (err) => console.log(err)
    );

    this.engine.addFact(`status${tier-1}`, 1);

    this.engine.addRule(this.rules[tier-1]);

    await this.engine.run(this.facts);

  }

  async createRules(n: number): Promise<void> {
    let i = 0;
    let j = i + 1;
      while ( i < n - 1 ) {
        const rule = {
          conditions: {
            all: [{
              fact: `status${i}`,
              operator: 'equal',
              value: 1
            }, {
              fact: 'rcstatus',
              operator: 'equal',
              value: 1
            }]
          },
          event: {type: `status${j}`},
          priority: n - i,
          onSuccess: async (event: Event, almanac: any) => {
            almanac.addRuntimeFact(`${event.type}`, 1);
            this.supervisors.push(this.empsupp.supervisors[Number(`${event.type.charAt(6)}`)]);
            this.engine.stop();
          },
          onFailure: async (event: Event, almanac: any) => {
            almanac.addRuntimeFact(`${event.type}`, 0);
            this.engine.stop();
          }
        };
        this.rules.push(rule);
        i++;
        j++;
      }
      const r = {
        conditions: {
          all: [{
            fact: `status${i}`,
            operator: 'equal',
            value: 1
          }, {
            fact: 'rcstatus',
            operator: 'equal',
            value: 1
          }]
        },
        event: {type: `status${j}`},
        priority: n - i,
        onSuccess: async (event: Event, almanac: any) => {
          almanac.addRuntimeFact(`${event.type}`, 1);
          this.engine.stop();
        },
        onFailure: async (event: Event, almanac: any) => {
          almanac.addRuntimeFact(`${event.type}`, 0);
          this.engine.stop();
        }
      };
      this.rules.push(r);
    }
  
  async createBorderRules(): Promise<void> {

      let i = 0;
        while ( i < 5 ) {
          const brule = {
            conditions: {
              all: [{
                fact: 'status',
                operator: 'equal',   
                value: i
              }]
            }, 
            event: {type: `bstatus${i}`}, 
            priority: i,
            onSuccess: async (event: Event, almanac: any) => {
              this.borderStatus(Number(`${event.type.charAt(7)}`));
              this.bengine.stop();
            }
          };
          this.brules.push(brule);
          i++;
        }
      } 
      
      
  borderStatus(n: number): void {

        switch(n)
        {
          case 0 : {
                      if (this.empsupp.supervisors.length > 0) {
                        let i = 0;
                        this.empsupp.supervisors.forEach(s => {
                          if(s.status === 1)
                          {
                            this.supervisors.push(s);
                            this.flags.push(true);
                            i++;
                          }
                        });
                        
                        this.supervisors.push(this.empsupp.supervisors[i]);
                        while ( i < this.empsupp.supervisors.length ) {
                          this.flags.push(false);
                          i++;
                        }
                        this.createRules(this.empsupp.supervisors.length);
                        this.statusForm.reset();
                      }
                      break;
                    }
          case 1 : {
                    this.empsupp.supervisors.forEach(s => {
                      this.supervisors.push(s);
                      this.flags.push(true);
                    });
                    this.statusForm.reset();
                    break;
                  }
          case 2 : {
                    let i = 0;
                    this.empsupp.supervisors.forEach(s => {
                      if (s.status === 1) {
                        this.supervisors.push(s);
                        this.flags.push(true);
                        i++;
                      }
                    });
                    this.supervisors.push(this.empsupp.supervisors[i]);
                    this.flags.push(true);
                    this.statusForm.reset();
                    break;
                  }
          case 3 : {
                    console.log('in case 3');
                    this.empsupp.score = this.score;
                    this.empsupp.status = 0;
                    this.empsupp.supervisors.forEach(s => {
                      s.status = 0;
                    });
                    this.employeeService.updateEmpSup(this.empsupp).subscribe(
                      () => {
                        this.employeeService.getEmpSups().subscribe(
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
                        if(this.empsupp.supervisors.length > 0) {
                          let i = 0;
                          while ( i < this.empsupp.supervisors.length ) {
                            this.flags.push(false);
                            i++;
                          }
                          this.supervisors.push(this.empsupp.supervisors[0]);
                          this.createRules(this.empsupp.supervisors.length);
                          this.statusForm.reset();
                      }
                      },
                      (err) => console.log(err)
                      );
                      break;
                   }
         case 4 :  {
                      this.empsupp.status = 1;
                      this.empsupp.score = this.score;
                      this.employeeService.updateEmpSup(this.empsupp).subscribe(
                        () => {
                          this.employeeService.getEmpSups().subscribe(
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
                        },
                        (err) => console.log(err)
                      );
                      this.statusForm.reset(); 
                    }           
        }
  }
}

