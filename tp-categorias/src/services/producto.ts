import type { Producto, ProductoCreate, ProductoUpdate } from "../types/producto";
import { API_BASE, buildApiError } from "./http";

const API_URL = `${API_BASE}/productos`;

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw await buildApiError(res, "Error al obtener los productos");
  return res.json();
}

export async function createProducto(data: ProductoCreate): Promise<Producto> {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res, "Error al crear el producto");
  return res.json();
}

export async function updateProducto({ id, data }: { id: number; data: ProductoUpdate }): Promise<Producto> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await buildApiError(res, "Error al actualizar el producto");
  return res.json();
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw await buildApiError(res, "Error al eliminar el producto");
}
