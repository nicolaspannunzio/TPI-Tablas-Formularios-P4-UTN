from typing import List
from app.pedidos.model import Pedido, DetallePedido, utc_now
from app.pedidos.schema import PedidoCreate, PedidoUpdateEstado, PedidoRead
from app.pedidos.unit_of_work import PedidoUnitOfWork


# --- Excepciones de dominio: el service NO conoce HTTP, el router las traduce ---
class PedidoNoEncontrado(Exception):
    def __init__(self, pedido_id: int):
        super().__init__(f"Pedido con id {pedido_id} no encontrado o eliminado")
        self.pedido_id = pedido_id


class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int):
        super().__init__(f"Producto con id {producto_id} no encontrado")
        self.producto_id = producto_id


class PedidoService:
    """
    Cada caso de uso se ejecuta dentro de un Unit of Work (una transacción).
    Se convierte a PedidoRead DENTRO del bloque `with`, mientras la sesión sigue
    abierta: al salir se hace commit, los objetos ORM quedan expirados y la
    sesión cerrada, y devolverlos tal cual rompería la serialización
    (DetachedInstanceError).
    """

    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def listar(self) -> List[PedidoRead]:
        with self.uow as uow:
            return [PedidoRead.model_validate(p) for p in uow.pedidos.list_active()]

    def obtener(self, pedido_id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)
            return PedidoRead.model_validate(pedido)

    def crear(self, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.create(Pedido(estado="PENDIENTE", total=0.0))
            total = 0.0

            for item in data.detalles:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None:
                    # La excepción dispara el rollback: se descarta también la cabecera
                    raise ProductoNoEncontrado(item.producto_id)

                uow.detalles.create(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        precio_unitario=producto.precio_base,
                    )
                )
                total += item.cantidad * producto.precio_base

            pedido.total = round(total, 2)
            uow.session.flush()
            return PedidoRead.model_validate(pedido)

    def actualizar_estado(self, pedido_id: int, data: PedidoUpdateEstado) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)
            pedido.estado = data.estado
            uow.session.flush()
            return PedidoRead.model_validate(pedido)

    def eliminar_logico(self, pedido_id: int) -> None:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)
            pedido.deleted_at = utc_now()
