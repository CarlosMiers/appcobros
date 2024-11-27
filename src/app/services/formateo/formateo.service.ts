import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormateoService {
  constructor(private currencyPipe: CurrencyPipe) {}

  formatearGuaranies(valor: any): string | null {
    const valorNumerico = parseFloat(valor.toString().replace(/,/g, ''));
    return this.currencyPipe.transform(valorNumerico, 'PYG', 'symbol', '1.0-0');
  }
}
