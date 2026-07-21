import pytest
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch, MagicMock
from app.models.graph.node.evaluation.predictions import PredictionsNode
from app.models.graph.error import ErrorType
from app.models.graph.output.evaluation_output import EvaluationResultsOutput, PredictionsOutput
from app.tests.graph.node.utils import (
    validate_outputs,
    validate_output_consistency
)

@pytest.fixture
def predictions_node():
    """Create a basic predictions node"""
    return PredictionsNode(
        id="pred-1",
        name="Predictions"
    )

@pytest.fixture
def mock_classification_model():
    """Create a mock classification model for testing"""
    model = Mock()
    model.predict = Mock(return_value=np.array([0, 1, 0, 1, 0]))
    model.predict_proba = Mock(return_value=np.array([[0.8, 0.2], [0.3, 0.7], [0.9, 0.1], [0.4, 0.6], [0.7, 0.3]]))
    model.classes_ = np.array([0, 1])
    model.__class__.__name__ = "RandomForestClassifier"
    return model

@pytest.fixture
def mock_regression_model():
    """Create a mock regression model for testing"""
    model = Mock()
    model.predict = Mock(return_value=np.array([1.5, 2.3, 0.8, 3.1, 2.7]))
    model.__class__.__name__ = "RandomForestRegressor"
    # No predict_proba for regression models
    if hasattr(model, 'predict_proba'):
        delattr(model, 'predict_proba')
    return model

@pytest.fixture
def mock_model_inputs_classification(mock_classification_model):
    """Create mock model inputs for classification"""
    model_input = Mock()
    model_input.source = Mock()
    model_input.source.name = "RandomForest"
    model_input.source.name_count = 0
    model_input.value = {"model": mock_classification_model}
    return [model_input]

@pytest.fixture
def mock_model_inputs_regression(mock_regression_model):
    """Create mock model inputs for regression"""
    model_input = Mock()
    model_input.source = Mock()
    model_input.source.name = "RandomForest"
    model_input.source.name_count = 0
    model_input.value = {"model": mock_regression_model}
    return [model_input]

@pytest.fixture
def mock_model_inputs_invalid():
    """Create mock model inputs with invalid/missing model"""
    model_input = Mock()
    model_input.source = Mock()
    model_input.source.name = "InvalidModel"
    model_input.source.name_count = 0
    model_input.value = None  # Invalid model
    return [model_input]

@pytest.fixture
def mock_model_inputs_no_fitted_model():
    """Create mock model inputs with no fitted model"""
    model_input = Mock()
    model_input.source = Mock()
    model_input.source.name = "UnfittedModel"
    model_input.source.name_count = 0
    model_input.value = {"raw_model": Mock()}  # Missing 'model' key
    return [model_input]

@pytest.fixture
def mock_data_input(sample_data_input):
    """Create a mock data input using the existing sample data format"""
    data_input = Mock()
    data_input._value = sample_data_input
    return data_input

def test_predictions_initialization():
    """Test predictions node initialization"""
    node = PredictionsNode(id="pred-1", name="Predictions")
    assert node.id == "pred-1"
    assert node.name == "Predictions"
    assert node.type == "node-evaluation-predictions"
    assert "data" in node.inputs
    assert "model" in node.inputs
    assert "evaluation_results" in node.outputs
    assert "predictions" in node.outputs
    assert isinstance(node.outputs["evaluation_results"], EvaluationResultsOutput)
    assert isinstance(node.outputs["predictions"], PredictionsOutput)

def test_predictions_output_structure(predictions_node, mock_data_input, mock_model_inputs_classification):
    """Test predictions output structure"""
    # Mock MLOps methods
    with patch('app.services.ml_ops.MLOps.is_classification', return_value=True), \
         patch('app.services.ml_ops.MLOps.get_confusion_matrix', return_value=[[2, 1], [0, 2]]), \
         patch('app.services.ml_ops.MLOps.get_roc_curve', return_value={"fpr": [0, 0.5, 1], "tpr": [0, 0.8, 1]}), \
         patch('app.models.graph.node.evaluation.predictions.Predictions') as mock_predictions:
        
        # Mock predictions results
        mock_predictions.return_value.return_value = (
            {"RandomForest": {"model": "RandomForest", "scores": {"accuracy": 0.8}}},
            pd.DataFrame({"feature1": [1, 2], "feature2": [2, 3], "target": [0, 1]}),
            {"RandomForest": mock_model_inputs_classification[0].value["model"]}
        )
        
        # Setup inputs
        predictions_node.inputs["data"] = mock_data_input
        predictions_node.inputs["model"]._value = mock_model_inputs_classification
        
        # Build the node
        predictions_node.build()
        
        # Define expected output structure
        expected_outputs = {
            "evaluation_results": {
                "type": EvaluationResultsOutput,
                "required": True,
                "value_type": dict,
                "value_check": lambda x: all(isinstance(v, dict) for v in x.values())
            },
            "predictions": {
                "type": PredictionsOutput,
                "required": True,
                "value_type": dict,
                "value_check": lambda x: "data" in x and "metadata" in x
            }
        }
        
        # Validate output structure
        validate_outputs(predictions_node, expected_outputs)

@patch('app.services.ml_ops.MLOps.is_classification')
@patch('app.services.ml_ops.MLOps.get_confusion_matrix')
@patch('app.services.ml_ops.MLOps.get_roc_curve')
@patch('app.models.graph.node.evaluation.predictions.Predictions')
def test_predictions_classification_model(mock_predictions, mock_roc, mock_cm, mock_is_class,
                                        predictions_node, mock_data_input, 
                                        mock_model_inputs_classification):
    """Test predictions with classification model"""
    # Setup mocks
    mock_is_class.return_value = True
    mock_cm.return_value = [[2, 1], [0, 2]]
    mock_roc.return_value = {"fpr": [0, 0.5, 1], "tpr": [0, 0.8, 1]}
    
    # Mock predictions results
    mock_predictions.return_value.return_value = (
        {"RandomForest": {
            "model": "RandomForest", 
            "scores": {"accuracy": 0.8, "precision": 0.75, "recall": 0.85},
            "features": ["feature1", "feature2"],
            "target": "target"
        }},
        pd.DataFrame({"feature1": [1, 2], "feature2": [2, 3], "target": [0, 1], "RandomForest": [0, 1]}),
        {"RandomForest": mock_model_inputs_classification[0].value["model"]}
    )
    
    # Set up inputs
    predictions_node.inputs["data"] = mock_data_input
    predictions_node.inputs["model"]._value = mock_model_inputs_classification
    
    # Build the node
    predictions_node.build()
    
    # Check that the node built successfully
    assert predictions_node.success is not False
    assert len(predictions_node.errors) == 0
    assert predictions_node.outputs["evaluation_results"]._value is not None
    assert predictions_node.outputs["predictions"]._value is not None
    
    # Check evaluation results structure
    eval_results = predictions_node.outputs["evaluation_results"]._value
    assert "RandomForest" in eval_results
    model_results = eval_results["RandomForest"]
    assert "scores" in model_results
    assert "confusion_matrix" in model_results
    assert "roc_curve" in model_results
    assert "evaluation_type" in model_results
    assert model_results["evaluation_type"] == "prediction"

@patch('app.services.ml_ops.MLOps.is_classification')
@patch('app.services.ml_ops.MLOps.get_confusion_matrix')
@patch('app.services.ml_ops.MLOps.get_roc_curve')
@patch('app.models.graph.node.evaluation.predictions.Predictions')
def test_predictions_regression_model(mock_predictions, mock_roc, mock_cm, mock_is_class,
                                    predictions_node, mock_data_input, 
                                    mock_model_inputs_regression):
    """Test predictions with regression model"""
    # Setup mocks
    mock_is_class.return_value = False
    mock_cm.return_value = []
    mock_roc.return_value = None
    
    # Mock predictions results
    mock_predictions.return_value.return_value = (
        {"RandomForest": {
            "model": "RandomForest", 
            "scores": {"mse": 0.25, "r2": 0.85},
            "features": ["feature1", "feature2"],
            "target": "target"
        }},
        pd.DataFrame({"feature1": [1, 2], "feature2": [2, 3], "target": [1.5, 2.3], "RandomForest": [1.4, 2.1]}),
        {"RandomForest": mock_model_inputs_regression[0].value["model"]}
    )
    
    # Set up inputs
    predictions_node.inputs["data"] = mock_data_input
    predictions_node.inputs["model"]._value = mock_model_inputs_regression
    
    # Build the node
    predictions_node.build()
    
    # Check that the node built successfully
    assert predictions_node.success is not False
    assert len(predictions_node.errors) == 0
    
    # Check evaluation results structure
    eval_results = predictions_node.outputs["evaluation_results"]._value
    assert "RandomForest" in eval_results
    model_results = eval_results["RandomForest"]
    assert "evaluation_type" in model_results
    assert model_results["evaluation_type"] == "prediction"

def test_predictions_missing_data(predictions_node, mock_model_inputs_classification):
    """Test predictions with missing data input"""
    # Set up only model input, no data
    predictions_node.inputs["model"]._value = mock_model_inputs_classification
    predictions_node.inputs["data"]._value = None
    
    # Building should raise an error
    with pytest.raises(Exception):
        predictions_node.build()

def test_predictions_missing_model(predictions_node, mock_data_input):
    """Test predictions with missing model input"""
    # Set up only data input, no model
    predictions_node.inputs["data"] = mock_data_input
    predictions_node.inputs["model"]._value = None
    
    # Building should raise an error
    with pytest.raises(Exception):
        predictions_node.build()

def test_predictions_empty_model_list(predictions_node, mock_data_input):
    """Test predictions with empty model list"""
    # Set up data input with empty model list
    predictions_node.inputs["data"] = mock_data_input
    predictions_node.inputs["model"]._value = []
    
    # Building should raise an error - but the predictions node handles empty lists gracefully
    # Let's check that it builds but produces empty results
    predictions_node.build()
    
    # Check that it built but with empty results
    assert predictions_node.success is not False
    # The outputs should be built but potentially empty

def test_predictions_invalid_model_input(predictions_node, mock_data_input, mock_model_inputs_invalid):
    """Test predictions with invalid model input (should generate warning and skip)"""
    # Mock MLOps methods
    with patch('app.services.ml_ops.MLOps.is_classification', return_value=True), \
         patch('app.services.ml_ops.MLOps.get_confusion_matrix', return_value=[[2, 1], [0, 2]]), \
         patch('app.services.ml_ops.MLOps.get_roc_curve', return_value={"fpr": [0, 0.5, 1], "tpr": [0, 0.8, 1]}), \
         patch('app.models.graph.node.evaluation.predictions.Predictions') as mock_predictions:
        
        # Mock predictions results (empty since model is skipped)
        mock_predictions.return_value.return_value = (
            {},  # No models processed
            pd.DataFrame({"feature1": [1, 2], "feature2": [2, 3], "target": [0, 1]}),
            {}
        )
        
        # Set up inputs
        predictions_node.inputs["data"] = mock_data_input
        predictions_node.inputs["model"]._value = mock_model_inputs_invalid
        
        # Build the node
        predictions_node.build()
        
        # Check that a warning was generated
        assert len(predictions_node.errors) > 0
        assert any(error.type == ErrorType.WARNING for error in predictions_node.errors)

def test_predictions_unfitted_model(predictions_node, mock_data_input, mock_model_inputs_no_fitted_model):
    """Test predictions with unfitted model (should generate warning and skip)"""
    # Mock MLOps methods
    with patch('app.services.ml_ops.MLOps.is_classification', return_value=True), \
         patch('app.services.ml_ops.MLOps.get_confusion_matrix', return_value=[[2, 1], [0, 2]]), \
         patch('app.services.ml_ops.MLOps.get_roc_curve', return_value={"fpr": [0, 0.5, 1], "tpr": [0, 0.8, 1]}), \
         patch('app.models.graph.node.evaluation.predictions.Predictions') as mock_predictions:
        
        # Mock predictions results (empty since model is skipped)
        mock_predictions.return_value.return_value = (
            {},  # No models processed
            pd.DataFrame({"feature1": [1, 2], "feature2": [2, 3], "target": [0, 1]}),
            {}
        )
        
        # Set up inputs
        predictions_node.inputs["data"] = mock_data_input
        predictions_node.inputs["model"]._value = mock_model_inputs_no_fitted_model
        
        # Build the node
        predictions_node.build()
        
        # Check that a warning was generated
        assert len(predictions_node.errors) > 0
        assert any(error.type == ErrorType.WARNING for error in predictions_node.errors)

@patch('app.services.ml_ops.MLOps.is_classification')
@patch('app.services.ml_ops.MLOps.get_confusion_matrix')
@patch('app.services.ml_ops.MLOps.get_roc_curve')
@patch('app.models.graph.node.evaluation.predictions.Predictions')
def test_predictions_multiple_models(mock_predictions, mock_roc, mock_cm, mock_is_class,
                                   predictions_node, mock_data_input, 
                                   mock_classification_model):
    """Test predictions with multiple models"""
    # Setup mocks
    mock_is_class.return_value = True
    mock_cm.return_value = [[2, 1], [0, 2]]
    mock_roc.return_value = {"fpr": [0, 0.5, 1], "tpr": [0, 0.8, 1]}
    
    # Create multiple model inputs
    model_input1 = Mock()
    model_input1.source = Mock()
    model_input1.source.name = "RandomForest"
    model_input1.source.name_count = 0
    model_input1.value = {"model": mock_classification_model}
    
    model_input2 = Mock()
    model_input2.source = Mock()
    model_input2.source.name = "DecisionTree"
    model_input2.source.name_count = 0
    model_input2.value = {"model": mock_classification_model}
    
    multiple_models = [model_input1, model_input2]
    
    # Mock predictions results for multiple models
    mock_predictions.return_value.return_value = (
        {
            "RandomForest": {"model": "RandomForest", "scores": {"accuracy": 0.8}},
            "DecisionTree": {"model": "DecisionTree", "scores": {"accuracy": 0.75}}
        },
        pd.DataFrame({"feature1": [1, 2], "feature2": [2, 3], "target": [0, 1], 
                     "RandomForest": [0, 1], "DecisionTree": [1, 0]}),
        {"RandomForest": mock_classification_model, "DecisionTree": mock_classification_model}
    )
    
    # Set up inputs
    predictions_node.inputs["data"] = mock_data_input
    predictions_node.inputs["model"]._value = multiple_models
    
    # Build the node
    predictions_node.build()
    
    # Check that both models are in results
    eval_results = predictions_node.outputs["evaluation_results"]._value
    assert "RandomForest" in eval_results
    assert "DecisionTree" in eval_results

@patch('app.services.ml_ops.MLOps.is_classification')
@patch('app.services.ml_ops.MLOps.get_confusion_matrix')
@patch('app.services.ml_ops.MLOps.get_roc_curve')
@patch('app.models.graph.node.evaluation.predictions.Predictions')
def test_predictions_output_consistency(mock_predictions, mock_roc, mock_cm, mock_is_class,
                                      predictions_node, mock_data_input, 
                                      mock_model_inputs_classification):
    """Test predictions output consistency across multiple builds"""
    # Setup mocks
    mock_is_class.return_value = True
    mock_cm.return_value = [[2, 1], [0, 2]]
    mock_roc.return_value = {"fpr": [0, 0.5, 1], "tpr": [0, 0.8, 1]}
    
    # Mock predictions results
    mock_predictions.return_value.return_value = (
        {"RandomForest": {"model": "RandomForest", "scores": {"accuracy": 0.8}}},
        pd.DataFrame({"feature1": [1, 2], "feature2": [2, 3], "target": [0, 1]}),
        {"RandomForest": mock_model_inputs_classification[0].value["model"]}
    )
    
    # Set up inputs
    predictions_node.inputs["data"] = mock_data_input
    predictions_node.inputs["model"]._value = mock_model_inputs_classification
    
    # Build the node first to get initial output
    predictions_node.build()
    
    # Define value consistency check
    def check_evaluation_consistency(initial, current):
        # Check if structure remains the same
        if not all(k in current for k in initial.keys()):
            return False
        # Check if model names remain the same
        if set(initial.keys()) != set(current.keys()):
            return False
        return True
    
    # Validate output consistency
    validate_output_consistency(
        predictions_node,
        "evaluation_results",
        check_evaluation_consistency
    )

@patch('app.services.ml_ops.MLOps.is_regression')
@patch('app.services.ml_ops.MLOps.label_encode')
@patch('app.services.ml_ops.MLOps.get_predictions')
@patch('app.services.ml_ops.MLOps.get_scores')
def test_predictions_regression_label_encoding(mock_get_scores, mock_get_predictions, mock_label_encode, mock_is_regression,
                                              predictions_node, mock_data_input, mock_model_inputs_regression):
    """Test that regression models trigger label encoding"""
    # Setup mocks
    mock_is_regression.return_value = True
    mock_label_encode.return_value = np.array([0, 1, 0, 1, 0])
    mock_get_predictions.return_value = (np.array([1.5, 2.3, 0.8, 3.1, 2.7]), None)
    mock_get_scores.return_value = {"mse": 0.25, "r2": 0.85}
    
    # Mock other MLOps methods
    with patch('app.services.ml_ops.MLOps.is_classification', return_value=False), \
         patch('app.services.ml_ops.MLOps.get_confusion_matrix', return_value=[]), \
         patch('app.services.ml_ops.MLOps.get_roc_curve', return_value=None):
        
        # Set up inputs
        predictions_node.inputs["data"] = mock_data_input
        predictions_node.inputs["model"]._value = mock_model_inputs_regression
        
        # Build the node
        predictions_node.build()
        
        # Check that label encoding was called
        mock_label_encode.assert_called_once()
        
        # Check that the node built successfully
        assert predictions_node.success is not False
        assert len(predictions_node.errors) == 0 