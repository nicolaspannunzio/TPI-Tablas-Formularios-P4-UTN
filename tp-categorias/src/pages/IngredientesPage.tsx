import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingrediente";
import type { Ingrediente, IngredienteCreate } from "../types/ingrediente";
import IngredienteModal from "../components/IngredienteModal";
import { DataTable } from "../components/ui/DataTable";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/StatusStates";

const IngredientesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIngrediente(null);
  };

  const {
    data: ingredientes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  });

  const createMutation = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
    },
  });

  const resetMutations = () => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  };

  const handleOpenCreate = () => {
    resetMutations();
    setEditingIngrediente(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Ingrediente) => {
    resetMutations();
    setEditingIngrediente(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: IngredienteCreate) => {
    if (editingIngrediente) {
      updateMutation.mutate({ id: editingIngrediente.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const saveError = editingIngrediente ? updateMutation.error : createMutation.error;

  const columns: ColumnDef<Ingrediente>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => <span className="font-medium text-gray-500">{info.getValue<number>()}</span>,
    },
    {
      accessorKey: "nombre",
      header: "Ingrediente",
      cell: (info) => <span className="font-semibold text-gray-900">{info.getValue<string>()}</span>,
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
              if (window.confirm("¿Deseas eliminar este ingrediente?")) {
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de insumos con TanStack Table v8 y TanStack Form
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs cursor-pointer"
        >
          + Nuevo ingrediente
        </button>
      </div>

      {deleteMutation.isError && (
        <div className="mb-4">
          <ErrorState message={deleteMutation.error.message} />
        </div>
      )}

      {isLoading && <LoadingState message="Cargando ingredientes..." />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : "Error al conectar con la API"} />
      )}
      {!isLoading && !isError && ingredientes.length === 0 && (
        <EmptyState message="No hay ingredientes registrados." />
      )}
      {!isLoading && !isError && ingredientes.length > 0 && (
        <DataTable columns={columns} data={ingredientes} />
      )}

      {isModalOpen && (
        <IngredienteModal
          key={editingIngrediente?.id ?? "nuevo"}
          ingrediente={editingIngrediente}
          isSaving={isSaving}
          error={saveError}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
};

export default IngredientesPage;
