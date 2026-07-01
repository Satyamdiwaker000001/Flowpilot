from app.db.base import Base
from app.db.session import engine


def run_migrations() -> None:
    """
    Development only.
    Creates all database tables from SQLAlchemy models.
    Remove this once Alembic migrations become the only
    source of truth.
    """
    Base.metadata.create_all(bind=engine)