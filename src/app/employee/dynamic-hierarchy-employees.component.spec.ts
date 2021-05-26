import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicHierarchyEmployeesComponent } from './dynamic-hierarchy-employees.component';

describe('DynamicHierarchyEmployeesComponent', () => {
  let component: DynamicHierarchyEmployeesComponent;
  let fixture: ComponentFixture<DynamicHierarchyEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicHierarchyEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicHierarchyEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
