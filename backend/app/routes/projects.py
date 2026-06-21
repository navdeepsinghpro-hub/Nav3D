from fastapi import APIRouter
from app.schemas.project import ProjectCreate

router = APIRouter()


@router.post("/projects")
def create_project(project: ProjectCreate):
    return {
        "message": "Project created",
        "name": project.name
    }