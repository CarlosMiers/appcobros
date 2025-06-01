export interface DetalleProducto {
  iddetalle:number;  
  codprod: string;
  comentario: string;
  cantidad:number;
  prcosto: number;
  precio: number;
  porcentaje: number;
  descripcion: string;
  costo: number;
  impuesto: number;
  producto: Producto;
}

interface Producto {
  codigo: string; 
  descripcion: string;
}