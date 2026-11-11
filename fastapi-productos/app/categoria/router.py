from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.core.database import get_session
from app.categoria.schema import CategoriaCreate, CategoriaUpdate, CategoriaRead
from app.categoria import service

router = APIRouter(prefix="/categorias", tags=["categorias"])

@router.get("/", response_model=List[CategoriaRead])
def listar(session: Session = Depends(get_session)):
    return service.get_all(session)

@router.get("/{id}", response_model=CategoriaRead)
def obtener(id: int, session: Session = Depends(get_session)):
    return service.get_by_id(id, session)

@router.post("/", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear(data: CategoriaCreate, session: Session = Depends(get_session)):
    return service.create(data, session)

@router.put("/{id}", response_model=CategoriaRead)
def actualizar(id: int, data: CategoriaUpdate, session: Session = Depends(get_session)):
    return service.update(id, data, session)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int, session: Session = Depends(get_session)):
    service.delete(id, session)
    return None