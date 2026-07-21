from typing import Dict, Literal
from app.models.graph.input.evaluation_input import EvaluationResultsInput
from app.models.graph.output.dict_output import DictOutput
from app.models.graph.node.node import BaseNode
from app.utils.data_validator import Check


"""
Confusion Matrix
"""


class ConfusionMatrixNode(BaseNode):
    """
    Node that takes model and test data as input and returns the confusion matrix.

    The confusion matrix is a table that is often used to describe the performance of a classification model
    on a set of test data for which the true values are known.

    The confusion matrix includes true positive, false positive, true negative, and false negative values.
    """
    name: str = "Confusion Matrix"
    type: Literal["node-evaluation-confusion-matrix"] = "node-evaluation-confusion-matrix"
    inputs: Dict[str, EvaluationResultsInput] = {
        "evaluation_results": EvaluationResultsInput(name="Evaluation Results")
    }
    outputs: Dict[str, DictOutput] = {
        "confusion_matrix": DictOutput(name="Confusion Matrix")
    }

    def build(self):
        """
        Build the confusion matrix node.
        """
        print(f"Building {self.name} node")

        # Get evaluation results
        evaluation_results = self.inputs["evaluation_results"]._value
        Check(evaluation_results, "Evaluation Results").is_provided().is_(dict)

        # Get confusion matrix for each model
        out_data = {}
        for model_name, model_results in evaluation_results.items():
            confusion_matrix = model_results["confusion_matrix"]
            out_data[model_name] = confusion_matrix

        # Build confusion matrix
        self.outputs["confusion_matrix"].build(out_data)
        print(f"Confusion matrix: {out_data}")
        print(f"Built {self.name} node")
        return

