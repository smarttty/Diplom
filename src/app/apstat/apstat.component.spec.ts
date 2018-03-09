import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApstatComponent } from './apstat.component';

describe('ApstatComponent', () => {
  let component: ApstatComponent;
  let fixture: ComponentFixture<ApstatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApstatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
