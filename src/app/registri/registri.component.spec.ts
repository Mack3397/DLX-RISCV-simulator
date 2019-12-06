import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistriComponent } from './registri.component';

describe('RegistriComponent', () => {
  let component: RegistriComponent;
  let fixture: ComponentFixture<RegistriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
