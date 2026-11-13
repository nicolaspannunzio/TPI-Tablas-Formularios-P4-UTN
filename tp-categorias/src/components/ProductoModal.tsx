import React from "react";
import { useForm } from "@tanstack/react-form";
import type { Producto, ProductoCreate } from "../types/producto";
import { Modal } from "./ui/Modal";
import { ModalActions } from "./ui/ModalActions";
import { FieldError } from "./ui/FieldError";
import { ErrorState } from "./ui/StatusStates";

interface ProductoModalProps {
  producto: Producto | null; // null = alta, objeto = edición
  isSaving: boolean;
  error: Error | null;
  onSubmit: (data: ProductoCreate) => void;
  onClose: () => void;
}

const ProductoModal: React.FC<ProductoModalProps> = ({
  producto,
  isSaving,
  error,
  onSubmit,
  onClose,
}) => {
  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio_base: producto?.precio_base ?? 0,
      disponible: producto?.disponible ?? true,
      imagenes_url: producto?.imagenes_url?.join(", ") ?? "", // URLs separadas por coma
    },
    onSubmit: ({ value }) =>
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion,
        precio_base: Number(value.precio_base),
        disponible: Boolean(value.disponible),
        imagenes_url: value.imagenes_url
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
  });

  return (
    <Modal title={producto ? "Editar Producto" : "Nuevo Producto"} onClose={onClose}>
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
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <form.Field
          name="precio_base"
          validators={{
            onChange: ({ value }) =>
              Number.isNaN(Number(value))
                ? "Ingresá un precio válido"
                : Number(value) < 0
                  ? "El precio base no puede ser negativo"
                  : undefined,
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
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
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
                rows={2}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="imagenes_url">
          {(field) => (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Imágenes (URLs separadas por coma)
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://..., https://..."
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

export default ProductoModal;
