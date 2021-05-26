import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusEmployeesComponent } from './status-employees.component';

describe('StatusEmployeesComponent', () => {
  let component: StatusEmployeesComponent;
  let fixture: ComponentFixture<StatusEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
