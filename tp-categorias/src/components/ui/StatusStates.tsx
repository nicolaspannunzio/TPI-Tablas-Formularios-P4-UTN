import React from "react";

export const LoadingState: React.FC<{ message?: string }> = ({
  message = "Cargando datos...",
}) => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
    <span className="text-gray-500 font-medium">{message}</span>
  </div>
);

export const EmptyState: React.FC<{ message?: string }> = ({
  message = "No se encontraron registros.",
}) => (
  <div className="text-center py-12 bg-white rounded-xl shadow-xs border border-gray-100">
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);

export const ErrorState: React.FC<{ message?: string }> = ({
  message = "Ocurrió un error inesperado",
}) => (
  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
    {message}
  </div>
);