import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarProductosPage } from './buscar-productos.page';

describe('BuscarProductosPage', () => {
  let component: BuscarProductosPage;
  let fixture: ComponentFixture<BuscarProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
