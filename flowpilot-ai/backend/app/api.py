from fastapi import APIRouter

from app.features.auth.router import router as auth_router
from app.features.chat.router import router as conversations_router
from app.features.documents.router import router as files_router
from app.features.memories.router import router as memories_router
from app.features.executions.router import router as executions_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(conversations_router)
api_router.include_router(files_router)
api_router.include_router(memories_router)
api_router.include_router(executions_router)


@api_router.get(
    "/health",
    tags=["Health"],
)
def health():

    return {
        "status": "healthy",
    }