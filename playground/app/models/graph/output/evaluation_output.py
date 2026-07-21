from typing import Dict, Literal
from pandas import DataFrame
from app.models.graph.output.data_output import DataOutput
from app.models.graph.output.dict_output import DictOutput
from app.models.graph.input.input import InputOutputType
import json

class EvaluationResultsOutput(DictOutput):
    """
    Model for a evaluation results output field in a graph node.
    """
    type: Literal["output-evaluation-results"] = "output-evaluation-results"
    _value_type = InputOutputType.EVALUATION.value

class PredictionsOutput(DataOutput):
    """
    Model for a evaluation predictions output field in a graph node.
    """
    type: Literal["output-evaluation-predictions"] = "output-evaluation-predictions"
    value: Dict = {}
