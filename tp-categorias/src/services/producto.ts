import type { Producto, ProductoCreate, ProductoUpdate } from "../types/producto";

const API_URL = "http://127.0.0.1:8000/productos";

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("Error al obtener los productos");
  return res.json();
}

export async function createProducto(data: ProductoCreate): Promise<Producto> {
  const res = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear el producto");
  return res.json();
}

export async function updateProducto({ id, data }: { id: number; data: ProductoUpdate }): Promise<Producto> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar el producto");
  return res.json();
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el producto");
}