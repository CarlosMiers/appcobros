import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemPedidoPage } from './item-pedido.page';

describe('ItemPedidoPage', () => {
  let component: ItemPedidoPage;
  let fixture: ComponentFixture<ItemPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
