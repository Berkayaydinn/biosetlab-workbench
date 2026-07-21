from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput
from app.utils.file import get_file_data

from app.utils.data_validator import Check

class GradientBoosting(BaseNode):
    """
    Node that takes data as input and returns the gradient boosting model.
    """
    name: str = "Gradient Boosting"
    type: Literal["node-prediction-gradient-boosting"] = "node-prediction-gradient-boosting"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, ModelOutput] = {
        "model": ModelOutput(name="Model")
    }

    def build(self):
        """
        Build the linear regression node.
        """
        print(f"Building {self.name} node")
        
        # Get data
        data_input_json = self.inputs["data"]._value

        # Only raw model mode
        if not data_input_json or data_input_json == "":
            raw_model, _ = self.run_gb_scikit(None, None)
            self.outputs["model"].build(raw_model=raw_model, model=None, 
                                features=None, target=None)
            return


        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Get feature and target data
        feature_data = data[features]
        target_data = data[target]


        # Apply gradient boosting
        raw_model, model = self.run_gb_scikit(feature_data, target_data)

        # Build outputs
        self.outputs["model"].build(raw_model=raw_model, model=model, features=features, target=target)
        return
    
    
    def run_gb_scikit(self, feature_data, target_data):
        print(self.parameters)
        # Get Gradient Boosting parameters
        n_estimators = self.parameters.get("n_estimators")
        Check(n_estimators, "Number of Trees").is_provided().is_(int).in_between(1, 1000, left_equal=True, right_equal=True)
        learning_rate = self.parameters.get("learning_rate")
        Check(learning_rate, "Learning Rate").is_provided().is_(float).in_between(0.001, 1.0, left_equal=True, right_equal=True)
        replicable_training = self.parameters.get("replicable_training")
        Check(replicable_training, "Replicable Training").is_provided().is_(bool)
        max_depth = self.parameters.get("max_depth")
        Check(max_depth, "Limit depth of individual trees").is_provided().is_(int).in_between(3, 10, left_equal=True, right_equal=True)
        min_samples_split = self.parameters.get("min_samples_split")
        Check(min_samples_split, "Do not split subsets smaller than").is_provided().is_(int).in_between(2, 1000, left_equal=True, right_equal=True)
        subsample = self.parameters.get("subsample")
        Check(subsample, "Fraction of training instances").is_provided().in_between(0.01, 1.0, left_equal=True, right_equal=True)
        task_type = self.parameters.get("task_type")
        Check(task_type, "Task Type").is_provided().in_(["classification", "regression"])

        # Apply gradient boosting
        raw_model, model = MLOps.gradient_boosting(
            feature_data,
            target_data,
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            replicable_training=replicable_training,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            subsample=subsample,
            task_type=task_type
        )

        return raw_model, model
