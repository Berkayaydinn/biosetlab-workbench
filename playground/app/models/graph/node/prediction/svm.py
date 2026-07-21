from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput
from app.utils.file import get_file_data
from app.utils.data_validator import Check

class SVMNode(BaseNode):
    """
    Node that takes data as input and returns the SVM model.
    """
    name: str = "Support Vector Machine"
    type: Literal["node-prediction-svm"] = "node-prediction-svm"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, ModelOutput] = {
        "model": ModelOutput(name="Model")
    }

    def build(self):
        """
        Build the SVM node.
        """
        print(f"Building {self.name} node")

        # SVM Type-specific parameters
        svm_type = self.parameters.get("svm_type", "SVM")
        Check(svm_type, "SVM Type").is_provided().is_(str).in_(["SVM", "v-SVM"])

        C = self.parameters.get("C", 1.0) if svm_type == "SVM" else None
        v = self.parameters.get("v", 0.5) if svm_type == "v-SVM" else None

        if C is not None:
            Check(C, "Cost (C)").is_provided().is_one_of([float, int]).in_between(0.0001, 1000, left_equal=True, right_equal=True)
        if v is not None:
            Check(v, "Complexity Bound (ν)").is_provided().is_one_of([float]).in_between(0.0, 1.0, left_equal=True, right_equal=True)

        # Kernel-specific parameters
        kernel = self.parameters.get("kernel", "rbf")
        Check(kernel, "Kernel").is_provided().is_(str).in_(["linear", "poly", "rbf", "sigmoid"])

        gamma = self.parameters.get("gamma", 0.04) if kernel in ["poly", "rbf", "sigmoid"] else None
        degree = self.parameters.get("degree", 3) if kernel == "poly" else None
        coef0 = self.parameters.get("coef0", 0.0) if kernel in ["poly", "sigmoid"] else None

        if gamma is not None:
            Check(gamma, "Gamma (g)").is_one_of([float, int]).in_between(0.0001, 10.0, left_equal=True, right_equal=True)
        if coef0 is not None:
            Check(coef0, "Coef0 (c)").is_one_of([float, int]).in_between(0.0, 10.0, left_equal=True, right_equal=True)
        if degree is not None:
            Check(degree, "Degree (d)").is_one_of([int]).in_between(1, 10, left_equal=True, right_equal=True)

        # Optimization parameters
        tol = self.parameters.get("tol", 0.001)
        max_iter = self.parameters.get("max_iter", None)

        Check(tol, "Numerical Tolerance").is_one_of([float]).in_between(1e-5, 1.0, left_equal=True, right_equal=True)
        if max_iter is not None:
            Check(max_iter, "Iteration Limit").is_one_of([int]).in_between(1, 10000, left_equal=True, right_equal=True)

        # Get data
        data_input_json = self.inputs["data"]._value

        if not data_input_json or data_input_json == "":
            raw_model, _ = MLOps.svm(
                None,
                None,
                svm_type=svm_type,
                kernel=kernel,
                C=C,
                degree=degree,
                gamma=gamma,
                coef0=coef0,
                tol=tol,
                max_iter=max_iter,
                v=v
            )
            self.outputs["model"].build(raw_model=raw_model, model=None, features=None, target=None)
            return
        
        # Get data
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Get feature and target data
        feature_data = data[features]
        target_data = data[target]

        # Apply SVM
        raw_model, model = MLOps.svm(
            feature_data=feature_data,
            target_data=target_data,
            svm_type=svm_type,
            kernel=kernel,
            C=C,
            degree=degree,
            gamma=gamma,
            coef0=coef0,
            tol=tol,
            max_iter=max_iter,
            v=v
        )

        # Build outputs
        self.outputs["model"].build(raw_model, model, features=features, target=target)
        return
