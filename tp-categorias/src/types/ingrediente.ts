export interface Ingrediente {
  id: number;
  nombre: string;
}

export type IngredienteCreate = Omit<Ingrediente, "id">;
export type IngredienteUpdate = Partial<IngredienteCreate>;