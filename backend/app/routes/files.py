from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from app.auth.dependencies import get_current_user
import os
import shutil

router = APIRouter()


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


@router.get("/projects/{project_id}/download/{filename}")
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
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

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

    old_path = os.path.join(upload_dir, old_filename)
    new_path = os.path.join(upload_dir, new_filename)

    if not os.path.exists(old_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    os.rename(old_path, new_path)

    return {
        "message": "File renamed successfully"
    }