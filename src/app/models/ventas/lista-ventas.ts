export interface ListaVenta {
  idventa: number;
  creferencia: string;
  fecha: Date;
  factura: string;
  formatofactura: string;
  vencimiento: Date;
  cliente: number;
  preventa: number;
  nombrecliente:string;
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
  vencimientotimbrado: Date;
  nrotimbrado: number;
  idusuario: number;
}
