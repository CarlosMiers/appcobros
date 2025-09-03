import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarpreventaPage } from './buscarpreventa.page';
describe('BuscarpreventaPage', () => {
  let component: BuscarpreventaPage;
  let fixture: ComponentFixture<BuscarpreventaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarpreventaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
