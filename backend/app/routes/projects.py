from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate
from app.auth.dependencies import get_current_user
from fastapi import UploadFile, File
import os

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

@router.post("/projects/{project_id}/upload")
async def upload_file(
    project_id: int,
    file: UploadFile = File(...)
):
    upload_dir = os.path.join(
        "uploads",
        f"project_{project_id}"
    )

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_dir,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(
            await file.read()
        )

    return {
        "message": "File saved",
        "filename": file.filename,
        "path": file_path
    }

@router.get("/projects/{project_id}/files")
def get_project_files(
    project_id: int
):
    upload_dir = os.path.join(
    "uploads",
    f"project_{project_id}"
)

    if not os.path.exists(upload_dir):
     return []

    files = os.listdir(upload_dir)

    return files

    return {
        "message": "Project deleted"
    }

@router.delete("/files/{filename}")
def delete_file(filename: str):
    import os

    file_path = os.path.join(
        "uploads",
        filename
    )

    if not os.path.exists(file_path):
        return {
            "message": "File not found"
        }

    os.remove(file_path)

    return {
        "message": "File deleted"
    }