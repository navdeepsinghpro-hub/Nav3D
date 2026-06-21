from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate

router = APIRouter()


@router.post("/projects")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    new_project = Project(
        name=project.name,
        owner_id=1
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project saved",
        "project_id": new_project.id,
        "name": new_project.name
    }