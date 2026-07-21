from typing import Dict, Literal, Union
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.input.model_input import ModelInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.evaluation_output import EvaluationResultsOutput, PredictionsOutput

from app.utils.data_validator import Check
from app.utils.file import get_file_data


"""
Test and score models.
"""


class TestAndScoreNode(BaseNode):
    """
    Node that takes model and test data as input and returns the scores and predictions.

    Evaluation results include accuracy, precision, recall, f1 score,
    auc score, roc curve, nmse, and confusion matrix.

    Predictions include the input data with the predicted_target column.
    """
    name: str = "Test and Score"
    type: Literal["node-evaluation-test-and-score"] = "node-evaluation-test-and-score"
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
            Check(model_input, "Model input").is_provided().is_(dict)
            raw_model = model_input["raw_model"]
            model_name = source.name + " (" + str(source.name_count) + ")" if source.name_count > 0 else source.name
            models[model_name] = raw_model

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
        # Get evaluation type (cross-validation or random sampling)
        eval_type = self.parameters.get("evaluation_type", None)
        Check(eval_type, "Evaluation type").is_provided().is_(str).in_(["cross_validation", "random_sampling"])

        if eval_type == "cross_validation":
            scores, predictions, best_models = self.get_cross_validation_scores(models, feature_data, target_data)
        else:
            scores, predictions, best_models = self.get_random_sampling_scores(models, feature_data, target_data)
        for model_name in scores.keys():
            scores[model_name]["evaluation_type"] = eval_type
        return scores, predictions, best_models


    def get_cross_validation_scores(self, model, feature_data, target_data):
        """
        Get the cross-validation scores.
        """
        n_splits = self.parameters.get("n_splits", None)
        Check(n_splits, "Number of folds").is_provided().is_(int).in_between(0, len(feature_data), lower_label=None, upper_label="'the number of samples'")
        
        stratified = self.parameters.get("stratified", None)
        Check(stratified, "Stratified").is_provided().is_(bool)

        scores, predictions, best_models = CrossValidation(model, feature_data, target_data, n_splits, stratified)()
        return scores, predictions, best_models


    def get_random_sampling_scores(self, models, feature_data, target_data):
        """
        Get the random sampling scores.
        """
        stratified = self.parameters.get("stratified", None)
        Check(stratified, "Stratified").is_provided().is_(bool)

        repeat = self.parameters.get("repeat", None)
        Check(repeat, "Number of repeats").is_provided().is_(int).in_between(2, 100)

        train_size = self.parameters.get("train_size", None)
        Check(train_size, "Train size").is_provided().is_(float).in_between(0, 1)

        scores, predictions, best_models = RandomSampling(models, feature_data, target_data, repeat, train_size, stratified)()
        return scores, predictions, best_models
    

class RandomSampling:
    def __init__(self, models, feature_data, target_data, repeat=10, train_size=0.2, stratified=True):
        # Parameters
        self.models = models
        self.feature_data = feature_data
        self.target_data = target_data
        self.repeat = repeat
        self.train_size = train_size
        self.stratified = stratified

        # Results
        self.fold_scores = []
        self.scores = {}
        self.best_models = {}

        # Predictions
        self.predictions = feature_data.copy()
        self.predictions[self.target_data.name + " (Target)"] = target_data
        # Create index for predictions
        self.predictions["index"] = range(len(self.predictions))
        self.predictions = self.predictions.set_index("index")

        print("repeat", repeat)
        print("train_size", train_size)
        print("stratified", stratified)



    def __call__(self):
        """
        Run the test and score.
        """

        if self.stratified:
            from sklearn.model_selection import StratifiedShuffleSplit as ShuffleSplit
        else:
            from sklearn.model_selection import ShuffleSplit
        import pandas as pd

        shuffle_split = ShuffleSplit(n_splits=self.repeat, train_size=self.train_size)

        predictions_by_fold = []
        best_models_by_fold = []
        
        for fold, (train_index, test_index) in enumerate(shuffle_split.split(self.feature_data, self.target_data)):

            # Split the data
            train_data = self.feature_data.iloc[train_index]
            train_target = self.target_data.iloc[train_index]
            test_data = self.feature_data.iloc[test_index]
            test_target = self.target_data.iloc[test_index]

            print(f"Fold {fold} - Train: {len(train_data)}, Test: {len(test_data)}")

            prediction_by_fold = test_data.copy()
            prediction_by_fold["target"] = test_target
            prediction_by_fold["Fold"] = [fold + 1] * len(test_data)

            for model_name, model in self.models.items():
                scores, predictions, best_model = self._run(model, train_data, train_target, test_data, test_target)
                self.fold_scores.append({
                    "model": model_name,
                    "scores": scores,
                    "fold": fold,
                    "features": self.feature_data.columns.tolist(),
                    "target": self.target_data.name
                })
                best_models_by_fold.append({
                    "model_name": model_name,
                    "model": best_model
                })

                # Predictions - fixed assignment
                prediction_by_fold[model_name] = predictions["predicted_target"].values
            
            # Add predictions to the list
            predictions_by_fold.append(prediction_by_fold)

            # Get the mean scores
            for model_name in self.models.keys():
                model_scores = [score["scores"] for score in self.fold_scores if score["model"] == model_name]
                model_scores = {k: [score[k] for score in model_scores] for k in model_scores[0].keys()}
                model_scores = {k: sum([x for x in v if x is not None]) / len([x for x in v if x is not None]) if any(x is not None for x in v) else None for k, v in model_scores.items()}
                
                self.scores[model_name] = {
                    "model": model_name,
                    "scores": model_scores,
                    "features": self.feature_data.columns.tolist(),
                    "target": self.target_data.name
                }
            
            # Update predictions
            # Concatenate the predictions
            self.predictions = pd.concat(predictions_by_fold)
            # fold to rightmost column
            self.predictions = self.predictions[[col for col in self.predictions.columns if col != "Fold"] + ["Fold"]]
            # Sort by fold
            self.predictions = self.predictions.sort_values("Fold")

        # Get the best models
        for model_name in self.models.keys():
            best_model = [model for model in best_models_by_fold if model["model_name"] == model_name]
            best_model = sorted(best_model, key=lambda x: x["model"]["score"], reverse=True)[0]
            self.best_models[model_name] = best_model["model"]["model"]

        return self.scores, self.predictions, self.best_models
    

    def _run(self, model, train_data, train_target, test_data, test_target):
        """
        Test the given model and return the scores.
        args:
            model_name: The name of the model.
            model: The model to test.
            feature_data: The feature data.
            target_data: The target data.
            repeat: The number of times to repeat the test.
            train_size: The size of the training data.
            stratified: Whether to use stratified sampling.
        return:
            scores: The scores of the model.
            predictions: The predictions of the model.
            best_model: The best model trained.
        """
        # Import the necessary libraries
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        from sklearn.metrics import roc_auc_score, roc_curve, mean_squared_error
        import numpy as np
        import pandas as pd

        # Initialize the best model
        best_model = None
        best_score = 0

        # Check if the model is regression
        is_model_regression = MLOps.is_regression(model)
        if is_model_regression:
            # Encode the target
            train_target = MLOps.label_encode(train_target)
            test_target = MLOps.label_encode(test_target)
            train_target = pd.Series(train_target)
            test_target = pd.Series(test_target)

        # Fit the model
        model.fit(train_data, train_target)

        # Get the predictions
        predictions, _ = MLOps.get_predictions(model, test_data, test_target)

        # Get the scores
        scores = MLOps.get_scores(model=model, target_data=test_target, predictions=predictions)

        # Update the best model
        curr_score = scores["accuracy"] if not is_model_regression else scores["r2"]
        if curr_score > best_score:
            best_model = model
            best_score = curr_score
        best_model = {"model": best_model, "score": best_score}
        
        predictions = pd.DataFrame(predictions, columns=["predicted_target"])
        return scores, predictions, best_model


class CrossValidation:
    def __init__(self, models, feature_data, target_data, n_splits=5, stratified=True):
        # Parameters
        self.models = models  # Now expecting a dictionary of models
        self.feature_data = feature_data
        self.target_data = target_data
        self.n_splits = n_splits
        self.stratified = stratified

        # Results
        self.fold_scores = []
        self.scores = {}
        self.best_models = {}

        print("n_splits", n_splits)
        print("stratified", stratified)

    def __call__(self):
        if self.stratified:
            from sklearn.model_selection import StratifiedKFold as KFold
        else:
            from sklearn.model_selection import KFold
        import pandas as pd
        import numpy as np

        kf = KFold(n_splits=self.n_splits, random_state=42, shuffle=True)
        predictions_by_fold = []
        best_models_by_fold = []
        
        for fold, (train_index, test_index) in enumerate(kf.split(self.feature_data, self.target_data)):
            # Split the data
            train_data = self.feature_data.iloc[train_index]
            train_target = self.target_data.iloc[train_index]
            test_data = self.feature_data.iloc[test_index]
            test_target = self.target_data.iloc[test_index]

            print(f"Fold {fold + 1} - Train: {len(train_data)}, Test: {len(test_data)}")

            prediction_by_fold = test_data.copy()
            prediction_by_fold["target"] = test_target
            prediction_by_fold["Fold"] = [fold + 1] * len(test_data)

            for model_name, model in self.models.items():
                scores, predictions, best_model = self._run(model, train_data, train_target, test_data, test_target)
                self.fold_scores.append({
                    "model": model_name,
                    "scores": scores,
                    "fold": fold + 1,
                    "features": self.feature_data.columns.tolist(),
                    "target": self.target_data.name
                })
                best_models_by_fold.append({
                    "model_name": model_name,
                    "model": best_model
                })

                # Add model predictions to the fold
                prediction_by_fold[model_name] = predictions["predicted_target"].values
            
            predictions_by_fold.append(prediction_by_fold)

            # Process scores for each model
            for model_name in self.models.keys():
                model_scores = [score["scores"] for score in self.fold_scores if score["model"] == model_name]
                model_scores = {k: [score[k] for score in model_scores] for k in model_scores[0].keys()}
                model_scores = {k: sum([x for x in v if x is not None]) / len([x for x in v if x is not None]) if any(x is not None for x in v) else None for k, v in model_scores.items()}
                
                self.scores[model_name] = {
                    "model": model_name,
                    "scores": model_scores,
                    "features": self.feature_data.columns.tolist(),
                    "target": self.target_data.name
                }

            # Combine all predictions
            predictions = pd.concat(predictions_by_fold)
            # Reorder columns to put Fold at the end
            cols = [col for col in predictions.columns if col != "Fold"] + ["Fold"]
            predictions = predictions[cols]
            # Sort by fold
            predictions = predictions.sort_values("Fold")

        # Get the best models
        for model_name in self.models.keys():
            best_model = [model for model in best_models_by_fold if model["model_name"] == model_name]
            best_model = sorted(best_model, key=lambda x: x["model"]["score"], reverse=True)[0]
            self.best_models[model_name] = best_model["model"]["model"]

        return self.scores, predictions, self.best_models


    def _run(self, model, train_data, train_target, test_data, test_target):
        """Test the model and return scores."""
        # Import the necessary libraries
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        from sklearn.metrics import mean_squared_error
        import numpy as np
        import pandas as pd

        # Initialize the best model
        best_model = None
        best_score = 0

        # Check if the model is regression
        is_model_regression = MLOps.is_regression(model)
        if is_model_regression:
            train_target = MLOps.label_encode(train_target)
            test_target = MLOps.label_encode(test_target)
            train_target = pd.Series(train_target)
            test_target = pd.Series(test_target)

        # Fit the model
        model.fit(train_data, train_target)

        # Get predictions
        predictions, _ = MLOps.get_predictions(model, test_data, test_target)

        # Get the scores
        scores = MLOps.get_scores(model=model, target_data=test_target, predictions=predictions)

        # Update the best model
        curr_score = scores["accuracy"] if not is_model_regression else scores["r2"]
        if curr_score > best_score:
            best_model = model
            best_score = curr_score
        best_model = {"model": best_model, "score": best_score}
        
        predictions = pd.DataFrame(predictions, columns=["predicted_target"])
        return scores, predictions, best_model

