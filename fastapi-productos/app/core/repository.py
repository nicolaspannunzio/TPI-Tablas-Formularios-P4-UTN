from typing import Generic, TypeVar, Type, List, Optional
from sqlmodel import SQLModel, Session, select

T = TypeVar("T", bound=SQLModel)

class GenericRepository(Generic[T]):
    def __init__(self, session: Session, model_cls: Type[T]):
        self.session = session
        self.model_cls = model_cls

    def get_by_id(self, id: int) -> Optional[T]:
        return self.session.get(self.model_cls, id)

    def list(self) -> List[T]:
        statement = select(self.model_cls)
        return list(self.session.exec(statement).all())

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()  # Genera el ID sin commitear la transacción
        return entity

    def delete(self, entity: T) -> None:
        self.session.delete(entity)