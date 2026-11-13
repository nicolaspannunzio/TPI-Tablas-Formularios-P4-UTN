import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoria";
import type { Categoria, CategoriaCreate } from "../types/categoria";
import CategoriaModal from "../components/CategoriaModal";
import { DataTable } from "../components/ui/DataTable";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/StatusStates";

const CategoriasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoria(null);
  };

  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const resetMutations = () => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  };

  const handleOpenCreate = () => {
    resetMutations();
    setEditingCategoria(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Categoria) => {
    resetMutations();
    setEditingCategoria(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: CategoriaCreate) => {
    if (editingCategoria) {
      updateMutation.mutate({ id: editingCategoria.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  // Error de la API al guardar: se muestra dentro del modal, sin cerrarlo
  const saveError = editingCategoria ? updateMutation.error : createMutation.error;

  const columns: ColumnDef<Categoria>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => <span className="font-medium text-gray-500">{info.getValue<number>()}</span>,
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: (info) => <span className="font-semibold text-gray-900">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: (info) => (
        <span className="text-gray-600 max-w-sm truncate block">{info.getValue<string>()}</span>
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
              if (window.confirm("¿Deseas eliminar esta categoría?")) {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de categorías con TanStack Table v8 y TanStack Form
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs cursor-pointer"
        >
          + Nueva categoría
        </button>
      </div>

      {deleteMutation.isError && (
        <div className="mb-4">
          <ErrorState message={deleteMutation.error.message} />
        </div>
      )}

      {isLoading && <LoadingState message="Cargando categorías..." />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : "Error al conectar con la API"} />
      )}
      {!isLoading && !isError && categorias.length === 0 && (
        <EmptyState message="No hay categorías registradas." />
      )}
      {!isLoading && !isError && categorias.length > 0 && (
        <DataTable columns={columns} data={categorias} />
      )}

      {isModalOpen && (
        <CategoriaModal
          key={editingCategoria?.id ?? "nuevo"}
          categoria={editingCategoria}
          isSaving={isSaving}
          error={saveError}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

export default CategoriasPage;
