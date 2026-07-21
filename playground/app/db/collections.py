from app.db.mongo import BaseMongoDBCollection, db
from app.db.utils import KeyEncoder
from loguru import logger


class ProjectCollection(BaseMongoDBCollection):
    def __init__(self, **data):
        self.collection = db.get_collection("projects")

    def get_by_owner(self, owner_id: str):
        logger.debug(f"Finding projects for owner {owner_id}")
        logger.debug(f"Collection: {self.collection}")
        cursor = self.collection.find({"owner_id": owner_id})
        projects = [project for project in cursor]
        logger.debug(f"Projects: {projects}")

        # Decode keys
        projects = KeyEncoder().decode_keys(projects)
        return projects


project_collection = ProjectCollection()
