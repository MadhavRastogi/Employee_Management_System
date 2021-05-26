import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSupervisorsComponent } from './list-supervisors.component';

describe('ListSupervisorsComponent', () => {
  let component: ListSupervisorsComponent;
  let fixture: ComponentFixture<ListSupervisorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSupervisorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupervisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
