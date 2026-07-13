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

    unique_filename = (
            f"{uuid.uuid4()}_{file.filename}"
        )

    file_path = os.path.join(
            upload_dir,
            unique_filename
        )
            

    with open(file_path, "wb") as buffer:
        buffer.write(
            await file.read()
        )

    return {
    "message": "File saved",
    "filename": unique_filename,
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

    result = []

    for filename in os.listdir(upload_dir):
        file_path = os.path.join(
            upload_dir,
            filename
        )

        result.append(
            {
                "name": filename,
                "size": os.path.getsize(file_path)
            }
        )

    return result

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

@router.delete("/projects/{project_id}/files/{filename}")
def delete_file(
    project_id: int,
    filename: str,
    current_user=Depends(get_current_user),
):
    file_path = os.path.join(
        "uploads",
        f"project_{project_id}",
        filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    os.remove(file_path)

    return {
        "message": "File deleted successfully"
    }

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

@router.put("/projects/{project_id}/files/{old_filename}")
def rename_file(
    project_id: int,
    old_filename: str,
    new_filename: str
):
    upload_dir = os.path.join(
        "uploads",
        f"project_{project_id}"
    )

    old_path = os.path.join(
        upload_dir,
        old_filename
    )

    new_path = os.path.join(
        upload_dir,
        new_filename
    )

    if not os.path.exists(old_path):
        return {
            "message": "File not found"
        }

    os.rename(
        old_path,
        new_path
    )

    return {
        "message": "File renamed"
    }

@router.post("/projects/{project_id}/upload")
def upload_file(
    project_id: int,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    upload_folder = f"uploads/project_{project_id}"

    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename
    }

@router.get("/projects/{project_id}/files")
def get_project_files(
    project_id: int,
    current_user=Depends(get_current_user),
):
    folder = f"uploads/project_{project_id}"

    if not os.path.exists(folder):
        return []

    files = []

    for file in os.listdir(folder):
        files.append({
            "name": file,
            "size": os.path.getsize(os.path.join(folder, file))
        })

    return files

@router.post("/projects/{project_id}/scene")
def save_scene(
    project_id: int,
    scene: list,
):
    import json
    import os

    folder = f"uploads/project_{project_id}"

    os.makedirs(folder, exist_ok=True)

    with open(
        os.path.join(folder, "scene.json"),
        "w"
    ) as f:
        json.dump(scene, f)

    return {
        "message": "Scene Saved"
    }