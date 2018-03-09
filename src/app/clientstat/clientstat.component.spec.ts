import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientstatComponent } from './clientstat.component';

describe('ClientstatComponent', () => {
  let component: ClientstatComponent;
  let fixture: ComponentFixture<ClientstatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientstatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
