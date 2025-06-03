export interface Caja{
    codigo: number;
    nombre: string;
    responsable: string;
    iniciotimbrado: Date;
    vencetimbrado: Date;
    timbrado: number;
    factura :number;
    expedicion: string;
    recibo: number;
    impresoracaja:string;
    estado:number;
    createdAt?: string | null;
    updatedAt?: string | null;
 }

