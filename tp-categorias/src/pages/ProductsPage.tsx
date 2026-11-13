import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/producto";
import type { Producto, ProductoCreate } from "../types/producto";
import ProductoModal from "../components/ProductoModal";
import { DataTable } from "../components/ui/DataTable";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/StatusStates";

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProducto(null);
  };

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

  const resetMutations = () => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  };

  const handleOpenCreate = () => {
    resetMutations();
    setEditingProducto(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Producto) => {
    resetMutations();
    setEditingProducto(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: ProductoCreate) => {
    if (editingProducto) {
      updateMutation.mutate({ id: editingProducto.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const saveError = editingProducto ? updateMutation.error : createMutation.error;

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
      accessorKey: "descripcion",
      header: "Descripción",
      cell: (info) => (
        <span className="text-gray-600 max-w-xs truncate block">{info.getValue<string>()}</span>
      ),
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
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(row.original);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("¿Deseas eliminar este producto?")) {
                resetMutations();
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

      {deleteMutation.isError && (
        <div className="mb-4">
          <ErrorState message={deleteMutation.error.message} />
        </div>
      )}

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
        <ProductoModal
          key={editingProducto?.id ?? "nuevo"}
          producto={editingProducto}
          isSaving={isSaving}
          error={saveError}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

export default ProductsPage;
