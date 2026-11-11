from typing import Optional
from pydantic import BaseModel, StringConstraints
from typing_extensions import Annotated

NombreCategoriaStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]

class CategoriaCreate(BaseModel):
    nombre: NombreCategoriaStr
    descripcion: Optional[str] = ""

class CategoriaUpdate(BaseModel):
    nombre: Optional[NombreCategoriaStr] = None
    descripcion: Optional[str] = None

class CategoriaRead(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = ""