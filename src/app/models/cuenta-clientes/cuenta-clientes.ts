export interface CuentaClientes {
  id: number;
  idventa: number;
  iddocumento: string;
  creferencia: string;
  documento: number;
  comprobante: number;
  fecha: Date;
  vencimiento: Date;
  cliente: string;
  sucursal: number;
  moneda: number;
  pago: number
  vendedor: number;
  caja: number;
  importe: number;
  numerocuota: number;
  cuota: number;
  saldo: number;
  seleccionado?: boolean; // Campo opcional para selección
}
