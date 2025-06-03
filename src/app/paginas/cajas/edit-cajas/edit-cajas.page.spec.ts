import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCajasPage } from './edit-cajas.page';

describe('EditCajasPage', () => {
  let component: EditCajasPage;
  let fixture: ComponentFixture<EditCajasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCajasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
