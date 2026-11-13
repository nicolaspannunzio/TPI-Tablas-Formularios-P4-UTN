from sqlmodel import Session
from app.core.database import engine


class AbstractUnitOfWork:
    """
    Unit of Work base: abre la sesión al entrar al bloque `with`, hace commit si
    no hubo errores o rollback si se produjo una excepción, y siempre cierra la sesión.

    IMPORTANTE: crear UNA instancia por request (no compartirla entre requests),
    porque guarda la sesión en `self.session`.
    """

    def __enter__(self):
        self.session = Session(engine)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                self.rollback()
            else:
                self.commit()
        finally:
            # Si el commit falla, igual se libera la conexión
            self.session.close()

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()
