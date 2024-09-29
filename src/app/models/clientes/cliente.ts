export interface Cliente{
    codigo: number;
    nombre: string;
    ruc: string;
    cedula: string;
    fechanacimiento: Date;
    direccion: string;
    telefono: string;
    mail:string;
    sexo:number;
    estado:number;
    latitud: string;
    longitud:string;
    createdAt?: string | null;
    updatedAt?: string | null;
 }
