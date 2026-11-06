import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Salaries } from './salaries';

describe('Salaries', () => {
  let component: Salaries;
  let fixture: ComponentFixture<Salaries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salaries],
    }).compileComponents();

    fixture = TestBed.createComponent(Salaries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
