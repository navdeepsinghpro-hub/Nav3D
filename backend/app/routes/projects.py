from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    projects = db.query(Project).filter(
        Project.owner_id == current_user["user_id"]
    ).all()

    return projects


@router.post("/projects")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_project = Project(
        name=project.name,
        owner_id=current_user["user_id"]
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project saved",
        "project_id": new_project.id,
        "name": new_project.name
    }


@router.put("/projects/{project_id}")
def update_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing_project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user["user_id"]
    ).first()

    if not existing_project:
        return {
            "message": "Project not found"
        }

    existing_project.name = project.name

    db.commit()
    db.refresh(existing_project)

    return {
        "message": "Project updated",
        "project": existing_project
    }


@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user["user_id"]
    ).first()

    if not project:
        return {
            "message": "Project not found"
        }

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted"
    }