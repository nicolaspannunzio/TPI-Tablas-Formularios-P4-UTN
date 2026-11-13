from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


def utc_now() -> datetime:
    """
    Fecha/hora UTC con zona horaria. Reemplaza datetime.utcnow() (deprecado).
    Las versiones recientes de SQLModel (>= 0.0.4x) rechazan datetimes "naive".
    """
    return datetime.now(timezone.utc)


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: datetime = Field(default_factory=utc_now)
    estado: str = Field(default="PENDIENTE")  # PENDIENTE, CONFIRMADO, ENTREGADO, CANCELADO
    total: float = Field(default=0.0)
    deleted_at: Optional[datetime] = Field(default=None)

    detalles: List["DetallePedido"] = Relationship(back_populates="pedido")


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"

    # Clave primaria compuesta (pedido_id, producto_id), como en el diagrama UML
    pedido_id: int = Field(foreign_key="pedidos.id", primary_key=True)
    producto_id: int = Field(foreign_key="productos.id", primary_key=True)
    cantidad: int = Field(ge=1)
    precio_unitario: float = Field(ge=0)

    pedido: Optional[Pedido] = Relationship(back_populates="detalles")
