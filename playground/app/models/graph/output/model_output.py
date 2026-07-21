from typing import Literal, Dict
from app.models.graph.output.output import BaseOutput
from app.models.graph.input.input import InputOutputType
from pydantic import BaseModel


class ModelOutput(BaseOutput):
    """
        Model for a model output field in a graph node.
    Returns value:
        {
            "model": ML model,
            "features": List of features,
            "target": Target column
        }

        This type of output is selected
    because it will be easier to add new metrics
    to the output in the future.

    It returns anything to the user(display_value) because
    displaying a model in the frontend is not possible.
    """
    type: Literal["output-model"] = "output-model"
    value: Dict = {}
    _value_type = InputOutputType.MODEL.value

    def build(self, raw_model, model, **kwargs):
        """
        Build the model output.
        """
        print(f"Building {self.name} output")
        print(f"Model: {model}")

        # Get features and target
        features = kwargs.get("features", [])
        target = kwargs.get("target", "")

        self._value = {
            "raw_model": raw_model, # The model not fitted, only created
            "model": model,
            "features": features,
            "target": target
        }
        # It returns anything to the user(display_value) because
        # displaying a model in the frontend is not possible. 
        return
