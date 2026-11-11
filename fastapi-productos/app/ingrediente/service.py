from typing import List
from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.ingrediente.model import Ingrediente
from app.ingrediente.schema import IngredienteCreate, IngredienteUpdate

def get_all(session: Session) -> List[Ingrediente]:
    return list(session.exec(select(Ingrediente).order_by(Ingrediente.id.asc())).all())

def get_by_id(id: int, session: Session) -> Ingrediente:
    item = session.get(Ingrediente, id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ingrediente con id {id} no encontrado"
        )
    return item

def create(data: IngredienteCreate, session: Session) -> Ingrediente:
    item = Ingrediente(nombre=data.nombre)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

def update(id: int, data: IngredienteUpdate, session: Session) -> Ingrediente:
    item = get_by_id(id, session)
    if data.nombre is not None:
        item.nombre = data.nombre
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

def delete(id: int, session: Session) -> None:
    item = get_by_id(id, session)
    session.delete(item)
    session.commit()