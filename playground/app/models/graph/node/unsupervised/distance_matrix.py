from typing import Dict, Literal
import numpy as np
from app.models.graph.input.distance_input import DistanceInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check


class DistanceMatrixNode(BaseNode):
    """
    Node that displays and processes distance matrix data.
    """
    name: str = "Distance Matrix"
    type: Literal["node-unsupervised-distance-matrix"] = "node-unsupervised-distance-matrix"
    inputs: Dict[str, DistanceInput] = {
        "distance_matrix": DistanceInput(name="Distance Matrix")
    }
    outputs: Dict[str, DictOutput] = {
        "matrix_data": DictOutput(name="Matrix Data"),
        "statistics": DictOutput(name="Matrix Statistics")
    }

    def build(self):
        """
        Build the distance matrix processing and statistics.
        """
        print(f"Building {self.name} node")

        # Get distance matrix data
        data_input = self.inputs["distance_matrix"]._value
        Check(data_input, "Distance Matrix").is_provided().is_(dict)

        matrix = data_input.get("values")
        labels = data_input.get("labels")
        metric = data_input.get("metric", "unknown")
        compare = data_input.get("compare", "rows")

        Check(matrix, "Distance Values").is_provided().is_(list)
        Check(labels, "Labels").is_provided().is_(list)

        # Convert to numpy array for easier manipulation
        distance_matrix = np.array(matrix)
        
        # Calculate statistics
        matrix_stats = {
            'min_distance': float(np.min(distance_matrix)),
            'max_distance': float(np.max(distance_matrix)),
            'mean_distance': float(np.mean(distance_matrix)),
            'std_distance': float(np.std(distance_matrix)),
            'median_distance': float(np.median(distance_matrix)),
            'shape': distance_matrix.shape,
            'metric': metric,
            'compare': compare
        }

        # Prepare matrix data output
        matrix_data = {
            'values': matrix,
            'labels': labels,
            'metric': metric,
            'compare': compare,
            'shape': distance_matrix.shape
        }

        print(f"Distance matrix processed: {distance_matrix.shape} with metric {metric}")
        
        # Build outputs
        self.outputs["matrix_data"].build(value=matrix_data, full=True)
        self.outputs["statistics"].build(value=matrix_stats, full=True)
        self.success = True
        
        return 