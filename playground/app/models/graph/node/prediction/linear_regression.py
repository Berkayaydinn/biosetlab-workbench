from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput

from app.utils.data_validator import Check

from app.utils.file import get_file_data


class LinearRegression(BaseNode):
    """
    Node that takes data as input and returns the linear regression model.
    """
    name: str = "Linear Regression"
    type: Literal["node-prediction-linear-regression"] = "node-prediction-linear-regression"
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

        # TODO: Change input validation to use Check class

        # Get Linear Regression parameters
        fit_intercept = self.parameters.get("fit_intercept", True)
        regularization = self.parameters.get("regularization", "none").lower()
        alpha = self.parameters.get("strength", 1.0)
        l1_ratio = self.parameters.get("elasticnetMixing", None)

        # Check parameters
        Check(fit_intercept, "Fit Intercept").is_provided().is_(bool)
        Check(regularization, "Regularization").is_provided().in_(["none", "l1", "l2", "elasticnet"])
        Check(alpha, "Alpha").is_provided().is_one_of([float, int]).in_between(0.0001, 1000, left_equal=True, right_equal=True)
        Check(l1_ratio, "Elasticnet Mixing").is_provided().is_(float).in_between(0.0, 0.99, left_equal=True, right_equal=True)

        # Get data
        data_input_json = self.inputs["data"]._value

        if not data_input_json or data_input_json == "":
            print("No data provided")
            # Apply linear regression
            raw_model, _ = MLOps.linear_regression(
                None,
                None,
                fit_intercept=fit_intercept,
                regularization=regularization,
                alpha=alpha,
                l1_ratio=l1_ratio
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

        # Apply linear regression
        raw_model, model = MLOps.linear_regression(
            feature_data,
            target_data,
            fit_intercept=fit_intercept,
            regularization=regularization,
            alpha=alpha,
            l1_ratio=l1_ratio
        )

        # Build outputs
        self.outputs["model"].build(raw_model=raw_model, model=model, features=features, target=target)
        return
