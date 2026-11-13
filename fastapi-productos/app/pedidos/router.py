from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.pedidos.schema import PedidoCreate, PedidoRead, PedidoUpdateEstado
from app.pedidos.service import PedidoService, PedidoNoEncontrado, ProductoNoEncontrado
from app.pedidos.unit_of_work import PedidoUnitOfWork

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


def get_service() -> PedidoService:
    # Un UoW nuevo por request: guarda la sesión en self.session y no debe compartirse
    return PedidoService(PedidoUnitOfWork())


def _not_found(exc: Exception) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


# path "" => la ruta es exactamente /pedidos (con "/" habría una redirección 307)
@router.get("", response_model=List[PedidoRead])
def listar(service: PedidoService = Depends(get_service)):
    return service.listar()


@router.get("/{id}", response_model=PedidoRead)
def obtener(id: int, service: PedidoService = Depends(get_service)):
    try:
        return service.obtener(id)
    except PedidoNoEncontrado as exc:
        raise _not_found(exc)


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear(data: PedidoCreate, service: PedidoService = Depends(get_service)):
    try:
        return service.crear(data)
    except ProductoNoEncontrado as exc:
        raise _not_found(exc)


@router.put("/{id}", response_model=PedidoRead)
def actualizar(id: int, data: PedidoUpdateEstado, service: PedidoService = Depends(get_service)):
    try:
        return service.actualizar_estado(id, data)
    except PedidoNoEncontrado as exc:
        raise _not_found(exc)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int, service: PedidoService = Depends(get_service)):
    try:
        service.eliminar_logico(id)
    except PedidoNoEncontrado as exc:
        raise _not_found(exc)
