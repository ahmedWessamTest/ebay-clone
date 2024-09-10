import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankFooterComponent } from './blank-footer.component';

describe('BlankFooterComponent', () => {
  let component: BlankFooterComponent;
  let fixture: ComponentFixture<BlankFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlankFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlankFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
