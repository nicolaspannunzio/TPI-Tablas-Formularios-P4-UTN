import React from "react";
import { useForm } from "@tanstack/react-form";
import type { Categoria, CategoriaCreate } from "../types/categoria";
import { Modal } from "./ui/Modal";
import { ModalActions } from "./ui/ModalActions";
import { FieldError } from "./ui/FieldError";
import { ErrorState } from "./ui/StatusStates";

interface CategoriaModalProps {
  categoria: Categoria | null; // null = alta, objeto = edición
  isSaving: boolean;
  error: Error | null;
  onSubmit: (data: CategoriaCreate) => void;
  onClose: () => void;
}

/** Se monta solo cuando el modal está abierto, así el formulario siempre arranca con los valores correctos. */
const CategoriaModal: React.FC<CategoriaModalProps> = ({
  categoria,
  isSaving,
  error,
  onSubmit,
  onClose,
}) => {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      descripcion: categoria?.descripcion ?? "",
    },
    onSubmit: ({ value }) => onSubmit({ nombre: value.nombre.trim(), descripcion: value.descripcion }),
  });

  return (
    <Modal title={categoria ? "Editar Categoría" : "Nueva Categoría"} onClose={onClose}>
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
                placeholder="Ej: Pizzas"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
              <FieldError errors={field.state.meta.errors} />
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
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ej: Pizzas artesanales al horno de barro"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
          )}
        </form.Field>

        {error && <ErrorState message={error.message} />}

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <ModalActions
              onCancel={onClose}
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              isSaving={isSaving}
            />
          )}
        </form.Subscribe>
      </form>
    </Modal>
  );
};

export default CategoriaModal;
