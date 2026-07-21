export const dummyData = {
    "nodes": [
        {
            "id": "node-prediction-logistic-regression-1c59d991-eb7e-4d16-8c3c-5474c7f27510",
            "name": "Logistic Regression Node",
            "name_count": 1,
            "type": "node-prediction-logistic-regression",
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
            "position": {
                "x": 439.617152317475,
                "y": -422.257752744218
            }
        },
        {
            "id": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
            "name": "Test and Score Node",
            "name_count": 0,
            "type": "node-evaluation-test-and-score",
            "parameters": {
                "evaluation_type": "cross_validation",
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
                        "Logistic Regression Node (1)": {
                            "model": "Logistic Regression Node (1)",
                            "features": [
                                "sepal.length",
                                "sepal.width",
                                "petal.length",
                                "petal.width"
                            ],
                            "target": "variety",
                            "scores": {
                                "accuracy": 0.96,
                                "precision": 0.96,
                                "recall": 0.96,
                                "f1": 0.96,
                                "evaluation_type": "cross_validation"
                            },
                            "confusion_matrix": {
                                "data": [
                                    [
                                        36,
                                        0,
                                        0
                                    ],
                                    [
                                        0,
                                        30,
                                        2
                                    ],
                                    [
                                        0,
                                        0,
                                        32
                                    ]
                                ],
                                "labels": [
                                    "Setosa",
                                    "Versicolor",
                                    "Virginica"
                                ]
                            }
                        },
                        "Logistic Regression Node": {
                            "model": "Logistic Regression Node",
                            "features": [
                                "sepal.length",
                                "sepal.width",
                                "petal.length",
                                "petal.width"
                            ],
                            "target": "variety",
                            "scores": {
                                "accuracy": 0.9400000000000001,
                                "precision": 0.9526785714285714,
                                "recall": 0.9400000000000001,
                                "f1": 0.9393326673326673,
                                "evaluation_type": "cross_validation"
                            },
                            "confusion_matrix": {
                                "data": [
                                    [
                                        36,
                                        0,
                                        0
                                    ],
                                    [
                                        0,
                                        29,
                                        3
                                    ],
                                    [
                                        0,
                                        0,
                                        32
                                    ]
                                ],
                                "labels": [
                                    "Setosa",
                                    "Versicolor",
                                    "Virginica"
                                ]
                            }
                        },
                        "Linear Regression Node": {
                            "model": "Linear Regression Node",
                            "features": [
                                "sepal.length",
                                "sepal.width",
                                "petal.length",
                                "petal.width"
                            ],
                            "target": "variety",
                            "scores": {
                                "nmse": 0.050095435195065076,
                                "r2": 0.9257604262398876,
                                "evaluation_type": "cross_validation"
                            },
                            "confusion_matrix": {
                                "data": [],
                                "labels": []
                            }
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
                                "sepal.length": 5.1,
                                "sepal.width": 3.3,
                                "petal.length": 1.7,
                                "petal.width": 0.5,
                                "target": "Setosa",
                                "Logistic Regression Node (1)": "Setosa",
                                "Logistic Regression Node": "Setosa",
                                "Linear Regression Node": 0.1883833061
                            },
                            {
                                "sepal.length": 5.5,
                                "sepal.width": 2.4,
                                "petal.length": 3.7,
                                "petal.width": 1,
                                "target": "Versicolor",
                                "Logistic Regression Node (1)": "Versicolor",
                                "Logistic Regression Node": "Versicolor",
                                "Linear Regression Node": 0.9398854296
                            },
                            {
                                "sepal.length": 7.4,
                                "sepal.width": 2.8,
                                "petal.length": 6.1,
                                "petal.width": 1.9,
                                "target": "Virginica",
                                "Logistic Regression Node (1)": "Virginica",
                                "Logistic Regression Node": "Virginica",
                                "Linear Regression Node": 1.8115321
                            },
                            {
                                "sepal.length": 6,
                                "sepal.width": 2.2,
                                "petal.length": 4,
                                "petal.width": 1,
                                "target": "Versicolor",
                                "Logistic Regression Node (1)": "Versicolor",
                                "Logistic Regression Node": "Versicolor",
                                "Linear Regression Node": 0.9711580417
                            },
                            {
                                "sepal.length": 5,
                                "sepal.width": 3.3,
                                "petal.length": 1.4,
                                "petal.width": 0.2,
                                "target": "Setosa",
                                "Logistic Regression Node (1)": "Setosa",
                                "Logistic Regression Node": "Setosa",
                                "Linear Regression Node": -0.0470373901
                            }
                        ],
                        "metadata": {
                            "name": "Predictions",
                            "columns": [
                                "sepal.length",
                                "sepal.width",
                                "petal.length",
                                "petal.width",
                                "target",
                                "Logistic Regression Node (1)",
                                "Logistic Regression Node",
                                "Linear Regression Node"
                            ],
                            "n_rows": 100,
                            "n_columns": 8
                        }
                    },
                    "value": {}
                }
            },
            "position": {
                "x": 880.9239460753311,
                "y": 110.49753142630183
            }
        },
        {
            "id": "node-visualization-bar-plot-ad5355a3-92b6-499d-a1de-4549de49c3ba",
            "name": "Bar Plot Node",
            "name_count": 0,
            "type": "node-visualization-bar-plot",
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
                                "value": 8.5
                            },
                            {
                                "name": "Versicolor",
                                "value": 46.4
                            },
                            {
                                "name": "Virginica",
                                "value": 58.5
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
            "position": {
                "x": 1411.7671406871234,
                "y": 276.6777177466053
            }
        },
        {
            "id": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d",
            "name": "Train Test Split Node",
            "name_count": 0,
            "type": "node-data-train-test-split",
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
                                "sepal.length": 5.1,
                                "sepal.width": 3.3,
                                "petal.length": 1.7,
                                "petal.width": 0.5,
                                "variety": "Setosa"
                            },
                            {
                                "sepal.length": 5.5,
                                "sepal.width": 2.4,
                                "petal.length": 3.7,
                                "petal.width": 1,
                                "variety": "Versicolor"
                            },
                            {
                                "sepal.length": 7.4,
                                "sepal.width": 2.8,
                                "petal.length": 6.1,
                                "petal.width": 1.9,
                                "variety": "Virginica"
                            },
                            {
                                "sepal.length": 6,
                                "sepal.width": 2.2,
                                "petal.length": 4,
                                "petal.width": 1,
                                "variety": "Versicolor"
                            },
                            {
                                "sepal.length": 5,
                                "sepal.width": 3.3,
                                "petal.length": 1.4,
                                "petal.width": 0.2,
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
                                "sepal.width": 3.5,
                                "petal.length": 1.6,
                                "petal.width": 0.6,
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
                                "sepal.length": 6.7,
                                "sepal.width": 3.1,
                                "petal.length": 4.4,
                                "petal.width": 1.4,
                                "variety": "Versicolor"
                            },
                            {
                                "sepal.length": 5.6,
                                "sepal.width": 2.5,
                                "petal.length": 3.9,
                                "petal.width": 1.1,
                                "variety": "Versicolor"
                            },
                            {
                                "sepal.length": 5.8,
                                "sepal.width": 2.8,
                                "petal.length": 5.1,
                                "petal.width": 2.4,
                                "variety": "Virginica"
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
            "position": {
                "x": -2.7109284055042338,
                "y": 148.96672243391941
            }
        },
        {
            "id": "node-data-file-c4935056-706f-4278-8733-3f6913b727af",
            "name": "File Node",
            "name_count": 0,
            "type": "node-data-file",
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
            "position": {
                "x": -537.986449753431,
                "y": 149.02980686374198
            }
        },
        {
            "id": "node-prediction-logistic-regression-2e8baf67-0dac-4b2f-adad-b6775a12457c",
            "name": "Logistic Regression Node",
            "name_count": 0,
            "type": "node-prediction-logistic-regression",
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
            "position": {
                "x": 435.3926784228547,
                "y": -675.9180767479813
            }
        },
        {
            "id": "node-prediction-linear-regression-9d44918c-d930-469d-836d-00b6b65d0206",
            "name": "Linear Regression Node",
            "name_count": 0,
            "type": "node-prediction-linear-regression",
            "parameters": {
                "features": [
                    "sepal.length",
                    "sepal.width",
                    "petal.length",
                    "petal.width"
                ],
                "fitIntercept": true,
                "regulazition": "l1",
                "C": 1,
                "elasticnetMixing": 0.5,
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
            "position": {
                "x": 438.8743676358159,
                "y": -172.23579656324966
            }
        },
        {
            "id": "node-evaluation-confusion-matrix-1f3bb60f-382b-437a-a19b-1f7ef5f3b87c",
            "name": "Confusion Matrix Node",
            "name_count": 0,
            "type": "node-evaluation-confusion-matrix",
            "parameters": {},
            "outputs": {
                "confusion_matrix": {
                    "name": "Confusion Matrix",
                    "type": "output-dict",
                    "display_value": {
                        "Logistic Regression Node (1)": {
                            "data": [
                                [
                                    36,
                                    0,
                                    0
                                ],
                                [
                                    0,
                                    30,
                                    2
                                ],
                                [
                                    0,
                                    0,
                                    32
                                ]
                            ],
                            "labels": [
                                "Setosa",
                                "Versicolor",
                                "Virginica"
                            ]
                        },
                        "Logistic Regression Node": {
                            "data": [
                                [
                                    36,
                                    0,
                                    0
                                ],
                                [
                                    0,
                                    29,
                                    3
                                ],
                                [
                                    0,
                                    0,
                                    32
                                ]
                            ],
                            "labels": [
                                "Setosa",
                                "Versicolor",
                                "Virginica"
                            ]
                        },
                        "Linear Regression Node": {
                            "data": [],
                            "labels": []
                        }
                    },
                    "value": {}
                }
            },
            "position": {
                "x": 1411.3212037572525,
                "y": -43.121582587938946
            }
        }
    ],
    "edges": [
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
        },
        {
            "id": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d-node-prediction-linear-regression-9d44918c-d930-469d-836d-00b6b65d0206-e54ed210-e75c-4d05-bc93-4d9db12238c4",
            "source": "node-data-train-test-split-f347231a-1103-4f27-a551-8d1e7b08781d",
            "target": "node-prediction-linear-regression-9d44918c-d930-469d-836d-00b6b65d0206",
            "sourceHandle": "train",
            "targetHandle": "data"
        },
        {
            "id": "node-prediction-linear-regression-9d44918c-d930-469d-836d-00b6b65d0206-node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f-e982b40d-6b80-40dd-a937-e07580120a5f",
            "source": "node-prediction-linear-regression-9d44918c-d930-469d-836d-00b6b65d0206",
            "target": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
            "sourceHandle": "model",
            "targetHandle": "model"
        },
        {
            "id": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f-node-evaluation-confusion-matrix-1f3bb60f-382b-437a-a19b-1f7ef5f3b87c-e3a8c7cb-040b-4530-8ec4-99730d7a71fb",
            "source": "node-evaluation-test-and-score-bcbb0fb3-c68c-4a51-88ce-619b90f90b4f",
            "target": "node-evaluation-confusion-matrix-1f3bb60f-382b-437a-a19b-1f7ef5f3b87c",
            "sourceHandle": "evaluation_results",
            "targetHandle": "evaluation_results"
        }
    ],
    "viewport": {
        "x": 351.6712880593934,
        "y": 386.05085830101234,
        "zoom": 0.5
    }
};