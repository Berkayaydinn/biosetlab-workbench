import pandas as pd

from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression as SklearnLR
from sklearn.base import clone
from sklearn.model_selection import StratifiedKFold, cross_val_score

from app.models.graph.node.prediction.logistic_regression import LogisticRegression


def make_node(auto_preprocess):
    return LogisticRegression(
        id="lr-auto-test",
        name="Logistic Regression",
        parameters={
            "solver": "lbfgs",
            "penalty": "l2",
            "C": 1.0,
            "auto_preprocess": auto_preprocess,
        },
    )


def test_auto_preprocess_builds_pipeline():
    node = make_node(True)
    node.build()

    raw_model = node.outputs["model"]._value["raw_model"]

    assert isinstance(raw_model, Pipeline)
    assert "preprocessor" in raw_model.named_steps
    assert "classifier" in raw_model.named_steps

    df = pd.read_csv(
        "/app/app/anonymdatasets/breast_cancer.csv"
    )

    X = df.drop(columns=["class"])
    y = df["class"]

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42,
    )

    scores = cross_val_score(
        raw_model,
        X,
        y,
        cv=cv,
        scoring="accuracy",
        error_score="raise",
    )

    assert len(scores) == 5
    assert all(0 <= score <= 1 for score in scores)
    assert clone(raw_model) is not raw_model


def test_legacy_logistic_regression_unchanged():
    node = make_node(False)
    node.build()

    raw_model = node.outputs["model"]._value["raw_model"]

    assert isinstance(raw_model, SklearnLR)
    assert not isinstance(raw_model, Pipeline)
    assert raw_model.solver == "lbfgs"
    assert raw_model.C == 1.0
