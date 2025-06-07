export interface DetalleVenta {
  idventadet: number;
  codprod: number;
  cantidad: number;
  prcosto: number;
  precio: number;
  impiva: number;
  monto: number;
  porcentaje: number;
}

export interface Venta {
  idventa: number;
  creferencia: string;
  fecha: Date;
  factura: string;
  formatofactura: string;
  vencimiento: Date;
  cliente: number;
  camion: number;
  nombrecliente: string;
  sucursal: number;
  moneda: number;
  comprobante: number;
  cotizacion: number;
  vendedor: number;
  caja: number;
  supago: number;
  sucambio: number;
  exentas: number;
  gravadas10: number;
  gravadas5: number;
  totalneto: number;
  cuotas: number;
  iniciovencetimbrado: Date;
  vencimientotimbrado: Date;
  nrotimbrado: number;
  idusuario: number;
}
