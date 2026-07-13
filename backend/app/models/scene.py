from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class SceneObject(Base):
    __tablename__ = "scene_objects"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer)

    filename = Column(String)

    pos_x = Column(Float, default=0)
    pos_y = Column(Float, default=0)
    pos_z = Column(Float, default=0)

    rot_x = Column(Float, default=0)
    rot_y = Column(Float, default=0)
    rot_z = Column(Float, default=0)

    scale_x = Column(Float, default=1)
    scale_y = Column(Float, default=1)
    scale_z = Column(Float, default=1)