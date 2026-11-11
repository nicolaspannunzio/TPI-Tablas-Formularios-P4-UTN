from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.core.database import get_session
from app.ingrediente.schema import IngredienteCreate, IngredienteUpdate, IngredienteRead
from app.ingrediente import service

router = APIRouter(prefix="/ingredientes", tags=["ingredientes"])

@router.get("/", response_model=List[IngredienteRead])
def listar(session: Session = Depends(get_session)):
    return service.get_all(session)

@router.get("/{id}", response_model=IngredienteRead)
def obtener(id: int, session: Session = Depends(get_session)):
    return service.get_by_id(id, session)

@router.post("/", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def crear(data: IngredienteCreate, session: Session = Depends(get_session)):
    return service.create(data, session)

@router.put("/{id}", response_model=IngredienteRead)
def actualizar(id: int, data: IngredienteUpdate, session: Session = Depends(get_session)):
    return service.update(id, data, session)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int, session: Session = Depends(get_session)):
    service.delete(id, session)
    return None