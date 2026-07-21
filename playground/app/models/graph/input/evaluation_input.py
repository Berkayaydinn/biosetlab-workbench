from typing import Literal
from app.models.graph.input.dict_input import DictInput
from app.models.graph.input.input import InputOutputType

class EvaluationResultsInput(DictInput):
    """
    Model for a evaluation results input field in a graph node.
    """
    type: Literal["input-evaluation-results"] = "input-evaluation-results"
    _value_type = InputOutputType.EVALUATION.value