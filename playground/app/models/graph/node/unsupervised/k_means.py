from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput

from app.utils.data_validator import Check
from app.utils.file import get_file_data

"""
Apply K-Means Clustering to the data.
"""

class KMeansNode(BaseNode):
    """
    Node that takes data as input and returns the K-Means clustering model.
    """
    name: str = "K-Means Clustering"
    type: Literal["node-unsupervised-kmeans"] = "node-unsupervised-kmeans"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, ModelOutput] = {
        "clustered_data": ModelOutput(name="Clustered Data"),
        "centroids": ModelOutput(name="Centroids")
    }

    def build(self):
        """
        Build the K-Means Clustering node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Get feature columns
        Check(self.parameters["features"], "Features").is_provided().is_(list).length(0, "greater")
        for feature in self.parameters["features"]:
            Check(feature, "Feature").is_(str).in_(data.columns)
        features = self.parameters["features"]

        # Get feature data
        feature_data = data[features]

        print("Parameters:")
        print(self.parameters)

        # Number of Clusters
        n_clusters = self.parameters.get("n_clusters", 3)
        Check(n_clusters, "Number of Clusters").is_provided().is_one_of([int]).in_between(1, 100)

        # Preprocessing (Normalize columns)
        normalize = self.parameters.get("normalize", False)

        # Initialization Method
        init = self.parameters.get("init", "k-means++")
        Check(init, "Initialization").is_provided().is_(str).in_(["k-means++", "random"])

        # Re-runs (n_init)
        n_init = self.parameters.get("n_init", 10)
        Check(n_init, "Re-runs").is_provided().is_one_of([int]).in_between(1, 100)

        # Maximum Iterations (max_iter)
        max_iter = self.parameters.get("max_iter", 300)
        Check(max_iter, "Maximum Iterations").is_provided().is_one_of([int]).in_between(1, 10000)

        # Numerical Tolerance (tol)
        tol = self.parameters.get("tol", 0.0001)
        Check(tol, "Numerical Tolerance").is_provided().is_one_of([float]).in_between(1e-7, 1.0)

        # Apply K-Means using MLOps.kmeans
        raw_model, clustered_data, centroids, model = MLOps.kmeans(
            feature_data=feature_data,
            n_clusters=n_clusters,
            normalize=normalize,
            init=init,
            n_init=n_init,
            max_iter=max_iter,
            tol=tol,
            random_state=42
        )

        # Build outputs
        self.outputs["clustered_data"].build(clustered_data, model=model, features=features)
        self.outputs["centroids"].build(centroids, model=model, features=features)

        return
