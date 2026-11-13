import type { Categoria, CategoriaCreate, CategoriaUpdate } from "../types/categoria";
import { API_BASE, buildApiError } from "./http";

const API_URL = `${API_BASE}/categorias`;

export async function getCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw await buildApiError(res, "Error al obtener las categorías");
  return res.json();
}

export async function createCategoria(data: CategoriaCreate): Promise<Categoria> {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res, "Error al crear la categoría");
  return res.json();
}

export async function updateCategoria({ id, data }: { id: number; data: CategoriaUpdate }): Promise<Categoria> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res, "Error al actualizar la categoría");
  return res.json();
}

export async function deleteCategoria(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw await buildApiError(res, "Error al eliminar la categoría");
}
