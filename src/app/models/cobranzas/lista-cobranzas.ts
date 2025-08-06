export interface ListaCobranza {
  idcobro: number;
  idpagos: string;
  numero: number;
  sucursal: number;
  cobrador: number;
  fecha: Date;
  cliente: number;
  moneda: number;
  cotizacionmoneda: number;
  codusuario: number;
  valores: number;
  totalpago: number;
  observacion: string;
  asiento: number;
  caja: number;
}
