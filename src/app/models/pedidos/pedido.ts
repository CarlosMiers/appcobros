export interface Pedido{
    numero: number;
    fecha: Date;
    comprobante:number;
    cliente: number;
    total:number;
    createdAt?: string | null;
    updatedAt?: string | null;
 }
