from typing import List
from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate

def get_all(session: Session) -> List[Categoria]:
    return list(session.exec(select(Categoria).order_by(Categoria.id.asc())).all())

def get_by_id(id: int, session: Session) -> Categoria:
    item = session.get(Categoria, id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {id} no encontrada"
        )
    return item

def create(data: CategoriaCreate, session: Session) -> Categoria:
    item = Categoria(nombre=data.nombre, descripcion=data.descripcion or "")
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

def update(id: int, data: CategoriaUpdate, session: Session) -> Categoria:
    item = get_by_id(id, session)
    if data.nombre is not None:
        item.nombre = data.nombre
    if data.descripcion is not None:
        item.descripcion = data.descripcion
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

def delete(id: int, session: Session) -> None:
    item = get_by_id(id, session)
    session.delete(item)
    session.commit()