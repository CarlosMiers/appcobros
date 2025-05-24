import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedProductoService {
  private selectedProduct: any;

  constructor() {}

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
  }

  getSelectedProduct() {
    return this.selectedProduct;
  }
}
