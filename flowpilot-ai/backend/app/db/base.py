from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Register all models
import app.features.auth.model  # noqa: F401
import app.features.chat.model  # noqa: F401
import app.features.documents.model  # noqa: F401
import app.features.memories.model  # noqa: F401
import app.features.executions.model  # noqa: F401