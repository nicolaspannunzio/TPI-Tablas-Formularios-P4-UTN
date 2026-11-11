from typing import List
from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.producto.model import Producto
from app.producto.schema import ProductoCreate, ProductoUpdate

def get_all(session: Session) -> List[Producto]:
    return list(session.exec(select(Producto).order_by(Producto.id.asc())).all())

def get_by_id(id: int, session: Session) -> Producto:
    item = session.get(Producto, id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con id {id} no encontrado"
        )
    return item

def create(data: ProductoCreate, session: Session) -> Producto:
    item = Producto(
        nombre=data.nombre,
        descripcion=data.descripcion or "",
        precio_base=data.precio_base,
        imagenes_url=data.imagenes_url or [],
        disponible=data.disponible if data.disponible is not None else True
    )
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

def update(id: int, data: ProductoUpdate, session: Session) -> Producto:
    item = get_by_id(id, session)
    if data.nombre is not None:
        item.nombre = data.nombre
    if data.descripcion is not None:
        item.descripcion = data.descripcion
    if data.precio_base is not None:
        item.precio_base = data.precio_base
    if data.imagenes_url is not None:
        item.imagenes_url = data.imagenes_url
    if data.disponible is not None:
        item.disponible = data.disponible

    session.add(item)
    session.commit()
    session.refresh(item)
    return item

def delete(id: int, session: Session) -> None:
    item = get_by_id(id, session)
    session.delete(item)
    session.commit()