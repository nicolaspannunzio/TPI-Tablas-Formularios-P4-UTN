import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingrediente";
import type { Ingrediente } from "../types/ingrediente";
import { DataTable } from "../components/ui/DataTable";
import { LoadingState, EmptyState, ErrorState } from "../components/ui/StatusStates";

const IngredientesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngrediente, setEditingIngrediente] = useState<Ingrediente | null>(null);

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

  const form = useForm({
    defaultValues: {
      nombre: editingIngrediente?.nombre || "",
    },
    onSubmit: async ({ value }) => {
      if (editingIngrediente) {
        updateMutation.mutate({ id: editingIngrediente.id, data: value });
      } else {
        createMutation.mutate(value);
      }
    },
  });

  const handleOpenCreate = () => {
    setEditingIngrediente(null);
    form.reset({ nombre: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ing: Ingrediente) => {
    setEditingIngrediente(ing);
    form.reset({ nombre: ing.nombre });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIngrediente(null);
  };

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
              if (window.confirm("¿Deseas eliminar este ingrediente?")) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingIngrediente ? "Editar Ingrediente" : "Nuevo Ingrediente"}
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
                      Nombre del Ingrediente
                    </label>
                    <input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej: Mozzarella"
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

export default IngredientesPage;