from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from app.producto.schema import ProductoRead

ESTADOS_VALIDOS = {"PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"}

class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(ge=1, description="Cantidad mayor o igual a 1")

class DetallePedidoRead(BaseModel):
    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float

class PedidoCreate(BaseModel):
    detalles: List[DetallePedidoCreate]

    @field_validator("detalles")
    @classmethod
    def validar_detalles(cls, v: List[DetallePedidoCreate]):
        if not v or len(v) == 0:
            raise ValueError("El pedido debe contener al menos un detalle")
        productos_ids = [d.producto_id for d in v]
        if len(productos_ids) != len(set(productos_ids)):
            raise ValueError("No se puede repetir el mismo producto en los detalles del pedido")
        return v

class PedidoUpdateEstado(BaseModel):
    estado: str

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: str):
        v_upper = v.upper().strip()
        if v_upper not in ESTADOS_VALIDOS:
            raise ValueError(f"Estado inválido. Opciones válidas: {', '.join(ESTADOS_VALIDOS)}")
        return v_upper

class PedidoRead(BaseModel):
    id: int
    fecha: datetime
    estado: str
    total: float
    detalles: List[DetallePedidoRead] = []