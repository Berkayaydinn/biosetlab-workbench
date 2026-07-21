from typing import Dict, Literal, Union
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.input.model_input import ModelInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.dict_output import DictOutput

from app.utils.data_validator import Check
from app.utils.file import get_file_data


"""
Calculate feature importance for a model.
"""


class FeatureImportanceNode(BaseNode):
    """
    Node that takes a model and data as input and returns the feature importance.
    """
    name: str = "Feature Importance"
    type: Literal["node-explain-feature-importance"] = "node-explain-feature-importance"
    inputs: Dict[str, Union[ModelInput, DataInput]] = {
        "model": ModelInput(name="Model"),
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DictOutput] = {
        "importance": DictOutput(name="Importance")
    }

    def build(self):
        """
        Build the feature importance node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Get feature and target data
        feature_data = data[features]
        target_data = data[target]

        # Get model
        model_input = self.inputs["model"]._value
        Check(model_input, "Model").is_provided().is_(dict)
        model = model_input["model"]

        # Get parameters
        score = self.parameters.get("score", "roc_auc")
        n_permutations = self.parameters.get("n_permutations", 5)

        # Validate parameters
        Check(score, "Score").in_(["roc_auc", "accuracy", "f1", "precision", "recall", "matthews_corrcoef", "recall_spec", "log_loss",
                                      "r2", "mae", "mse"])
        Check(n_permutations, "Number of permutations").is_provided().is_(int).in_between(1, 100, left_equal=True, right_equal=True)

        # Get feature and target data
        
        # Calculate feature importance
        result = MLOps.feature_importance(model, feature_data, target_data, score, n_permutations)

        # Create importance dictionary
        metadata = {
            "x": "Feature",
            "y": "Importance"
        }

        importances = result["importances_mean"]
        importances_std = result["importances_std"]
        importances = importances.tolist()
        importances_std = importances_std.tolist()
        # data: {name: feature, value: importance}
        data = []
        for i, feature in enumerate(features):
            data.append({
                "name": feature,
                "value": importances[i],
            })
        out_data = {
            "data": data,
            "metadata": metadata
        }

        # Build outputs
        self.outputs["importance"]._value = out_data
        self.outputs["importance"].build(out_data, full=True)
        return 