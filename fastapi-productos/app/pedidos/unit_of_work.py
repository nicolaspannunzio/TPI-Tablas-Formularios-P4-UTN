from app.core.unit_of_work import AbstractUnitOfWork
from app.pedidos.repository import (
    PedidoRepository,
    DetallePedidoRepository,
    ProductoLookupRepository
)

class PedidoUnitOfWork(AbstractUnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoLookupRepository(self.session)
        return self