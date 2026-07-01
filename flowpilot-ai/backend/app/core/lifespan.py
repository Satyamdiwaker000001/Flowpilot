from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.logger import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("========================================")
    logger.info("Starting FlowPilot AI Backend")
    logger.info("========================================")
    
    from app.db.base import Base
    from app.db.session import engine
    
    # Initialize SQLite tables if they don't exist
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully")
    
    from app.agent.model import hf_manager
    logger.info("Loading AI Models (This may take a minute)...")
    hf_manager.initialize()
    logger.info("AI Models initialized successfully")

    yield

    logger.info("========================================")
    logger.info("Stopping FlowPilot AI Backend")
    logger.info("========================================")