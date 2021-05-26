import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyEmployeesComponent } from './hierarchy-employees.component';

describe('HierarchyEmployeesComponent', () => {
  let component: HierarchyEmployeesComponent;
  let fixture: ComponentFixture<HierarchyEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
