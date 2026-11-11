from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.core.database import get_session
from app.producto.schema import ProductoCreate, ProductoUpdate, ProductoRead
from app.producto import service

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("/", response_model=List[ProductoRead])
def listar(session: Session = Depends(get_session)):
    return service.get_all(session)

@router.get("/{id}", response_model=ProductoRead)
def obtener(id: int, session: Session = Depends(get_session)):
    return service.get_by_id(id, session)

@router.post("/", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear(data: ProductoCreate, session: Session = Depends(get_session)):
    return service.create(data, session)

@router.put("/{id}", response_model=ProductoRead)
def actualizar(id: int, data: ProductoUpdate, session: Session = Depends(get_session)):
    return service.update(id, data, session)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int, session: Session = Depends(get_session)):
    service.delete(id, session)
    return None