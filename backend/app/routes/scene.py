from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user

from app.models.scene import SceneObject
from app.schemas.scene import SceneObjectData

router = APIRouter()


@router.post("/projects/{project_id}/scene")
def save_scene(
    project_id: int,
    data: SceneObjectData,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    print("🔥 SAVE SCENE CALLED")
    
    obj = db.query(SceneObject).filter(
        SceneObject.project_id == project_id,
        SceneObject.filename == data.filename
    ).first()

    if obj is None:

        obj = SceneObject(
            project_id=project_id,
            filename=data.filename
        )

        db.add(obj)

    obj.pos_x = data.pos_x
    obj.pos_y = data.pos_y
    obj.pos_z = data.pos_z

    obj.rot_x = data.rot_x
    obj.rot_y = data.rot_y
    obj.rot_z = data.rot_z

    obj.scale_x = data.scale_x
    obj.scale_y = data.scale_y
    obj.scale_z = data.scale_z

    db.commit()

    return {
        "message": "Scene saved"
    }

@router.get("/projects/{project_id}/scene")
def load_scene(
    project_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    
    print("🔥 SCENE ROUTE CALLED")

    objects = db.query(SceneObject).filter(
        SceneObject.project_id == project_id
    ).all()

    return objects