from abc import abstractmethod, ABC
from pymongo import MongoClient
from app.core.config import cfg
from loguru import logger
from app.db.utils import KeyEncoder
import ssl
class MongoDBConnection:
    """
    - Manages the connection to the MongoDB database.
    """
    def __init__(self):
        self.start_connection()

    def start_connection(self):
        self.client = MongoClient(cfg.MONGO_URI, ssl_cert_reqs=ssl.CERT_NONE)
        self.db = self.client.get_database()
        logger.info("Connected to MongoDB")
        return self

    def close_connection(self):
        self.client.close()
        self.db = None
        self.client = None
        logger.info("Closed connection to MongoDB")
        return self

    def get_collection(self, collection_name):
        return self.db.get_collection(collection_name)


db = MongoDBConnection()


class BaseMongoDBCollection(ABC):
    """
    - Base class for MongoDB collections.
    """
    @abstractmethod
    def __init__(self, **data):
        pass

    def add(self, data: dict):
        data = KeyEncoder().encode_keys(data)
        return self.collection.insert_one(data)

    def get(self, id: str):
        _id = {"doc_id": id}
        data = self.collection.find_one(_id)
        data = KeyEncoder().decode_keys(data)
        return data

    def update(self, id: str, data: dict):
        _id = {"doc_id": id}
        return self.collection.update_one(_id, {"$set": data})

    def delete(self, id: str):
        _id = {"doc_id": id}
        return self.collection.delete_one(_id)
