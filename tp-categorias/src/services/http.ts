export const API_BASE = "http://127.0.0.1:8000";

/**
 * Convierte una respuesta HTTP no exitosa en un Error con el mensaje de la API.
 * FastAPI responde { detail: "texto" } (404/409) o { detail: [{ msg, loc, ... }] } (422).
 */
export async function buildApiError(res: Response, fallback: string): Promise<Error> {
  try {
    const body = await res.json();
    const detail = body?.detail;
    if (typeof detail === "string") return new Error(detail);
    if (Array.isArray(detail)) {
      return new Error(detail.map((d: { msg?: string }) => d.msg ?? "Dato inválido").join(", "));
    }
  } catch {
    // el cuerpo no era JSON: se usa el mensaje genérico
  }
  return new Error(`${fallback} (HTTP ${res.status})`);
}
