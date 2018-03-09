import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApinfoComponent } from './apinfo.component';

describe('ApinfoComponent', () => {
  let component: ApinfoComponent;
  let fixture: ComponentFixture<ApinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
