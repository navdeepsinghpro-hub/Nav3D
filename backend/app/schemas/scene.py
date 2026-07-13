from pydantic import BaseModel

class SceneObjectData(BaseModel):
    filename: str

    pos_x: float
    pos_y: float
    pos_z: float

    rot_x: float
    rot_y: float
    rot_z: float

    scale_x: float
    scale_y: float
    scale_z: float