import { Component, OnInit } from '@angular/core';
import { Engine } from 'json-rules-engine';
import { Event } from 'json-rules-engine';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-rules-employee',
  templateUrl: './rules-employee.component.html',
  styleUrls: ['./rules-employee.component.css']
})
export class RulesEmployeeComponent {

  constructor(private fb: FormBuilder) {}

  scoreForm = this.fb.group({
      score: ['', Validators.required]
    });

  async start(): Promise<void> {

    console.clear();

    const facts = {
      score: this.scoreForm.value.score
    };

    const engine = new Engine();

    const rule1 = {
      conditions: {
        all: [{
          fact: 'score',
          operator: 'lessThanInclusive',
          value: 50
        }, {
            fact: 'score',
            operator: 'greaterThanInclusive',
            value: 0
          }
        ]
      },
      event: {type: 'rule1-score'},
      priority: 10,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule1', true);
        console.log('You are on level 1');
        engine.stop();
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule1', false);
        console.log('You have crossed level 1');
      }
    };
    engine.addRule(rule1);

    const rule2 = {
      conditions: {
        all: [{
          fact: 'rule1',
          operator: 'equal',
          value: false
        }, {
          fact: 'score',
          operator: 'lessThanInclusive',
          value: 100
        }]
      },
      event: {type: 'rule2-score'},
      priority: 9,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule2', true);
        console.log('You are on level 2');
        engine.stop();
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule2', false);
        console.log('You have crossed level 2');
      }
    };

    engine.addRule(rule2);

    const rule3 = {
      conditions: {
        all: [{
          fact: 'rule2',
          operator: 'equal',
          value: false
        }, {
          fact: 'score',
          operator: 'lessThanInclusive',
          value: 150
        }]
      },
      event: {type: 'rule3-score'},
      priority: 8,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule3', true);
        console.log('You are on level 3');
        engine.stop();
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule3', false);
        console.log('You have crossed level 3');
      }
    };

    engine.addRule(rule3);

    const rule4 = {
      conditions: {
        all: [{
          fact: 'rule3',
          operator: 'equal',
          value: false
        }, {
          fact: 'score',
          operator: 'lessThanInclusive',
          value: 200
        }]
      },
      event: {type: 'rule4-score'},
      priority: 7,
      onSuccess: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule4', true);
        console.log('You are on level 4');
      },
      onFailure: async (event: Event, almanac: any) => {
        almanac.addRuntimeFact('rule4', false);
        console.log('You have crossed level 4');
        console.log('You are on topmost level');
      }
    };
    engine.addRule(rule4);
    await engine.run(facts);

  }

}
