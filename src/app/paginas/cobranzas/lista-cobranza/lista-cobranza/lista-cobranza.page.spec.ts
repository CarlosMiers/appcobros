import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaCobranzaPage } from './lista-cobranza.page';

describe('ListaCobranzaPage', () => {
  let component: ListaCobranzaPage;
  let fixture: ComponentFixture<ListaCobranzaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCobranzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
