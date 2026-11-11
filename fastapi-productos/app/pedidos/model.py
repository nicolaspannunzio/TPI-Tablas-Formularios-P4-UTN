from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"

    pedido_id: int = Field(foreign_key="pedidos.id", primary_key=True)
    producto_id: int = Field(foreign_key="productos.id", primary_key=True)
    cantidad: int = Field(ge=1)
    precio_unitario: float = Field(ge=0)

    pedido: Optional["Pedido"] = Relationship(back_populates="detalles")

class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"

    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: datetime = Field(default_factory=datetime.utcnow)
    estado: str = Field(default="PENDIENTE")  # PENDIENTE, CONFIRMADO, ENTREGADO, CANCELADO
    total: float = Field(default=0.0)
    deleted_at: Optional[datetime] = Field(default=None)

    detalles: List[DetallePedido] = Relationship(back_populates="pedido")