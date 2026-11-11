from datetime import datetime
from typing import List
from fastapi import HTTPException, status
from app.pedidos.model import Pedido, DetallePedido
from app.pedidos.schema import PedidoCreate, PedidoUpdateEstado
from app.pedidos.unit_of_work import PedidoUnitOfWork

class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork = None):
        self.uow = uow or PedidoUnitOfWork()

    def listar_pedidos(self) -> List[Pedido]:
        with self.uow as uow:
            return uow.pedidos.list_active()

    def obtener_por_id(self, pedido_id: int) -> Pedido:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if not pedido:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Pedido con id {pedido_id} no encontrado o ha sido eliminado"
                )
            _ = pedido.detalles  # Carga lazy dentro de la sesión activa
            return pedido

    def crear_pedido(self, data: PedidoCreate) -> Pedido:
        with self.uow as uow:
            # 1. Crear la cabecera del pedido
            pedido = uow.pedidos.create(Pedido(estado="PENDIENTE", total=0.0))
            total_acumulado = 0.0

            # 2. Validar cada producto y crear los detalles
            for item in data.detalles:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None:
                    # El rollback del UoW descartará la cabecera del pedido creada previamente
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Producto con id {item.producto_id} no encontrado"
                    )

                subtotal = item.cantidad * producto.precio_base
                total_acumulado += subtotal

                uow.detalles.create(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        precio_unitario=producto.precio_base
                    )
                )

            pedido.total = round(total_acumulado, 2)
            # Al salir del bloque with se ejecuta uow.commit() automáticamente
            return pedido

    def actualizar_estado(self, pedido_id: int, data: PedidoUpdateEstado) -> Pedido:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if not pedido:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Pedido con id {pedido_id} no encontrado"
                )
            pedido.estado = data.estado
            return pedido

    def eliminar_logico(self, pedido_id: int) -> None:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if not pedido:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Pedido con id {pedido_id} no encontrado"
                )
            pedido.deleted_at = datetime.utcnow()