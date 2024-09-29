import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditClientesPage } from './edit-clientes.page';

describe('EditClientesPage', () => {
  let component: EditClientesPage;
  let fixture: ComponentFixture<EditClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
