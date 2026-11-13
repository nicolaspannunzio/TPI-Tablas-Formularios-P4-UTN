from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field, field_validator

ESTADOS_VALIDOS = ("PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO")


class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(ge=1, description="Cantidad mayor o igual a 1")


class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float


class PedidoCreate(BaseModel):
    # RN-12: al menos un detalle (min_length=1 responde 422 con lista vacía)
    detalles: List[DetallePedidoCreate] = Field(min_length=1)

    @field_validator("detalles")
    @classmethod
    def validar_sin_repetidos(cls, v: List[DetallePedidoCreate]):
        ids = [d.producto_id for d in v]
        if len(ids) != len(set(ids)):
            raise ValueError("No se puede repetir el mismo producto en los detalles del pedido")
        return v


class PedidoUpdateEstado(BaseModel):
    estado: str

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: str):
        v_upper = v.strip().upper()
        if v_upper not in ESTADOS_VALIDOS:
            raise ValueError(f"Estado inválido. Opciones válidas: {', '.join(ESTADOS_VALIDOS)}")
        return v_upper


class PedidoRead(BaseModel):
    # from_attributes permite PedidoRead.model_validate(pedido_orm)
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: datetime
    estado: str
    total: float
    detalles: List[DetallePedidoRead] = []
