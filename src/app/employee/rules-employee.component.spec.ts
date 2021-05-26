import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesEmployeeComponent } from './rules-employee.component';

describe('RulesEmployeeComponent', () => {
  let component: RulesEmployeeComponent;
  let fixture: ComponentFixture<RulesEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RulesEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
