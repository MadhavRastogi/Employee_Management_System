import { Component, OnInit } from '@angular/core';
import {IEmployee} from './IEmployee';
import {EmployeeService} from './employee.service';
import {Router} from '@angular/router';
import {Engine, Event} from 'json-rules-engine';

@Component({
  selector: 'app-hierarchy-employees',
  templateUrl: './hierarchy-employees.component.html',
  styleUrls: ['./hierarchy-employees.component.css']
})
export class HierarchyEmployeesComponent {
  employees: IEmployee[] = [];
  map = new Map<IEmployee, IEmployee[]>();
  mapExp = new Map<IEmployee, number>();
  mapTier = new Map<IEmployee, number>();
  mapResults = new Map<IEmployee, string[]>();
  ind = 0;
  temp: IEmployee[] = [];
  results: string[] = [];

  constructor(private employeeService: EmployeeService,
              private router: Router) {}
  employeesList = this.employeeService.getEmployees().subscribe(
    (listEmployees) => {
      this.employees = listEmployees;
      this.getTotalExp();
      this.getHierarchy();
      },
    (err) => console.log(err)
  );

    async getHierarchy(): Promise<void> {
    let k = 0;
    while ( k + 3 < this.employees.length ){
     this.ind++;
     this.temp.push(this.employees[k], this.employees[k + 1], this.employees[k + 2]);
     this.map.set(this.employees[k + 3], this.temp);
     this.mapTier.set(this.employees[k], this.ind);
     this.mapTier.set(this.employees[k + 1], this.ind);
     this.mapTier.set(this.employees[k + 2], this.ind);
     k = k + 3;
     this.temp = [];
    }
    this.ind++;
    while ( k < this.employees.length) {
      this.mapTier.set(this.employees[k], this.ind);
      this.temp.push(this.employees[k]);
      k++;
    }
    let i = 0;
    while ( i < this.employees.length)
    {
      this.results = await this.getStatus(this.employees[i]);
      this.mapResults.set(this.employees[i], this.results);
      i++;
    }
    console.log(this.mapResults);
  }

  getTotalExp(): void
  {
    this.employees.forEach(e => {
      let exp = 0;
      e.skills.forEach(s => {
        exp = +exp + +s.expYears;
      });
      this.mapExp.set(e, exp);
    });
  }

  async getStatus(emp: IEmployee): Promise<any> {

    let str = ['Hi'];
    const facts = {
      score: this.mapExp.get(emp)
    };

    const engine = new Engine();

    const rule1 = {
      conditions: {
        all: [{
          fact: 'score',
          operator: 'greaterThanInclusive',
          value: 2
        }]
      },
      event: {type: 'rule1-score'},
      priority: 10,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule1', true);
        str.push('Accepted at tier 1');
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule1', false);
        str.push('Rejected at tier 1');
        engine.stop();
      }
    };

    const rule2 = {
      conditions: {
        all: [{
          fact: 'rule1',
          operator: 'equal',
          value: true
        }, {
          fact: 'score',
          operator: 'greaterThanInclusive',
          value: 4
        }]
      },
      event: {type: 'rule2-score'},
      priority: 9,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule2', true);
        str.push('Accepted at tier 2');
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule2', false);
        str.push('Rejected at tier 2');
        engine.stop();
      }
    };


    const rule3 = {
      conditions: {
        all: [{
          fact: 'rule2',
          operator: 'equal',
          value: true
        }, {
          fact: 'score',
          operator: 'greaterThanInclusive',
          value: 7
        }]
      },
      event: {type: 'rule3-score'},
      priority: 8,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule3', true);
        str.push('Accepted at tier 3');
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule3', false);
        str.push('Rejected at tier 3');
        engine.stop();
      }
    };


    const rule4 = {
      conditions: {
        all: [{
          fact: 'rule3',
          operator: 'equal',
          value: true
        }, {
          fact: 'score',
          operator: 'greaterThanInclusive',
          value: 10
        }]
      },
      event: {type: 'rule4-score'},
      priority: 7,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule4', true);
        str.push('Accepted at tier 4');
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule4', false);
        str.push('Rejected at tier 4');
      }
    };

    switch (this.mapTier.get(emp))
    {
      case 4: {
               engine.addFact('rule3', true);
               engine.addRule(rule4);
               break;
              }
      case 3: {
              engine.addFact('rule2', true);
              engine.addRule(rule3);
              engine.addRule(rule4);
              break;
              }
      case 2: {
              engine.addFact('rule1', true);
              engine.addRule(rule2);
              engine.addRule(rule3);
              engine.addRule(rule4);
              break;
              }
      case 1: {
              engine.addRule(rule1);
              engine.addRule(rule2);
              engine.addRule(rule3);
              engine.addRule(rule4);
              break;
              }
      default: {
              str.push('No supervisor above employee, hence approved');
              }
      }
    await engine.run(facts);
    str.shift();
    return str;
  }

}
