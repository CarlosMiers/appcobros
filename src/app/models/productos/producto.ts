export interface Producto{
    codigo: string;
    nombre: string;
    costo:number;
    precio_maximo:number;
    estado:number;
    createdAt?: string | null;
    updatedAt?: string | null;
 }
