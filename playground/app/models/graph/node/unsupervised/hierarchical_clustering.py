from typing import Literal, Dict
from scipy.cluster.hierarchy import linkage, dendrogram, fcluster
from scipy.spatial.distance import squareform
from app.models.graph.input.input import BaseInput
from app.models.graph.input.distance_input import DistanceInput
from app.models.graph.output.dict_output import DictOutput
from app.models.graph.node.node import BaseNode
from app.utils.data_validator import Check
import numpy as np
import pandas as pd

class HierarchicalClusteringNode(BaseNode):
    name: str = "Hierarchical Clustering"
    type: Literal["node-unsupervised-hierarchical-clustering"] = "node-unsupervised-hierarchical-clustering"
    inputs: Dict[str, DistanceInput] = {
        "distance_matrix": DistanceInput(name="Distance Matrix")
    }
    outputs: Dict[str, DictOutput] = {
        "visualization": DictOutput(name="Dendrogram")
    }

    def build(self):
        print(f"Building {self.name} node")
        print ("Inputs:", self.inputs)
        data_input = self.inputs["distance_matrix"]._value
        print("Input data:", data_input)
        Check(data_input, "Distance Matrix").is_provided().is_(dict)

        matrix = data_input.get("values")
        default_labels = data_input.get("labels")
        raw_data = data_input.get("original_data")  # Annotation için gerekebilir

        Check(matrix, "Distance Values").is_provided().is_(list)
        Check(default_labels, "Labels").is_provided().is_(list)

        linkage_method = self.parameters.get("linkage", "ward")
        Check(linkage_method, "Linkage").is_provided().is_(str).in_(
            ["ward", "single", "complete", "average"]
        )

        # Etiketleri belirle (annotation_column varsa onu kullan)
        annotation_column = self.parameters.get("annotation_column")
        labels = default_labels  # fallback

        if annotation_column and raw_data:
            try:
                df = pd.DataFrame(raw_data)
                if annotation_column in df.columns:
                    labels = df[annotation_column].astype(str).tolist()
            except Exception as e:
                print(f"Annotation column error: {e}")

        # SciPy linkage için condensed matrix gerekir
        square_matrix = np.array(matrix)
        condensed = square_matrix[np.triu_indices(len(square_matrix), k=1)]

        Z = linkage(condensed, method=linkage_method)

        # Max depth varsa bunu hem fcluster hem dendrogram truncate için kullan
        max_depth = self.parameters.get("max_depth")

        if max_depth:
            cluster_assignments = fcluster(Z, t=max_depth, criterion="distance")
            dendro_dict = dendrogram(
                Z,
                labels=labels,
                no_plot=True,
                truncate_mode="level",
                p=int(max_depth)
            )
        else:
            cluster_assignments = fcluster(Z, t=5, criterion="maxclust")
            dendro_dict = dendrogram(Z, labels=labels, no_plot=True)

        cluster_colors = cluster_assignments.tolist()

        self.outputs["visualization"].build(
            value={
                "dendrogram": {
                    "icoord": dendro_dict["icoord"],
                    "dcoord": dendro_dict["dcoord"],
                    "labels": dendro_dict["ivl"]
                },
                "labels": labels,
                "cluster_colors": cluster_colors
            },
            full=True
        )
        print("Output" , self.outputs["visualization"]._value)

        self.success = True
        print("Hierarchical clustering complete.")
