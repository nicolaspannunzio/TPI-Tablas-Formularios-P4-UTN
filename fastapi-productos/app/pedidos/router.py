from typing import List
from fastapi import APIRouter, status
from app.pedidos.schema import PedidoCreate, PedidoRead, PedidoUpdateEstado
from app.pedidos.service import PedidoService

router = APIRouter(prefix="/pedidos", tags=["pedidos"])
service = PedidoService()

@router.get("/", response_model=List[PedidoRead])
def listar():
    return service.listar_pedidos()

@router.get("/{id}", response_model=PedidoRead)
def obtener(id: int):
    return service.obtener_por_id(id)

@router.post("/", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear(data: PedidoCreate):
    return service.crear_pedido(data)

@router.put("/{id}", response_model=PedidoRead)
def actualizar(id: int, data: PedidoUpdateEstado):
    return service.actualizar_estado(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int):
    service.eliminar_logico(id)
    return None