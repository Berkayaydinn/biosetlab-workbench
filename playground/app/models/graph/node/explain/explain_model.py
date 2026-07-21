from typing import Dict, Literal, Union
import numpy as np
import shap
import lime
import lime.lime_tabular
from app.models.graph.input.data_input import DataInput
from app.models.graph.input.model_input import ModelInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data

"""
Explain model predictions using SHAP values or LIME.
"""


class ExplainModelNode(BaseNode):
    """
    Node that takes a model and data as input and returns SHAP values or LIME explanations for model explanation.
    """
    name: str = "Explain Model"
    type: Literal["node-explain-explain-model"] = "node-explain-explain-model"
    inputs: Dict[str, Union[ModelInput, DataInput]] = {
        "model": ModelInput(name="Model"),
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DictOutput] = {
        "explanation": DictOutput(name="Explanation")
    }

    def build(self):
        """
        Build the model explanation node.
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
        n_samples = self.parameters.get("n_samples", 100)
        background_samples = self.parameters.get("background_samples", 50)
        explanation_type = self.parameters.get("explanation_type", "shap")

        # Validate parameters
        Check(n_samples, "Number of samples").is_provided().is_(int).in_between(1, 1000, left_equal=True, right_equal=True)
        Check(background_samples, "Number of background samples").is_provided().is_(int).in_between(1, 100, left_equal=True, right_equal=True)
        Check(explanation_type, "Explanation type").is_provided().is_(str).in_(["shap", "lime"])

        # Sample data if needed
        if len(feature_data) > n_samples:
            feature_data = feature_data.sample(n_samples, random_state=42)
            target_data = target_data[feature_data.index]

        # Create background dataset
        background_data = feature_data.sample(min(background_samples, len(feature_data)), random_state=42)

        # Get explanation based on type
        if explanation_type == "shap":
            out_data = self._get_shap_explanation(model, feature_data, background_data, features, target)
        else:  # lime
            out_data = self._get_lime_explanation(model, feature_data, features, target)

        # Build outputs
        self.outputs["explanation"]._value = out_data
        self.outputs["explanation"].build(out_data, full=True)
        return

    def _get_shap_explanation(self, model, feature_data, background_data, features, target):
        """
        Get SHAP explanation for the model.
        """
        # Initialize SHAP explainer based on model type
        if hasattr(model, "predict_proba"):
            # For models with predict_proba (like RandomForestClassifier)
            explainer = shap.KernelExplainer(model.predict_proba, background_data)
        else:
            # For models without predict_proba (like DecisionTreeRegressor)
            explainer = shap.KernelExplainer(model.predict, background_data)

        # Calculate SHAP values
        shap_values = explainer.shap_values(feature_data)

        # Handle both single and multi-output models
        if isinstance(shap_values, list):
            # For multi-output models (like multi-class classification)
            shap_values = np.array(shap_values)
            if len(shap_values.shape) == 3:  # If we have multiple classes
                # Take the mean absolute SHAP values across classes
                shap_values = np.abs(shap_values).mean(axis=0)
        else:
            shap_values = np.array(shap_values)

        # Create output dictionary
        metadata = {
            "features": features,
            "target": target,
            "n_samples": self.parameters.get("n_samples", 100),
            "background_samples": self.parameters.get("background_samples", 50),
            "model_type": type(model).__name__,
            "explanation_type": "shap"
        }

        # Get expected value (base value)
        expected_value = explainer.expected_value
        if isinstance(expected_value, np.ndarray):
            expected_value = np.squeeze(expected_value)
            if len(expected_value.shape) == 1:
                # For multi-class, take the mean of expected values
                base_value = float(np.mean(expected_value))
                # Convert numpy array to list for serialization
                expected_value = expected_value.tolist()
            else:
                # For regression with multiple outputs
                base_value = float(np.mean(expected_value))
                # Convert numpy array to list for serialization
                expected_value = float(expected_value)
        else:
            base_value = float(expected_value)
            expected_value = float(expected_value)

        # Format data for visualization
        data = []
        for i, feature in enumerate(features):
            feature_values = feature_data[feature].values.tolist()
            # Convert numpy array to list for serialization
            feature_shap_values = shap_values[:, i].tolist()
            
            # Create pairs of (feature_value, shap_value)
            feature_shap_pairs = list(zip(feature_values, feature_shap_values))
            
            # Calculate feature importance (mean absolute SHAP value)
            importance = float(np.abs(shap_values[:, i]).mean())
            
            data.append({
                "feature": feature,
                "values": feature_shap_pairs,
                "importance": importance
            })

        # Sort features by importance
        data.sort(key=lambda x: x["importance"], reverse=True)

        # Calculate final prediction for first instance
        first_instance_values = [d["values"][0][1] for d in data]  # Get SHAP values for first instance
        final_value = base_value + sum(first_instance_values)

        # Ensure all numpy types are converted to native Python types for serialization
        result = {
            "data": data,
            "metadata": metadata,
            "base_value": base_value,
            "final_value": float(final_value),
            "expected_value": expected_value
        }
        
        return result

    def _get_lime_explanation(self, model, feature_data, features, target):
        """
        Get LIME explanation for the model.
        """
        # Initialize LIME explainer
        explainer = lime.lime_tabular.LimeTabularExplainer(
            feature_data.values,
            feature_names=features,
            class_names=[str(i) for i in range(10)],  # Default class names
            mode='classification' if hasattr(model, "predict_proba") else 'regression'
        )

        # Get LIME explanation for the first instance
        exp = explainer.explain_instance(
            feature_data.iloc[0].values, 
            model.predict_proba if hasattr(model, "predict_proba") else model.predict,
            num_features=len(features)
        )

        # Format data for visualization
        data = []
        for i, (feature, (feature_value, lime_value)) in enumerate(zip(features, exp.as_list())):
            # Create pairs of (feature_value, lime_value) for all instances
            # For LIME, we only have one instance, so we repeat the same value
            feature_lime_pairs = [(feature_value, lime_value)] * len(feature_data)
            
            # Calculate feature importance (absolute LIME value)
            importance = float(abs(lime_value))
            
            data.append({
                "feature": feature,
                "values": feature_lime_pairs,
                "importance": importance
            })

        # Sort features by importance
        data.sort(key=lambda x: x["importance"], reverse=True)

        # Get base value and final value
        base_value = 0.0  # LIME starts from 0
        first_instance_values = [d["values"][0][1] for d in data]  # Get LIME values for first instance
        final_value = base_value + sum(first_instance_values)

        # Create output dictionary
        metadata = {
            "features": features,
            "target": target,
            "n_samples": self.parameters.get("n_samples", 100),
            "background_samples": self.parameters.get("background_samples", 50),
            "model_type": type(model).__name__,
            "explanation_type": "lime"
        }

        return {
            "data": data,
            "metadata": metadata,
            "base_value": base_value,
            "final_value": final_value
        }