 export interface DetallePreventa {
    iddetalle:number;
    codprod: number;
    cantidad: number;
    prcosto: number;
    precio: number;
    impiva: number;
    monto: number;
    porcentaje: number;
  }
  
  export interface Pedido {
    numero: number;
    fecha: Date;
    vencimiento: Date; // Nuevo campo para la fecha de vencimiento
    comprobante:number;
    cliente: number;
    totalneto:number;
    createdAt?: string | null;
    updatedAt?: string | null;
    detalles: DetallePreventa[];
    codusuario: number;  
  }


  