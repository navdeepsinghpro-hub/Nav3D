from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.auth.dependencies import get_current_user
from fastapi import UploadFile, File
import os
from fastapi.responses import FileResponse
import uuid
import shutil
from app.models.scene import SceneObject
from app.schemas.scene import SceneObjectData

router = APIRouter()


from fastapi import HTTPException

@router.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    projects = db.query(Project).filter(
        Project.owner_id == current_user["user_id"]
    ).all()

    result = []

    for project in projects:
        upload_dir = os.path.join(
            "uploads",
            f"project_{project.id}"
        )

        file_count = 0

        if os.path.exists(upload_dir):
            file_count = len(os.listdir(upload_dir))

        result.append({
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "owner_id": project.owner_id,
            "file_count": file_count
        })

    return result
@router.post("/projects")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_project = Project(
    name=project.name,
    description=project.description,
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
    existing_project.description = project.description  

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

@router.get("/projects/{project_id}")
def get_project(
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

    return project

@router.get(
    "/projects/{project_id}/download/{filename}"
)
def download_file(
    project_id: int,
    filename: str
):
    file_path = os.path.join(
        "uploads",
        f"project_{project_id}",
        filename
    )

    if not os.path.exists(file_path):
        return {
            "message": "File not found"
        }

    return FileResponse(
        file_path,
        filename=filename
    )
