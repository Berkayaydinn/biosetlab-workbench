from typing import Dict, Literal, Union
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.input.model_input import ModelInput
from app.models.graph.node.node import BaseNode
from app.models.graph.error import ErrorType
from app.models.graph.output.evaluation_output import EvaluationResultsOutput, PredictionsOutput

from app.utils.data_validator import Check
from app.utils.file import get_file_data


"""
Node that takes model and test data as input and returns the scores and predictions.
"""


class PredictionsNode(BaseNode):
    """
    Node that takes model and test data as input and returns the scores and predictions.

    Inputs:
        data: The test data.
        model: The model to test.
    
    Outputs:
        evaluation_results: The evaluation results.
        predictions: The predictions.
    """
    name: str = "Predictions"
    type: Literal["node-evaluation-predictions"] = "node-evaluation-predictions"
    inputs: Dict[str, Union[DataInput, ModelInput]] = {
        "data": DataInput(name="Data"),
        "model": ModelInput(name="Model", multi=True)
    }
    outputs: Dict[str, Union[EvaluationResultsOutput, PredictionsOutput]] = {
        "evaluation_results": EvaluationResultsOutput(name="Evaluation Results"),
        "predictions": PredictionsOutput(name="Predictions")
    }

    def build(self):
        """
        Build the file node.
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

        # Get models
        models_input = self.inputs["model"]._value
        Check(models_input, "Model").is_provided().is_(list).length(0, "greater")

        models = {}
        for model_input in models_input:
            source, model_input = model_input.source, model_input.value
            is_provided = model_input is not None and model_input != ""
            if not is_provided:
                self.raise_error(
                    type=ErrorType.WARNING,
                    message="The model '{}' has an error or is not provided. This model will be skipped.".format(source.name)
                )
                continue
            model_name = source.name + " (" + str(source.name_count) + ")" if source.name_count > 0 else source.name
            model = model_input.get("model", None)
            if not model:
                self.raise_error(
                    type=ErrorType.WARNING,
                    message="The model '{}' is not fitted. Please fit the model using the training data. This model will be skipped.".format(model_name)
                )
                continue
            models[model_name] = model

        scores, predictions, best_models = self.get_scores_by_model(models, feature_data, target_data)

        # Get confusion matrix and roc curve
        for model_name, model_info in scores.items():
            model = best_models[model_name]
            model_results = model_info["scores"]

            # Get confusion matrix
            confusion_matrix_data = []
            class_names = []
            roc_curve_data = None
            
            if MLOps.is_classification(model):
                confusion_matrix_data = MLOps.get_confusion_matrix(model, feature_data, target_data)
                class_names = model.classes_.tolist()
                roc_curve_data = MLOps.get_roc_curve(model, feature_data, target_data)
            
            # Set as visualization data
            confusion_matrix = {
                "data": confusion_matrix_data,
                "labels": class_names
            }
            scores[model_name]["confusion_matrix"] = confusion_matrix
            scores[model_name]["roc_curve"] = roc_curve_data

        # Build outputs
        self.outputs["evaluation_results"].build(scores)
        self.outputs["predictions"].build(predictions, name="Predictions", skip_column_info=True)
        return


    def get_scores_by_model(self, models, feature_data, target_data):
        """
        Get the scores for each model.
        """

        scores, predictions, best_models = Predictions(models, feature_data, target_data)()
        for model_name in scores.keys():
            scores[model_name]["evaluation_type"] = "prediction"
        return scores, predictions, best_models


class Predictions:
    def __init__(self, models, feature_data, target_data):
        # Parameters
        self.models = models
        self.feature_data = feature_data
        self.target_data = target_data

        # Results
        self.scores = {}
        self.best_models = {}
        self.predictions = None

    def __call__(self):
        """
        Run the test and score.
        """
        # Get the predictions
        self.predictions = self.feature_data.copy()
        self.predictions[self.target_data.name + " (Target)"] = self.target_data

        # Run the test per model
        for model_name, model in self.models.items():
            scores, predictions, best_model = self._run(model, self.feature_data, self.target_data)

            # Add the predictions
            self.predictions[model_name] = predictions

            # Save the scores
            self.scores[model_name] = {
                "model": model_name,
                "scores": scores,
                "features": self.feature_data.columns.tolist(),
                "target": self.target_data.name
            }

            # Save the best model
            self.best_models[model_name] = best_model

        return self.scores, self.predictions, self.best_models

    def _run(self, model, feature_data, target_data):
        """
        Run the test and score.
        """
        # Import the necessary libraries
        import pandas as pd

        # Check if the model is regression
        is_model_regression = MLOps.is_regression(model)
        if is_model_regression:
            # Encode the target
            target_data = MLOps.label_encode(target_data)
            target_data = pd.Series(target_data)

        # Get predictions
        predictions, _ = MLOps.get_predictions(model, feature_data, target_data)

        # Get scores
        scores = MLOps.get_scores(model=model, target_data=target_data, predictions=predictions)

        return scores, predictions, model
