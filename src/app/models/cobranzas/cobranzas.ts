export interface DetalleCobranza {
  idcobro: number;
  iddetalle: string;
  idfactura: string;
  nrofactura: number;
  emision: Date;
  comprobante: number;
  pago: number;
  capital: number;
  diamora: number;
  mora: number;
  gastos_cobranzas: number;
  moneda: number;
  amortiza: number;
  minteres: number;
  vence: Date;
  acreedor: number
  cuota: number;
  numerocuota: number;
  importe_iva: number;
  punitorio: number;
  fechacobro: Date;
}

export interface Cobranza {
  idcobro: number;
  numero: number;
  idpagos: string;
  sucursal: number;
  cobrador: number;
  fecha: Date;
  cliente: number;
  nombrecliente: string;
  moneda: number;
  cotizacionmoneda: number;
  importe: number;
  codusuario: number;
  totalpago: number;
  observacion: string;
  asiento: number;
  caja: number;
}
