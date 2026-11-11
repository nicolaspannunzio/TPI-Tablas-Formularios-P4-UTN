from typing import Optional
from sqlmodel import SQLModel, Field

class IngredienteBase(SQLModel):
    nombre: str = Field(index=True)

class Ingrediente(IngredienteBase, table=True):
    __tablename__ = "ingredientes"

    id: Optional[int] = Field(default=None, primary_key=True)