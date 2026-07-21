from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput

from app.utils.data_validator import Check
from app.utils.file import get_file_data


"""
Apply decision tree classification to the data.
"""


class DecisionTree(BaseNode):
    """
    Node that takes data as input and returns the decision tree model.
    """
    name: str = "Decision Tree"
    type: Literal["node-prediction-decision-tree"] = "node-prediction-decision-tree"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, ModelOutput] = {
        "model": ModelOutput(name="Model")
    }

    def build(self):
        """
        Build the decision tree node.
        """
        print(f"Building {self.name} node")

        # Get Decision Tree parameters
        criterion = self.parameters.get("criterion", None)
        Check(criterion, "Criterion").is_provided().is_(str).in_(["gini", "entropy", "log_loss"])
        
        max_depth = self.parameters.get("max_depth", None)
        if max_depth is not None:
            Check(max_depth, "Max Depth").is_(int).in_between(1, 1000, left_equal=True, right_equal=True)
            
        min_samples_split = self.parameters.get("min_samples_split", None)
        Check(min_samples_split, "Min Samples Split").is_provided().is_(int).in_between(1, 1000, left_equal=True, right_equal=True)
        
        min_samples_leaf = self.parameters.get("min_samples_leaf", None)
        Check(min_samples_leaf, "Min Samples Leaf").is_provided().is_(int).in_between(1, 1000, left_equal=True, right_equal=True)

        # Get sufficient majority parameter (as percentage)
        sufficient_majority = self.parameters.get("sufficient_majority", None)
        if sufficient_majority is not None:
            Check(sufficient_majority, "Sufficient Majority").is_(float).in_between(0.0, 1.0, left_equal=True, right_equal=True)
            # Convert percentage to impurity decrease
            min_impurity_decrease = 1.0 - sufficient_majority
        else:
            min_impurity_decrease = 0.0

        # Get data
        data_input_json = self.inputs["data"]._value

        # Only raw model mode
        if not data_input_json or data_input_json == "":
            # Apply decision tree
            raw_model, _ = MLOps.decision_tree(
                None,
                None,
                criterion=criterion,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf,
                min_impurity_decrease=min_impurity_decrease
            )
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

        # Apply decision tree
        raw_model, model = MLOps.decision_tree(
            feature_data, 
            target_data,
            criterion=criterion,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            min_impurity_decrease=min_impurity_decrease
        )

        # Build outputs
        self.outputs["model"].build(raw_model, model, features=features, target=target)
        return 