from typing import Dict, Literal
from app.models.graph.input.evaluation_input import EvaluationResultsInput
from app.models.graph.output.dict_output import DictOutput
from app.models.graph.node.node import BaseNode
from app.utils.data_validator import Check


class ROCCurveNode(BaseNode):
    """
    Node that displays ROC curves for classification models.
    """
    name: str = "ROC Curve"
    type: Literal["node-evaluation-roc-curve"] = "node-evaluation-roc-curve"
    inputs: Dict[str, EvaluationResultsInput] = {
        "evaluation_results": EvaluationResultsInput(name="Evaluation Results")
    }
    outputs: Dict[str, DictOutput] = {
        "roc_curve": DictOutput(name="ROC Curve")
    }

    def build(self):
        """
        Build the ROC curve node.
        """
        print(f"Building {self.name} node")

        # Get evaluation results
        evaluation_results = self.inputs["evaluation_results"]._value
        Check(evaluation_results, "Evaluation Results").is_provided().is_(dict)

        # Get ROC curve data for each model
        out_data = {}
        for model_name, model_results in evaluation_results.items():
            roc_data = model_results.get("roc_curve")
            if roc_data:  # Only include models with ROC curve data
                out_data[model_name] = roc_data

        # Build ROC curve output
        self.outputs["roc_curve"].build(out_data)
        return 