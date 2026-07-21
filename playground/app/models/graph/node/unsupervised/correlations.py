from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data


class CorrelationsNode(BaseNode):
    """
    Node that takes data as input and returns the correlation matrix.
    """
    name: str = "Feature Correlations"
    type: Literal["node-unsupervised-correlations"] = "node-unsupervised-correlations"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DictOutput] = {
        "correlations": DictOutput(name="Correlation Results")
    }

    def build(self):
        """
        Build the Correlations Node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Validate Feature Columns
        Check(self.parameters["features"], "Features").is_provided().is_(list).length(0, "greater")
        for feature in self.parameters["features"]:
            Check(feature, "Feature").is_(str).in_(data.columns)
        features = self.parameters["features"]

        # Extract feature data
        feature_data = data[features]

        print("Parameters:")
        print(self.parameters)

        # Correlation Type
        correlation_type = self.parameters.get("correlationType", "pearson")
        Check(correlation_type, "Correlation Type").is_provided().is_(str).in_(["pearson", "spearman"])

        # Target Feature Selection
        target = self.parameters.get("target", "all")
        Check(target, "Target Variable").is_provided().is_(str)
        if target != "all":
            Check(target, "Target Variable").in_(features)

        # Compute correlations
        correlation_df, correlation_results = MLOps.compute_correlations(
            data=feature_data,
            correlation_type=correlation_type,
            target=target
        )

        # Print for debugging
        print("Correlation Results:", correlation_results)

        # Build outputs ✅ Now properly storing in DictOutput
        self.outputs["correlations"].build(
            value={
                "data": correlation_results,
                "metadata": {
                    "features": features,
                    "correlation_type": correlation_type,
                    "target": target
                }
            },
            full=True
        )

        # ✅ Ensure frontend receives correct visualization data
        self.outputs["correlations"].display_value = {
            "data": correlation_results,
            "metadata": {
                "features": features,
                "correlation_type": correlation_type,
                "target": target
            }
        }

        return 
