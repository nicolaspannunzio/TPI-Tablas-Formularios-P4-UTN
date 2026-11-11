export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url: string[];
  disponible: boolean;
}

export type ProductoCreate = Omit<Producto, "id">;
export type ProductoUpdate = Partial<ProductoCreate>;