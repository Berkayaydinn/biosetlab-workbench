from fastapi import APIRouter
from app.api.routes import healthcheck, project, graph

router = APIRouter()

router.include_router(
    healthcheck.router, tags=["Healthcheck"], prefix="/health")
router.include_router(
    project.router, tags=["Project"], prefix="/project")
router.include_router(
    graph.router, tags=["Graph"], prefix="/graph")
