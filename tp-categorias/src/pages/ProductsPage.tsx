import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/producto";
import type { Producto, ProductoCreate } from "../types/producto";
import { DataTable } from "../components/ui/DataTable";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/StatusStates";

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const {
    data: productos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  const form = useForm({
    defaultValues: {
      nombre: editingProducto?.nombre || "",
      descripcion: editingProducto?.descripcion || "",
      precio_base: editingProducto?.precio_base || 0,
      disponible: editingProducto?.disponible ?? true,
      imagenes_url: editingProducto?.imagenes_url?.join(", ") || "",
    },
    onSubmit: async ({ value }) => {
      const payload: ProductoCreate = {
        nombre: value.nombre,
        descripcion: value.descripcion,
        precio_base: Number(value.precio_base),
        disponible: Boolean(value.disponible),
        imagenes_url: value.imagenes_url
          ? value.imagenes_url.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingProducto) {
        updateMutation.mutate({ id: editingProducto.id, data: payload });
      } else {
        createMutation.mutate(payload);
      }
    },
  });

  const handleOpenCreate = () => {
    setEditingProducto(null);
    form.reset({ nombre: "", descripcion: "", precio_base: 0, disponible: true, imagenes_url: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Producto) => {
    setEditingProducto(prod);
    form.reset({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio_base: prod.precio_base,
      disponible: prod.disponible,
      imagenes_url: prod.imagenes_url?.join(", ") || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProducto(null);
  };

  const columns: ColumnDef<Producto>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => <span className="font-medium text-gray-500">{info.getValue<number>()}</span>,
    },
    {
      accessorKey: "nombre",
      header: "Producto",
      cell: (info) => <span className="font-semibold text-gray-900">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: "precio_base",
      header: "Precio Base",
      cell: (info) => (
        <span className="font-mono text-emerald-600 font-semibold">
          ${info.getValue<number>().toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: "disponible",
      header: "Disponibilidad",
      cell: (info) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            info.getValue<boolean>()
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {info.getValue<boolean>() ? "Disponible" : "Agotado"}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(row.original)}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => {
              if (window.confirm("¿Deseas eliminar este producto?")) {
                deleteMutation.mutate(row.original.id);
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Catálogo de productos interactivo con TanStack Table v8 y TanStack Form
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs cursor-pointer"
        >
          + Nuevo producto
        </button>
      </div>

      {isLoading && <LoadingState message="Cargando productos..." />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : "Error al conectar con la API"} />
      )}
      {!isLoading && !isError && productos.length === 0 && (
        <EmptyState message="No hay productos registrados." />
      )}
      {!isLoading && !isError && productos.length > 0 && (
        <DataTable columns={columns} data={productos} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingProducto ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field
                name="nombre"
                validators={{
                  onChange: ({ value }) => (!value.trim() ? "El nombre es obligatorio" : undefined),
                }}
              >
                {(field) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Nombre
                    </label>
                    <input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej: Pizza Napolitana"
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                    />
                    {field.state.meta.errors ? (
                      <em className="text-xs text-rose-600 mt-1 block">
                        {field.state.meta.errors.join(", ")}
                      </em>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="precio_base"
                validators={{
                  onChange: ({ value }) =>
                    Number(value) < 0 ? "El precio base no puede ser negativo" : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Precio Base ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                    />
                    {field.state.meta.errors ? (
                      <em className="text-xs text-rose-600 mt-1 block">
                        {field.state.meta.errors.join(", ")}
                      </em>
                    ) : null}
                  </div>
                )}
              </form.Field>

              <form.Field name="descripcion">
                {(field) => (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows={2}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="disponible">
                {(field) => (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="disponible"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="disponible" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Producto disponible para venta
                    </label>
                  </div>
                )}
              </form.Field>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductsPage;