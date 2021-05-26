import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartEmployeesComponent } from './chart-employees.component';

describe('ChartEmployeesComponent', () => {
  let component: ChartEmployeesComponent;
  let fixture: ComponentFixture<ChartEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
