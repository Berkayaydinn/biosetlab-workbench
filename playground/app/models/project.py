from pydantic import BaseModel
from app.models.graph.graph import Graph
from bson import ObjectId


class Project(BaseModel):
    """
    - Represents a project in the playground.
    """
    doc_id: str
    owner_id: str  # TODO: Change to ObjectId after connect to user service
    name: str = ""
    description: str = ""
    created_at: str
    updated_at: str
    is_active: bool = True
    is_public: bool = False
    tags: list = []
    collaborators: list = []
    graph: Graph = Graph()

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_id

    @classmethod
    def validate_id(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value


class ProjectCreate(BaseModel):
    """
    - Represents a project in the playground.
    """
    name: str
    description: str = ""
    collaborators: list = []
    tags: list = []
    graph: Graph = Graph()


class ProjectUpdate(BaseModel):
    """
    - Represents a project in the playground.
    """
    name: str
    description: str = ""
    is_public: bool = False
    collaborators: list = []
    tags: list = []
