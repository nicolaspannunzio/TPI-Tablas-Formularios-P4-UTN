from typing import Optional, List
from pydantic import BaseModel, Field, StringConstraints
from typing_extensions import Annotated

NombreProductoStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]

class ProductoCreate(BaseModel):
    nombre: NombreProductoStr
    descripcion: Optional[str] = ""
    precio_base: float = Field(ge=0, description="El precio base debe ser mayor o igual a 0")
    imagenes_url: Optional[List[str]] = []
    disponible: Optional[bool] = True

class ProductoUpdate(BaseModel):
    nombre: Optional[NombreProductoStr] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(default=None, ge=0)
    imagenes_url: Optional[List[str]] = None
    disponible: Optional[bool] = None

class ProductoRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = ""
    precio_base: float
    imagenes_url: List[str] = []
    disponible: bool