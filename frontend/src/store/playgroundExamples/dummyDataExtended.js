export const dummyData = {
    "nodes":
        [
            {
                "id": "node-prediction-logistic-regression-1c59d991-eb7e-4d16-8c3c-5474c7f27510",
                "type": "node-prediction-logistic-regression",
                "position": {
                    "x": 455.617152317475,
                    "y": -138.25775274421804
                },
                    "name": "Logistic Regression Node",
                    "name_count": 1,
                    "parameters": {
                        "features": [
                            "sepal.length",
                            "sepal.width",
                            "petal.length",
                            "petal.width"
                        ],
                        "C": 3,
                        "solver": "newton-cg",
                        "penalty": "l2",
                        "target": "variety"
                    },
                    "outputs": {
                        "model": {
                            "name": "Model",
                            "type": "output-model",
                            "display_value": "",
                            "value": {}
                        }
                    },
                    "updated": true,
                    "success": true,
                    "errors": []
            },
            {
                "id": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
                "type": "node-evaluation-test-and-score",
                "position": {
                    "x": 880.9239460753311,
                    "y": 110.49753142630183
                },
                    "name": "Test and Score Node",
                    "parameters": {
                        "evaluation_type": "random_sampling",
                        "n_splits": 5,
                        "stratified": true,
                        "train_size": 0.66,
                        "repeat": 10
                    },
                    "outputs": {
                        "evaluation_results": {
                            "name": "Evaluation Results",
                            "type": "output-evaluation-results",
                            "display_value": {
                                "Logistic Regression Node": {
                                    "model": "Logistic Regression Node",
                                    "accuracy": 0.9470588235294117,
                                    "precision": 0.9510972850678734,
                                    "recall": 0.9470588235294117,
                                    "f1": 0.9468386919985387,
                                    "auc": null,
                                    "roc_curve": null,
                                    "nmse": null,
                                    "evaluation_type": "random_sampling"
                                },
                                "Logistic Regression Node (2)": {
                                    "model": "Logistic Regression Node (2)",
                                    "accuracy": 0.9647058823529411,
                                    "precision": 0.9695566688213747,
                                    "recall": 0.9647058823529411,
                                    "f1": 0.9643855514745944,
                                    "auc": null,
                                    "roc_curve": null,
                                    "nmse": null,
                                    "evaluation_type": "random_sampling"
                                }
                            },
                            "value": {}
                        },
                        "predictions": {
                            "name": "Predictions",
                            "type": "output-evaluation-predictions",
                            "display_value": {
                                "data": [
                                    {
                                        "sepal.length": 6.8,
                                        "sepal.width": 3,
                                        "petal.length": 5.5,
                                        "petal.width": 2.1,
                                        "target": "Virginica",
                                        "Logistic Regression Node": "Virginica",
                                        "Logistic Regression Node (2)": "Virginica"
                                    },
                                    {
                                        "sepal.length": 5.2,
                                        "sepal.width": 3.5,
                                        "petal.length": 1.5,
                                        "petal.width": 0.2,
                                        "target": "Setosa",
                                        "Logistic Regression Node": "Setosa",
                                        "Logistic Regression Node (2)": "Setosa"
                                    },
                                    {
                                        "sepal.length": 6.3,
                                        "sepal.width": 3.3,
                                        "petal.length": 4.7,
                                        "petal.width": 1.6,
                                        "target": "Versicolor",
                                        "Logistic Regression Node": "Versicolor",
                                        "Logistic Regression Node (2)": "Virginica"
                                    },
                                    {
                                        "sepal.length": 4.4,
                                        "sepal.width": 3,
                                        "petal.length": 1.3,
                                        "petal.width": 0.2,
                                        "target": "Setosa",
                                        "Logistic Regression Node": "Setosa",
                                        "Logistic Regression Node (2)": "Setosa"
                                    },
                                    {
                                        "sepal.length": 4.9,
                                        "sepal.width": 3.6,
                                        "petal.length": 1.4,
                                        "petal.width": 0.1,
                                        "target": "Setosa",
                                        "Logistic Regression Node": "Setosa",
                                        "Logistic Regression Node (2)": "Setosa"
                                    }
                                ],
                                "metadata": {
                                    "name": "Data",
                                    "columns": [
                                        "sepal.length",
                                        "sepal.width",
                                        "petal.length",
                                        "petal.width",
                                        "target",
                                        "Logistic Regression Node",
                                        "Logistic Regression Node (2)"
                                    ],
                                    "n_rows": 100,
                                    "n_columns": 7
                                }
                            },
                            "value": {}
                        }
                    },
                    "updated": true,
                    "success": true,
                    "errors": []
            },
            {
                "id": "node-visualization-bar-plot-ad5355a3-92b6-499d-a1de-4549de49c3ba",
                "type": "node-visualization-bar-plot",
                "position": {
                    "x": 1425.7671406871234,
                    "y": 148.6777177466053
                },
                    "name": "Bar Plot Node",
                    "parameters": {
                        "x": "Logistic Regression Node",
                        "y": "petal.width"
                    },
                    "outputs": {
                        "visualization": {
                            "name": "Visualization",
                            "type": "output-dict",
                            "display_value": {
                                "data": [
                                    {
                                        "name": "Setosa",
                                        "value": 8.3
                                    },
                                    {
                                        "name": "Versicolor",
                                        "value": 44.6
                                    },
                                    {
                                        "name": "Virginica",
                                        "value": 61.4
                                    }
                                ],
                                "metadata": {
                                    "x": "Logistic Regression Node",
                                    "y": "petal.width"
                                }
                            },
                            "value": {}
                        }
                    },
                    "updated": true,
                    "success": true,
                    "errors": []
            },
            {
                "id": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d",
                "type": "node-data-train-test-split",
                "position": {
                    "x": -2.7109284055042338,
                    "y": 148.96672243391941
                },
                    "name": "Train Test Split Node",
                    "parameters": {
                        "test_size": 0.33
                    },
                    "outputs": {
                        "train": {
                            "name": "Train",
                            "type": "output-file-data",
                            "display_value": {
                                "data": [
                                    {
                                        "sepal.length": 6.8,
                                        "sepal.width": 3,
                                        "petal.length": 5.5,
                                        "petal.width": 2.1,
                                        "variety": "Virginica"
                                    },
                                    {
                                        "sepal.length": 5.2,
                                        "sepal.width": 3.5,
                                        "petal.length": 1.5,
                                        "petal.width": 0.2,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 6.3,
                                        "sepal.width": 3.3,
                                        "petal.length": 4.7,
                                        "petal.width": 1.6,
                                        "variety": "Versicolor"
                                    },
                                    {
                                        "sepal.length": 4.4,
                                        "sepal.width": 3,
                                        "petal.length": 1.3,
                                        "petal.width": 0.2,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 4.9,
                                        "sepal.width": 3.6,
                                        "petal.length": 1.4,
                                        "petal.width": 0.1,
                                        "variety": "Setosa"
                                    }
                                ],
                                "metadata": {
                                    "name": "Train",
                                    "columns": [
                                        "sepal.length",
                                        "sepal.width",
                                        "petal.length",
                                        "petal.width",
                                        "variety"
                                    ],
                                    "n_rows": 100,
                                    "n_columns": 5
                                }
                            },
                            "value": {}
                        },
                        "test": {
                            "name": "Test",
                            "type": "output-file-data",
                            "display_value": {
                                "data": [
                                    {
                                        "sepal.length": 5,
                                        "sepal.width": 3.4,
                                        "petal.length": 1.6,
                                        "petal.width": 0.4,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 6.7,
                                        "sepal.width": 3.1,
                                        "petal.length": 4.7,
                                        "petal.width": 1.5,
                                        "variety": "Versicolor"
                                    },
                                    {
                                        "sepal.length": 5.6,
                                        "sepal.width": 3,
                                        "petal.length": 4.1,
                                        "petal.width": 1.3,
                                        "variety": "Versicolor"
                                    },
                                    {
                                        "sepal.length": 5.2,
                                        "sepal.width": 4.1,
                                        "petal.length": 1.5,
                                        "petal.width": 0.1,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 6,
                                        "sepal.width": 3.4,
                                        "petal.length": 4.5,
                                        "petal.width": 1.6,
                                        "variety": "Versicolor"
                                    }
                                ],
                                "metadata": {
                                    "name": "Test",
                                    "columns": [
                                        "sepal.length",
                                        "sepal.width",
                                        "petal.length",
                                        "petal.width",
                                        "variety"
                                    ],
                                    "n_rows": 50,
                                    "n_columns": 5
                                }
                            },
                            "value": {}
                        }
                    },
                    "updated": true,
                    "success": true,
                    "errors": []
            },
            {
                "id": "node-data-file-c4935056-706f-4278-8733-3f6913b727af",
                "type": "node-data-file",
                "position": {
                    "x": -537.986449753431,
                    "y": 149.02980686374198
                },
                    "name": "File Node",
                    "parameters": {
                        "file_name": "iris"
                    },
                    "outputs": {
                        "data": {
                            "name": "Data",
                            "type": "output-file-data",
                            "display_value": {
                                "data": [
                                    {
                                        "sepal.length": 5.1,
                                        "sepal.width": 3.5,
                                        "petal.length": 1.4,
                                        "petal.width": 0.2,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 4.9,
                                        "sepal.width": 3,
                                        "petal.length": 1.4,
                                        "petal.width": 0.2,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 4.7,
                                        "sepal.width": 3.2,
                                        "petal.length": 1.3,
                                        "petal.width": 0.2,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 4.6,
                                        "sepal.width": 3.1,
                                        "petal.length": 1.5,
                                        "petal.width": 0.2,
                                        "variety": "Setosa"
                                    },
                                    {
                                        "sepal.length": 5,
                                        "sepal.width": 3.6,
                                        "petal.length": 1.4,
                                        "petal.width": 0.2,
                                        "variety": "Setosa"
                                    }
                                ],
                                "metadata": {
                                    "name": "iris",
                                    "columns": [
                                        "sepal.length",
                                        "sepal.width",
                                        "petal.length",
                                        "petal.width",
                                        "variety"
                                    ],
                                    "n_rows": 150,
                                    "n_columns": 5
                                }
                            },
                            "value": {}
                        }
                    },
                    "updated": true,
                    "success": true,
                    "errors": []
            },
            {
                "id": "node-prediction-logistic-regression-2e8baf67-0dac-4b2f-adad-b6775a12457c",
                "type": "node-prediction-logistic-regression",
                "position": {
                    "x": 453.3926784228547,
                    "y": -453.91807674798133
                },
                    "name": "Logistic Regression Node",
                    "parameters": {
                        "features": [
                            "sepal.length",
                            "sepal.width",
                            "petal.length",
                            "petal.width"
                        ],
                        "C": 1,
                        "solver": "liblinear",
                        "penalty": "l2",
                        "target": "variety"
                    },
                    "outputs": {
                        "model": {
                            "name": "Model",
                            "type": "output-model",
                            "display_value": "",
                            "value": {}
                        }
                    },
                    "updated": true,
                    "success": true,
                    "errors": []
                }
        ],
    "edges":
        [
            {
                "id": "node-prediction-logistic-regression-1c59d991-eb7e-4d16-8c3c-5474c7f27510-node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f-e988b610-5f94-4ff4-89b3-aef95fd57e8d",
                "source": "node-prediction-logistic-regression-1c59d991-eb7e-4d16-8c3c-5474c7f27510",
                "target": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f-node-visualization-bar-plot-ad5355a3-92b6-499d-a1de-4549de49c3ba-e32d9a91-4be4-4175-8b52-4d396e611dee",
                "source": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
                "target": "node-visualization-bar-plot-ad5355a3-92b6-499d-a1de-4549de49c3ba",
                "sourceHandle": "predictions",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d-node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f-78ca76a4-edf8-4ffe-9db5-5554f2ea74a8",
                "source": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d",
                "target": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d-node-prediction-logistic-regression-1c59d991-eb7e-4d16-8c3c-5474c7f27510-f296ca51-bca5-4592-8bf2-9637aa1a166a",
                "source": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d",
                "target": "node-prediction-logistic-regression-1c59d991-eb7e-4d16-8c3c-5474c7f27510",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-file-c4935056-706f-4278-8733-3f6913b727af-node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d-4554917e-55ec-41f2-9582-93fd0cce97f4",
                "source": "node-data-file-c4935056-706f-4278-8733-3f6913b727af",
                "target": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d-node-prediction-logistic-regression-2e8baf67-0dac-4b2f-adad-b6775a12457c-98f5e16e-373c-47dc-8836-acba3769a840",
                "source": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d",
                "target": "node-prediction-logistic-regression-2e8baf67-0dac-4b2f-adad-b6775a12457c",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-prediction-logistic-regression-2e8baf67-0dac-4b2f-adad-b6775a12457c-node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f-7905590c-87ec-4b7f-83c5-fa9cd1aaa788",
                "source": "node-prediction-logistic-regression-2e8baf67-0dac-4b2f-adad-b6775a12457c",
                "target": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
                "sourceHandle": "model",
                "targetHandle": "model"
            }
        ],
    "viewport": {
        "x": 330.6712880593935,
        "y": 250.05085830101234,
        "zoom": 0.5
    }
};