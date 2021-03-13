import { Component, OnInit } from '@angular/core';
import {IEmployee} from './IEmployee';
import {EmployeeService} from './employee.service';
import {Router} from '@angular/router';
import {Engine, Event} from 'json-rules-engine';

@Component({
  selector: 'app-dynamic-hierarchy-employees',
  templateUrl: './dynamic-hierarchy-employees.component.html',
  styleUrls: ['./dynamic-hierarchy-employees.component.css']
})
export class DynamicHierarchyEmployeesComponent  {
  employees: IEmployee[] = [];
  map = new Map<IEmployee, IEmployee[]>();
  mapExp = new Map<IEmployee, number>();
  mapTier = new Map<IEmployee, number>();
  mapResults = new Map<IEmployee, string[]>();
  ind = 0;
  f = 4;
  temp: IEmployee[] = [];
  results: string[] = [];
  str: string[] = [];
  rules: any = [];
  engine = new Engine();

  constructor(private employeeService: EmployeeService,
              private router: Router) {
    console.clear();
    this.employeeService.getEmployees().subscribe(
      (listEmployees) => {
        this.employees = listEmployees;
        this.getTotalExp();
        this.getHierarchy();
      },
      (err) => console.log(err)
    );
  }

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
    await this.createRules(this.ind);
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
    this.str = [];
    const facts = {
      score: this.mapExp.get(emp)
    };

    this.engine = new Engine();

    const x = this.ind;
    // @ts-ignore
    let t = this.mapTier.get(emp) - 1;
    if (t === x - 1)
    {
      this.str.push('No supervisor above, hence approved');
      return this.str;
    }
    if (t > 0) {
      this.engine.addFact(`rule${t}`, true);
    }
    while (t < x) {
        this.engine.addRule(this.rules[t]);
        t++;
      }
    await this.engine.run(facts);
    return this.str;
  }

  async createRules(n: number): Promise<void> {
      let i = 1;
      let j = i + 1;
      const engine = new Engine();
      const rule = {
        conditions: {
          all: [{
            fact: 'score',
            operator: 'greaterThanInclusive',
            value: 2
          }]
        },
        event: {type: 'rule1'},
        priority: n,
        onSuccess: async (event: Event, almanac: any) => {
          almanac.addRuntimeFact('rule1', true);
          this.str.push('Accepted at tier 1');
        },
        onFailure: async (event: Event, almanac: any) => {
          almanac.addRuntimeFact('rule1', false);
          this.str.push('Rejected at tier 1');
          this.engine.stop();
        }
      };

      this.rules.push(rule);

      if (n > 1) {
        while ( i < n ) {
          const r = {
            conditions: {
              all: [{
                fact: `rule${i}`,
                operator: 'equal',
                value: true
              }, {
                fact: 'score',
                operator: 'greaterThanInclusive',
                value: this.f
              }]
            },
            event: {type: `rule${j}`},
            priority: n - i,
            onSuccess: async (event: Event, almanac: any) => {
              almanac.addRuntimeFact(`${event.type}`, true);
              this.str.push(`Accepted at tier ${event.type.charAt(4)}`);
            },
            onFailure: async (event: Event, almanac: any) => {
              almanac.addRuntimeFact(`${event.type}`, false);
              this.str.push(`Rejected at tier ${event.type.charAt(4)}`);
              this.engine.stop();
            }
          };
          this.rules.push(r);
          this.f = this.f + 3;
          i++;
          j++;
        }
      }
      console.log(this.rules);
    }
}
