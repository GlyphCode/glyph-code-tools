import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PannelComponent } from './pannel.component';

describe('PannelComponent', () => {
  let component: PannelComponent;
  let fixture: ComponentFixture<PannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
