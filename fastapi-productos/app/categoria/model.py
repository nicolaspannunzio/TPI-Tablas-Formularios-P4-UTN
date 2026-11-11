from typing import Optional
from sqlmodel import SQLModel, Field

class CategoriaBase(SQLModel):
    nombre: str = Field(index=True)
    descripcion: Optional[str] = Field(default="")

class Categoria(CategoriaBase, table=True):
    __tablename__ = "categorias"

    id: Optional[int] = Field(default=None, primary_key=True)