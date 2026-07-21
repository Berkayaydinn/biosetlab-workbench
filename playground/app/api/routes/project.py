from fastapi import APIRouter, Depends, status, HTTPException
from app.core.security import token
from app.models.project import Project, ProjectCreate, ProjectUpdate
from app.db.collections import project_collection
from datetime import datetime
from typing import List
from loguru import logger
from app.db.utils import create_id

router = APIRouter()


@router.post(
        path="/",
        name="Add Playground Project",
        summary="""Add a new playground project for
        token authenticated user.""",
        description="""Add a new playground project for token authenticated
        user. The project is created with the provided data. doc_id, owner_id,
        created_at, updated_at are automatically generated. Returns the
        created project(Project model).""",
        status_code=status.HTTP_201_CREATED)
def add_project(
    projectCreate: ProjectCreate,
    user_id: str = Depends(token.get_user_id)
):
    current_time = str(datetime.now())
    project = Project(
            name=projectCreate.name,
            owner_id=user_id,
            description=projectCreate.description,
            doc_id=create_id(prefix="PRJ"),
            created_at=current_time,
            updated_at=current_time,
            collaborators=projectCreate.collaborators,
            tags=projectCreate.tags,
            graph=projectCreate.graph
    )

    project_collection.add(project.dict())
    project = project_collection.get(project.doc_id)
    project = Project(**project)
    return project


@router.get(
        path="/",
        name="Get All Playground Projects",
        summary="Get all playground projects of token authenticated user.",
        description="""Get all playground projects of token authenticated user.
        If no projects are found, an empty list is returned. Returns a list of
        projects(Project model).""",
        status_code=status.HTTP_200_OK,
        response_model=List[Project])
def get_projects(user_id: str = Depends(token.get_user_id)):
    logger.debug(f"Getting projects for user: {user_id}")
    projects = project_collection.get_by_owner(user_id)
    if projects is None:
        return []
    projects = [Project(**project) for project in projects]
    logger.debug(f"Found {len(projects)} projects for user: {user_id}")
    return projects


@router.get(
        path="/{project_id}",
        name="Get a specific Playground Project",
        summary="""Get a specific playground project by ID for token
        authenticated user.""",

        description="""Get a playground project by ID for token authenticated
        user. If the project is not found, a 404 Not Found error is returned.
        The project must be owned by the user. Otherwise, a 403 Forbidden
        error is returned. If the project is not active, a 404 Not Found error
        is returned. Returns the project(Project model).""",
        status_code=status.HTTP_200_OK,
        response_model=Project)
def get_project(
    project_id: str,
    user_id: str = Depends(token.get_user_id)
):
    project = project_collection.get(project_id)
    if project is None:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.")

    project = Project(**project)
    if project.owner_id != user_id:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="""User is not the owner of the project and has no
                permission to view it.""")
    if not project.is_active:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project is not active.")

    return project

@router.get(
        path="/graph/{project_id}",
        name="Get Playground Project Graph",
        summary="Get the graph data for a specific playground project.",
        description="""Get only the graph data for a playground project by ID. 
        If the project is not found, a 404 Not Found error is returned. 
        The project must be owned by the user, otherwise a 403 Forbidden 
        error is returned.""",
        status_code=status.HTTP_200_OK)
def get_project_graph(
    project_id: str,
    user_id: str = Depends(token.get_user_id)
):
    project = project_collection.get(project_id)
    if project is None:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.")

    project = Project(**project)
    if project.owner_id != user_id:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not the owner of the project.")

    return {"graph": project.graph}


@router.put(
        path="/graph/{project_id}",
        name="Update Playground Project Graph",
        summary="Update the graph data for a specific playground project.",
        description="""Update only the graph data for a playground project by ID.
        If the project is not found, a 404 Not Found error is returned.
        The project must be owned by the user, otherwise a 403 Forbidden
        error is returned.""",
        status_code=status.HTTP_200_OK)
def update_project_graph(
    project_id: str,
    graph: dict,
    user_id: str = Depends(token.get_user_id)
):
    project = project_collection.get(project_id)
    if project is None:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.")

    project = Project(**project)
    if project.owner_id != user_id:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not the owner of the project.")

    project.graph = graph
    project.updated_at = str(datetime.now())
    project_collection.update(project_id, project.dict())

    return {"graph": project.graph}



@router.put(
        path="/{project_id}",
        name="Update Playground Project",
        summary="""Update a playground project by ID for token authenticated
        user.""",
        description="""Update a playground project by ID for token
        authenticated user. If the project is not found, a 404 Not Found
        error is returned. The project must be owned by the user.
        Otherwise, a 403 Forbidden error is returned. Returns the
        updated project(Project model).""",
        status_code=status.HTTP_200_OK,
        response_model=Project)
def update_project(
    project_id: str,
    project: ProjectUpdate,
    user_id: str = Depends(token.get_user_id)
):
    existing_project = project_collection.get(project_id)
    if existing_project is None:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.")

    existing_project = Project(**existing_project)
    if existing_project.owner_id != user_id:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="""User is not the owner of the project and has no
                permission to update it.""")

    update_project = project.dict()
    update_project['doc_id'] = project_id
    update_project['owner_id'] = existing_project.owner_id
    update_project['created_at'] = existing_project.created_at
    update_project['updated_at'] = str(datetime.now())

    project = Project(**update_project)
    project_collection.update(project_id, project.dict())

    project = project_collection.get(project_id)
    project = Project(**project)
    return project


@router.delete(
        path="/{project_id}",
        name="Delete Playground Project",
        summary="""Delete a playground project by document ID for
        token authenticated user.""",
        description="""Delete a playground project by doc_id for token
        authenticated user. If the project is not found, a 404 Not Found
        error is returned. The project must be owned by the user.
        Otherwise, a 403 Forbidden error is returned. Returns None.""",
        status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    user_id: str = Depends(token.get_user_id)
):
    project = project_collection.get(project_id)

    if project is None:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found.")

    project = Project(**project)
    if project.owner_id != user_id:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="""User is not the owner of the project and has no
                permission to delete it.""")

    project_collection.delete(project_id)
    return None
