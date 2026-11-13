import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from "../types/ingrediente";
import { API_BASE, buildApiError } from "./http";

const API_URL = `${API_BASE}/ingredientes`;

export async function getIngredientes(): Promise<Ingrediente[]> {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw await buildApiError(res, "Error al obtener los ingredientes");
  return res.json();
}

export async function createIngrediente(data: IngredienteCreate): Promise<Ingrediente> {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res, "Error al crear el ingrediente");
  return res.json();
}

export async function updateIngrediente({ id, data }: { id: number; data: IngredienteUpdate }): Promise<Ingrediente> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res, "Error al actualizar el ingrediente");
  return res.json();
}

export async function deleteIngrediente(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw await buildApiError(res, "Error al eliminar el ingrediente");
}
