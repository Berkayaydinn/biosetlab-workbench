from typing import Literal, Dict, Union
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.input.model_input import ModelInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.model_output import ModelOutput
from app.models.graph.output.dict_output import DictOutput
from app.utils.file import get_file_data


class StackingNode(BaseNode):
    name: str = "Stacking"
    type: Literal["node-prediction-stacking"] = "node-prediction-stacking"
    inputs: Dict[str, Union[ModelInput, DataInput]] = {
        "models": ModelInput(
            name="Base Models",
            multi=True,
        ),
        "data": DataInput(
            name="Training Data",
            
        ),
        "meta_model": ModelInput(
            name="Meta Learner (Optional)",
            
        
        )
    }
    outputs: Dict[str, Union[ModelOutput, DictOutput]] = {
        "model": ModelOutput(
            name="Stacked Model",
           
        ),
        "learner": DictOutput(
            name="Learner",
            
        )
    }

    def build(self):
        print(f"Building {self.name} node")

        models_input = self.inputs["models"]._value
        data_input_json = self.inputs["data"]._value
        meta_model_input = self.inputs["meta_model"]._value

        # Only raw model mode (empty input)
        if not models_input or not data_input_json:
            raw_model, _ = MLOps.stacking_classifier(models=[], X=None, y=None)
            self.outputs["model"].build(raw_model=raw_model, model=None, 
                                features=None, target=None)
            self.outputs["learner"].build(value={}, full=True)
            return

        # Get data
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Get feature and target data
        feature_data = data[features]
        target_data = data[target]

        # Build estimators list
        estimators = [
            (model.source.name.replace(" ", "_"), model.value["model"])
            for model in models_input
        ]

        # Optional meta model
        chosen_meta_model = None
        if meta_model_input != "__UNDEFINED__" and meta_model_input:
            chosen_meta_model = meta_model_input.get("model")

        # Apply stacking
        raw_model, model = MLOps.stacking_classifier(
            models=estimators,
            X=feature_data,
            y=target_data,
            meta_model=chosen_meta_model,
            cv=5
        )

        # Build outputs
        self.outputs["model"].build(
            raw_model=raw_model,
            model=model,
            features=features,
            target=target
        )

    

        self.success = True
        return
