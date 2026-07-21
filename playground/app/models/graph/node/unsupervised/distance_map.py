from typing import Dict, Literal
import pandas as pd
import numpy as np
from app.models.graph.input.distance_input import DistanceInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check


class DistanceMapNode(BaseNode):
    """
    Node that creates a heatmap visualization from distance matrix input.
    """
    name: str = "Distance Map"
    type: Literal["node-unsupervised-distance-map"] = "node-unsupervised-distance-map"
    inputs: Dict[str, DistanceInput] = {
        "distance_matrix": DistanceInput(name="Distance Matrix")
    }
    outputs: Dict[str, DictOutput] = {
        "visualization": DictOutput(name="Distance Map Visualization")
    }

    def build(self):
        """
        Build the distance map visualization from distance matrix.
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
        
        # Prepare heatmap data in the format [x, y, value]
        heatmap_data = []
        
        for i, label1 in enumerate(labels):
            for j, label2 in enumerate(labels):
                distance_value = distance_matrix[i][j]
                heatmap_data.append([
                    label1,  # x-axis label
                    label2,  # y-axis label
                    round(float(distance_value), 4)  # distance value
                ])

        # Build the output
        metadata = {
            'x': labels,
            'y': labels,
            'count': len(heatmap_data),
            'metric': metric,
            'compare': compare,
            'type': 'distance_map'
        }

        out_data = {
            'data': heatmap_data,
            'metadata': metadata
        }

        print(f"Distance map created with {len(heatmap_data)} data points")
        self.outputs["visualization"].build(value=out_data, full=True)
        self.success = True
        
        return 