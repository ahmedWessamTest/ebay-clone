import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryViewComponent } from './sub-category-view.component';

describe('SubCategoryViewComponent', () => {
  let component: SubCategoryViewComponent;
  let fixture: ComponentFixture<SubCategoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategoryViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubCategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
