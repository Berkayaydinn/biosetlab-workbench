from typing import Dict, Literal, Union
from app.services.file_ops import FileOps
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.dict_output import DictOutput
from app.models.graph.output.model_output import ModelOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data



class AdaBoostNode(BaseNode):
    name: str = "AdaBoost"
    type: Literal["node-prediction-adaboost"] = "node-prediction-adaboost"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, Union[ModelOutput, DictOutput]] = {
        "model": ModelOutput(name="Model"),
        "learner": DictOutput(name="Learner"),
    }

    def build(self):
        print(f"Building {self.name} node")

        # Parameters
        n_estimators = self.parameters.get("n_estimators")
        Check(n_estimators, "n_estimators").is_provided().is_(int).in_between(1, 10000, left_equal=True, right_equal=True)

        learning_rate = float(self.parameters.get("learning_rate", 1.0))
        Check(learning_rate, "learning_rate").is_provided().is_(float).in_between(0.00001, 1.0, left_equal=True, right_equal=True)

        loss = self.parameters.get("loss")
        Check(loss, "loss").is_provided().in_(["Linear", "Square", "Exponential"])

        fixed_seed = self.parameters.get("fixed_seed")
        Check(fixed_seed, "fixed_seed").is_provided().is_(bool)

        random_state = self.parameters.get("random_state") if fixed_seed else None
        if fixed_seed:
            Check(random_state, "random_state").is_(int).in_between(0, 100000)


        # Get data
        data_input_json = self.inputs["data"]._value

        # Only raw model mode
        if not data_input_json or data_input_json == "":
            raw_model, _ = MLOps.adaboost(
                None,
                None,
                n_estimators=n_estimators,
                learning_rate=learning_rate,
                loss=loss.lower(),
                random_state=random_state
            )
            self.outputs["model"].build(
                raw_model=raw_model,
                model=None,
                full=True
            )
            return

        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]
        target = data_dict["target"]

        # Get feature and target data
        X = data[features]
        y = data[target]

        # Train model using MLOps
        raw_model, model = MLOps.adaboost(
            X,
            y,
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            loss=loss.lower(),
            random_state=random_state
        )

        # Build outputs
        learner_output = {
            "name": "AdaBoost",
            "parameters": {
                "n_estimators": n_estimators,
                "learning_rate": learning_rate,
                "loss": loss,
                "random_state": random_state
            }
        }

        self.outputs["learner"].build(
            value=learner_output,
            full=True
        )

        self.outputs["model"].build(
            model=model,
            raw_model=raw_model,
            full=True
        )

        self.outputs["learner"].display_value = learner_output
        self.outputs["model"].display_value = {"model": "AdaBoost model trained."}

        print("AdaBoost model built successfully")
