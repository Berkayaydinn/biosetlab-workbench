import json
from typing import Dict, Literal
from app.services.file_ops import FileOps
from app.models.graph.input.distance_input import DistanceInput
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput
from app.models.graph.output.distance_output import DistanceOutput
from app.utils.data_validator import Check
from app.services.ml_ops import MLOps
import pandas as pd

class DistanceNode(BaseNode):
    """
    Node that calculates a pairwise distance matrix using a selected metric.
    """
    name: str = "Distance"
    type: Literal["node-unsupervised-distance"] = "node-unsupervised-distance"

    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }

    outputs: Dict[str, DistanceOutput] = {
        "distance_matrix": DistanceOutput(name="Distance Matrix")
    }


    def build(self):
        print(f"Building {self.name} node")

        data = self.inputs["data"]._value
        Check(data, "Data").is_provided().is_(dict)

        raw_data = data.get("data")
        if isinstance(raw_data, str):
            raw_data = json.loads(raw_data)

        Check(raw_data, "Raw Data").is_provided().is_(list)

        # Convert to DataFrame and filter numeric columns
        df = pd.DataFrame(raw_data)
        numeric_df = df.select_dtypes(include="number")
        data_list = numeric_df.values.tolist()
        print("Data List:", data_list)
        # Parameters
        metric = self.parameters.get("metric", "euclidean_normalized")
        Check(metric, "Metric").is_provided().is_(str)

        compare = self.parameters.get("compare", "rows")
        Check(compare, "Compare").is_provided().is_(str).in_(["rows", "columns"])
        print(f"Metric: {metric}, Compare: {compare}")
        # Backend hesaplama
        result = MLOps.compute_distance_matrix(data_input=data_list, parameters={
            "metric": metric,
            "compare": compare
        }, labels=numeric_df.columns.tolist())
        print("Distance Matrix Result:", result)

        # Output
        self.outputs["distance_matrix"].build(result)

        return
