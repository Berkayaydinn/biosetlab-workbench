from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput

from app.utils.file import get_file_data
from app.utils.data_validator import Check


class RandomForest(BaseNode):
    """
    Node that takes data as input and returns the random forest model.
    """
    name: str = "Random Forest"
    type: Literal["node-prediction-random-forest"] = "node-prediction-random-forest"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, ModelOutput] = {
        "model": ModelOutput(name="Model")
    }

    def build(self):
        """
        Build the random forest node.
        """
        print(f"Building {self.name} node")

        # Get Random Forest parameters
        n_estimators = self.parameters.get("n_estimators", 100)
        max_depth = self.parameters.get("max_depth", None)
        min_samples_split = self.parameters.get("min_samples_split", 2)
        min_samples_leaf = self.parameters.get("min_samples_leaf", 1)
        task_type = self.parameters.get("task_type", "classification")
        
        # Validate parameters
        Check(task_type, "task_type").is_provided().is_(str).in_(["classification", "regression"])
        Check(n_estimators, "n_estimators").is_provided().is_(int).in_between(1, 1000, left_equal=True, right_equal=True)
        Check(min_samples_split, "min_samples_split").is_provided().is_(int).in_between(2, 100, left_equal=True, right_equal=True)
        Check(min_samples_leaf, "min_samples_leaf").is_provided().is_(int).in_between(1, 100, left_equal=True, right_equal=True)
        if max_depth is not None:
            Check(max_depth, "max_depth").is_(int).in_between(1, 100, left_equal=True, right_equal=True)
        
        # Get data
        data_input_json = self.inputs["data"]._value

        # Only raw model mode
        if not data_input_json or data_input_json == "":
            # Apply random forest
            raw_model, _ = MLOps.random_forest(
                None,
                None,
                n_estimators=n_estimators,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf,
                task_type=task_type
            )
            self.outputs["model"].build(raw_model=raw_model, model=None, 
                                features=None, target=None)
            return

        # Get data
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Get feature and target data
        feature_data = data[features]
        target_data = data[target]

        # Apply random forest
        raw_model, model = MLOps.random_forest(
            feature_data,
            target_data,
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            task_type=task_type
        )

        # Build outputs
        self.outputs["model"].build(raw_model=raw_model, model=model, features=features, target=target)
        return 