import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarClientesPage } from './buscar-clientes.page';

describe('BuscarClientesPage', () => {
  let component: BuscarClientesPage;
  let fixture: ComponentFixture<BuscarClientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
