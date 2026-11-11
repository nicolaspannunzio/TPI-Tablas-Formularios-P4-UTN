from typing import Optional
from pydantic import BaseModel, StringConstraints
from typing_extensions import Annotated

NombreStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]

class IngredienteCreate(BaseModel):
    nombre: NombreStr

class IngredienteUpdate(BaseModel):
    nombre: Optional[NombreStr] = None

class IngredienteRead(BaseModel):
    id: int
    nombre: str