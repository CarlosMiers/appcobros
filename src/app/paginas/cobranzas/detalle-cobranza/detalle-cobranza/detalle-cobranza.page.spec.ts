import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCobranzaPage } from './detalle-cobranza.page';

describe('DetalleCobranzaPage', () => {
  let component: DetalleCobranzaPage;
  let fixture: ComponentFixture<DetalleCobranzaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCobranzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
