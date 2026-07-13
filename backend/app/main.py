from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.user import User
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.models.project import Project
from app.routes.projects import router as projects_router
from fastapi.staticfiles import StaticFiles
from app.models.project import Project
from app.models.user import User
from app.models.scene import SceneObject
from app.routes.files import router as files_router
from app.routes.scene import router as scene_router
app.include_router(files_router)
app.include_router(scene_router)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(projects_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Nav3D API"
    }