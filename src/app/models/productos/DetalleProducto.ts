export interface DetalleProducto {
  iddetalle:number;  
  idventadet:number;  
  codprod: string;
  comentario: string;
  cantidad:number;
  prcosto: number;
  precio: number;
  ivaporcentaje: number;
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