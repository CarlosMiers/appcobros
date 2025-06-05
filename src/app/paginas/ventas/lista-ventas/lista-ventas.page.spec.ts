import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaVentasPage } from './lista-ventas.page';

describe('ListaVentasPage', () => {
  let component: ListaVentasPage;
  let fixture: ComponentFixture<ListaVentasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
