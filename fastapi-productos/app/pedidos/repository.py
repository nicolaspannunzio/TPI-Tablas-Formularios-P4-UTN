from typing import List, Optional
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select, col
from app.pedidos.model import Pedido, DetallePedido
from app.producto.model import Producto


class PedidoRepository:
    """Acceso a datos de Pedido. No hace commit: eso lo decide el Unit of Work."""

    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, pedido_id: int) -> Optional[Pedido]:
        statement = select(Pedido).where(
            Pedido.id == pedido_id,
            col(Pedido.deleted_at).is_(None),
        )
        return self.session.exec(statement).first()

    def list_active(self) -> List[Pedido]:
        statement = (
            select(Pedido)
            .where(col(Pedido.deleted_at).is_(None))
            .options(selectinload(Pedido.detalles))  # evita N+1 al serializar los detalles
            .order_by(col(Pedido.id).desc())
        )
        return list(self.session.exec(statement).all())

    def create(self, pedido: Pedido) -> Pedido:
        self.session.add(pedido)
        self.session.flush()  # genera el id sin confirmar la transacción
        return pedido


class DetallePedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, detalle: DetallePedido) -> DetallePedido:
        self.session.add(detalle)
        self.session.flush()
        return detalle

    def get_by_pedido_id(self, pedido_id: int) -> List[DetallePedido]:
        statement = select(DetallePedido).where(DetallePedido.pedido_id == pedido_id)
        return list(self.session.exec(statement).all())


class ProductoLookupRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, producto_id: int) -> Optional[Producto]:
        return self.session.get(Producto, producto_id)
