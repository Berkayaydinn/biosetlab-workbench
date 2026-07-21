from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput

from app.utils.data_validator import Check
from app.utils.file import get_file_data


"""
Apply logistic regression to the data.
"""


class LogisticRegression(BaseNode):
    """
    Node that takes data as input and returns the logistic regression model.
    """
    name: str = "Logistic Regression"
    type: Literal["node-prediction-logistic-regression"] = "node-prediction-logistic-regression"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, ModelOutput] = {
        "model": ModelOutput(name="Model")
    }

    def build(self):
        """
        Build the file node.
        """
        print(f"Building {self.name} node")

        # Get Logistic Regression parameters
        solver = self.parameters.get("solver", None)
        Check(solver, "Solver").is_provided().is_(str).in_(["lbfgs", "liblinear", "newton-cg", "newton-cholesky", "sag", "saga"])
        penalty = self.parameters.get("penalty", None)
        Check(penalty, "Penalty").is_provided().is_(str).in_(["l1", "l2", "elasticnet", "none"])
        C = self.parameters.get("C", None)
        Check(C, "C").is_provided().is_one_of([float, int]).in_between(0.0001, 1000, left_equal=True, right_equal=True)

        # Not considered yet
        class_weight = self.parameters.get("class_weight", None) # Balanced, None

        # Get data
        data_input_json = self.inputs["data"]._value

        # Only raw model mode
        if not data_input_json or data_input_json == "":
            # Apply logistic regression
            raw_model, _ = MLOps.logistic_regression(
                None,
                None,
                solver=solver,
                penalty=penalty,
                C=C,
                class_weight=class_weight
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

        # Apply logistic regression
        raw_model, model = MLOps.logistic_regression(feature_data, target_data, solver=solver, penalty=penalty, C=C, class_weight=class_weight)

        # Build outputs
        self.outputs["model"].build(raw_model, model, features=features, target=target)
        return
