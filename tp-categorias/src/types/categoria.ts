export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export type CategoriaCreate = Omit<Categoria, "id">;
export type CategoriaUpdate = Partial<CategoriaCreate>;