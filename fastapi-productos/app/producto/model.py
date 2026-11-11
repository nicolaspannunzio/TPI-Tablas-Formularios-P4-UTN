from typing import Optional, List
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String

class ProductoBase(SQLModel):
    nombre: str = Field(index=True)
    descripcion: Optional[str] = Field(default="")
    precio_base: float = Field(default=0.0, ge=0)
    imagenes_url: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))
    disponible: bool = Field(default=True)

class Producto(ProductoBase, table=True):
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True)