import React from "react";
import { useForm } from "@tanstack/react-form";
import type { Ingrediente, IngredienteCreate } from "../types/ingrediente";
import { Modal } from "./ui/Modal";
import { ModalActions } from "./ui/ModalActions";
import { FieldError } from "./ui/FieldError";
import { ErrorState } from "./ui/StatusStates";

interface IngredienteModalProps {
  ingrediente: Ingrediente | null; // null = alta, objeto = edición
  isSaving: boolean;
  error: Error | null;
  onSubmit: (data: IngredienteCreate) => void;
  onClose: () => void;
}

const IngredienteModal: React.FC<IngredienteModalProps> = ({
  ingrediente,
  isSaving,
  error,
  onSubmit,
  onClose,
}) => {
  const form = useForm({
    defaultValues: { nombre: ingrediente?.nombre ?? "" },
    onSubmit: ({ value }) => onSubmit({ nombre: value.nombre.trim() }),
  });

  return (
    <Modal title={ingrediente ? "Editar Ingrediente" : "Nuevo Ingrediente"} onClose={onClose}>
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
              <FieldError errors={field.state.meta.errors} />
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

export default IngredienteModal;
