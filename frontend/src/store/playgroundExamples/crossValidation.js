export const exampleCrossValidation = {
    "name": "Cross Validation",
    "description": "A cross validation example which includes scoring various models trained on data.",
    "cover": "/assets/playgroundExamples/crossValidation.png",
    "graph": {
        "nodes": [
            {
                "id": "node-data-file-331cadff-76e0-4031-ae67-f31ef0c77d74",
                "name": "File",
                "name_count": 0,
                "type": "node-data-file",
                "parameters": {
                    "file_name": "iris.csv",
                    "file_label": "Iris Dataset",
                    "features": [],
                    "target": "",
                    "column_info": {}
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
                                "name": "Iris Dataset",
                                "columns": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width",
                                    "variety"
                                ],
                                "n_rows": 150,
                                "n_columns": 5,
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "column_info": {
                                    "sepal.length": {
                                        "name": "sepal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "sepal.width": {
                                        "name": "sepal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.length": {
                                        "name": "petal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.width": {
                                        "name": "petal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "variety": {
                                        "name": "variety",
                                        "type": "categorical",
                                        "class": "target"
                                    }
                                },
                                "skip_column_info": false
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 105.420511875732,
                    "y": 226.06378307721403
                }
            },
            {
                "id": "node-transform-impute-ef57cf47-b0b3-45f2-9011-f3778ce9b96b",
                "name": "Impute",
                "name_count": 0,
                "type": "node-transform-impute",
                "parameters": {
                    "method": "average_frequent",
                    "remove_missing_class": true
                },
                "outputs": {
                    "data": {
                        "name": "Imputed Data",
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
                                "name": "Imputed Data",
                                "columns": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width",
                                    "variety"
                                ],
                                "n_rows": 150,
                                "n_columns": 5,
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "column_info": {
                                    "sepal.length": {
                                        "name": "sepal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "sepal.width": {
                                        "name": "sepal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.length": {
                                        "name": "petal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.width": {
                                        "name": "petal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "variety": {
                                        "name": "variety",
                                        "type": "categorical",
                                        "class": "target"
                                    }
                                },
                                "skip_column_info": false
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 324.47415671762593,
                    "y": 225.158730194916
                }
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "name": "Train Test Split",
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
                                    "sepal.length": 6,
                                    "sepal.width": 3.4,
                                    "petal.length": 4.5,
                                    "petal.width": 1.6,
                                    "variety": "Versicolor"
                                },
                                {
                                    "sepal.length": 4.8,
                                    "sepal.width": 3.1,
                                    "petal.length": 1.6,
                                    "petal.width": 0.2,
                                    "variety": "Setosa"
                                },
                                {
                                    "sepal.length": 4.4,
                                    "sepal.width": 3.2,
                                    "petal.length": 1.3,
                                    "petal.width": 0.2,
                                    "variety": "Setosa"
                                },
                                {
                                    "sepal.length": 5.1,
                                    "sepal.width": 3.5,
                                    "petal.length": 1.4,
                                    "petal.width": 0.2,
                                    "variety": "Setosa"
                                },
                                {
                                    "sepal.length": 6.2,
                                    "sepal.width": 3.4,
                                    "petal.length": 5.4,
                                    "petal.width": 2.3,
                                    "variety": "Virginica"
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
                                "n_columns": 5,
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "column_info": {
                                    "sepal.length": {
                                        "name": "sepal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "sepal.width": {
                                        "name": "sepal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.length": {
                                        "name": "petal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.width": {
                                        "name": "petal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "variety": {
                                        "name": "variety",
                                        "type": "categorical",
                                        "class": "target"
                                    }
                                },
                                "skip_column_info": false
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
                                    "sepal.length": 6.2,
                                    "sepal.width": 2.2,
                                    "petal.length": 4.5,
                                    "petal.width": 1.5,
                                    "variety": "Versicolor"
                                },
                                {
                                    "sepal.length": 4.6,
                                    "sepal.width": 3.2,
                                    "petal.length": 1.4,
                                    "petal.width": 0.2,
                                    "variety": "Setosa"
                                },
                                {
                                    "sepal.length": 5.1,
                                    "sepal.width": 3.4,
                                    "petal.length": 1.5,
                                    "petal.width": 0.2,
                                    "variety": "Setosa"
                                },
                                {
                                    "sepal.length": 7.4,
                                    "sepal.width": 2.8,
                                    "petal.length": 6.1,
                                    "petal.width": 1.9,
                                    "variety": "Virginica"
                                },
                                {
                                    "sepal.length": 5.8,
                                    "sepal.width": 2.6,
                                    "petal.length": 4,
                                    "petal.width": 1.2,
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
                                "n_columns": 5,
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "column_info": {
                                    "sepal.length": {
                                        "name": "sepal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "sepal.width": {
                                        "name": "sepal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.length": {
                                        "name": "petal.length",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "petal.width": {
                                        "name": "petal.width",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "variety": {
                                        "name": "variety",
                                        "type": "categorical",
                                        "class": "target"
                                    }
                                },
                                "skip_column_info": false
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 557.2144465906957,
                    "y": 226.79531035870744
                }
            },
            {
                "id": "node-prediction-logistic-regression-4da3c2eb-32bd-4f90-abea-4fd6f6da6f3d",
                "name": "Logistic Regression",
                "name_count": 0,
                "type": "node-prediction-logistic-regression",
                "parameters": {
                    "features": [],
                    "C": 1,
                    "solver": "newton-cg",
                    "penalty": "l2"
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
                    "x": 864.1394728018025,
                    "y": 82.3098878889241
                }
            },
            {
                "id": "node-prediction-linear-regression-c31859af-0e55-4749-bb4f-2508d694fe4d",
                "name": "Linear Regression",
                "name_count": 0,
                "type": "node-prediction-linear-regression",
                "parameters": {
                    "features": [],
                    "fitIntercept": true,
                    "regulazition": "none",
                    "C": 1,
                    "elasticnetMixing": 0.5
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
                    "x": 864.3084152636713,
                    "y": 216.4608312545366
                }
            },
            {
                "id": "node-prediction-svm-65db61ff-a9b9-45e7-a639-cf91141233ac",
                "name": "Support Vector Machine",
                "name_count": 0,
                "type": "node-prediction-svm",
                "parameters": {
                    "features": [],
                    "target": "",
                    "svmType": "SVM",
                    "kernel": "rbf",
                    "C": 1,
                    "epsilon": 0.1,
                    "v": 0.5,
                    "degree": 3,
                    "gamma": 0.1,
                    "coef0": 0,
                    "tol": 0.001,
                    "max_iter": 100
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
                    "x": 863.3914092264515,
                    "y": 357.5283247712952
                }
            },
            {
                "id": "node-prediction-gradient-boosting-dc5175e6-9f10-46db-a48f-2705fdf291d1",
                "name": "Gradient Boosting",
                "name_count": 0,
                "type": "node-prediction-gradient-boosting",
                "parameters": {
                    "features": [],
                    "target": "",
                    "task_type": "classification",
                    "n_estimators": 100,
                    "learning_rate": 0.1,
                    "replicable_training": true,
                    "max_depth": 3,
                    "min_samples_split": 2,
                    "subsample": 1
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
                    "x": 861.6241324777583,
                    "y": 515.87682387642
                }
            },
            {
                "id": "node-supervised-neural-network-f99522a4-3a6b-46be-9b9e-84328154bf70",
                "name": "Neural Network",
                "name_count": 0,
                "type": "node-supervised-neural-network",
                "parameters": {
                    "features": [],
                    "target": "",
                    "hiddenLayers": [
                        100
                    ],
                    "activation": "relu",
                    "solver": "adam",
                    "regularization": 650,
                    "maxIterations": 1000000,
                    "replicable": false
                },
                "outputs": {
                    "model": {
                        "name": "Trained Neural Network",
                        "type": "output-model",
                        "display_value": "",
                        "value": {}
                    },
                    "loss_curve": {
                        "name": "Loss Curve",
                        "type": "output-file-data",
                        "display_value": {
                            "data": [
                                {
                                    "index": 0,
                                    "loss": 33.4909098422
                                },
                                {
                                    "index": 1,
                                    "loss": 33.0811628282
                                },
                                {
                                    "index": 2,
                                    "loss": 32.674984477
                                },
                                {
                                    "index": 3,
                                    "loss": 32.2724159566
                                },
                                {
                                    "index": 4,
                                    "loss": 31.8735164008
                                },
                                {
                                    "index": 5,
                                    "loss": 31.4782765732
                                },
                                {
                                    "index": 6,
                                    "loss": 31.0867145642
                                },
                                {
                                    "index": 7,
                                    "loss": 30.698872009
                                },
                                {
                                    "index": 8,
                                    "loss": 30.3147729085
                                },
                                {
                                    "index": 9,
                                    "loss": 29.9344356724
                                },
                                {
                                    "index": 10,
                                    "loss": 29.5578799512
                                },
                                {
                                    "index": 11,
                                    "loss": 29.1851321352
                                },
                                {
                                    "index": 12,
                                    "loss": 28.8161907818
                                },
                                {
                                    "index": 13,
                                    "loss": 28.4510436952
                                },
                                {
                                    "index": 14,
                                    "loss": 28.089706826
                                },
                                {
                                    "index": 15,
                                    "loss": 27.7321746316
                                },
                                {
                                    "index": 16,
                                    "loss": 27.3784392609
                                },
                                {
                                    "index": 17,
                                    "loss": 27.0285087148
                                },
                                {
                                    "index": 18,
                                    "loss": 26.6823780085
                                },
                                {
                                    "index": 19,
                                    "loss": 26.3400567107
                                },
                                {
                                    "index": 20,
                                    "loss": 26.0015173714
                                },
                                {
                                    "index": 21,
                                    "loss": 25.66675395
                                },
                                {
                                    "index": 22,
                                    "loss": 25.3357475237
                                },
                                {
                                    "index": 23,
                                    "loss": 25.0084703572
                                },
                                {
                                    "index": 24,
                                    "loss": 24.6849279492
                                },
                                {
                                    "index": 25,
                                    "loss": 24.3651048185
                                },
                                {
                                    "index": 26,
                                    "loss": 24.0489797318
                                },
                                {
                                    "index": 27,
                                    "loss": 23.7365456287
                                },
                                {
                                    "index": 28,
                                    "loss": 23.4277779375
                                },
                                {
                                    "index": 29,
                                    "loss": 23.1226511788
                                },
                                {
                                    "index": 30,
                                    "loss": 22.8211502272
                                },
                                {
                                    "index": 31,
                                    "loss": 22.5232392417
                                },
                                {
                                    "index": 32,
                                    "loss": 22.2288667364
                                },
                                {
                                    "index": 33,
                                    "loss": 21.9380323257
                                },
                                {
                                    "index": 34,
                                    "loss": 21.6506944225
                                },
                                {
                                    "index": 35,
                                    "loss": 21.3668304544
                                },
                                {
                                    "index": 36,
                                    "loss": 21.0864000255
                                },
                                {
                                    "index": 37,
                                    "loss": 20.8093633743
                                },
                                {
                                    "index": 38,
                                    "loss": 20.5356937275
                                },
                                {
                                    "index": 39,
                                    "loss": 20.2653715396
                                },
                                {
                                    "index": 40,
                                    "loss": 19.9983656944
                                },
                                {
                                    "index": 41,
                                    "loss": 19.7346441091
                                },
                                {
                                    "index": 42,
                                    "loss": 19.4741749034
                                },
                                {
                                    "index": 43,
                                    "loss": 19.2169200171
                                },
                                {
                                    "index": 44,
                                    "loss": 18.9628413209
                                },
                                {
                                    "index": 45,
                                    "loss": 18.7119349007
                                },
                                {
                                    "index": 46,
                                    "loss": 18.4641482841
                                },
                                {
                                    "index": 47,
                                    "loss": 18.219438524
                                },
                                {
                                    "index": 48,
                                    "loss": 17.9777861669
                                },
                                {
                                    "index": 49,
                                    "loss": 17.7391541401
                                },
                                {
                                    "index": 50,
                                    "loss": 17.5035041772
                                },
                                {
                                    "index": 51,
                                    "loss": 17.2707994813
                                },
                                {
                                    "index": 52,
                                    "loss": 17.0410205763
                                },
                                {
                                    "index": 53,
                                    "loss": 16.8141439873
                                },
                                {
                                    "index": 54,
                                    "loss": 16.5901284212
                                },
                                {
                                    "index": 55,
                                    "loss": 16.3689461387
                                },
                                {
                                    "index": 56,
                                    "loss": 16.1505494402
                                },
                                {
                                    "index": 57,
                                    "loss": 15.9349030523
                                },
                                {
                                    "index": 58,
                                    "loss": 15.7219862626
                                },
                                {
                                    "index": 59,
                                    "loss": 15.5117782456
                                },
                                {
                                    "index": 60,
                                    "loss": 15.3042474293
                                },
                                {
                                    "index": 61,
                                    "loss": 15.0993620894
                                },
                                {
                                    "index": 62,
                                    "loss": 14.8971007585
                                },
                                {
                                    "index": 63,
                                    "loss": 14.6974364506
                                },
                                {
                                    "index": 64,
                                    "loss": 14.5003303181
                                },
                                {
                                    "index": 65,
                                    "loss": 14.3057453599
                                },
                                {
                                    "index": 66,
                                    "loss": 14.1136301845
                                },
                                {
                                    "index": 67,
                                    "loss": 13.9239599342
                                },
                                {
                                    "index": 68,
                                    "loss": 13.7367026758
                                },
                                {
                                    "index": 69,
                                    "loss": 13.5518395006
                                },
                                {
                                    "index": 70,
                                    "loss": 13.3693431863
                                },
                                {
                                    "index": 71,
                                    "loss": 13.1891997679
                                },
                                {
                                    "index": 72,
                                    "loss": 13.01138704
                                },
                                {
                                    "index": 73,
                                    "loss": 12.8358612741
                                },
                                {
                                    "index": 74,
                                    "loss": 12.662583122
                                },
                                {
                                    "index": 75,
                                    "loss": 12.4915342127
                                },
                                {
                                    "index": 76,
                                    "loss": 12.3226953795
                                },
                                {
                                    "index": 77,
                                    "loss": 12.1560464198
                                },
                                {
                                    "index": 78,
                                    "loss": 11.9915557339
                                },
                                {
                                    "index": 79,
                                    "loss": 11.8291849789
                                },
                                {
                                    "index": 80,
                                    "loss": 11.6689163939
                                },
                                {
                                    "index": 81,
                                    "loss": 11.5107312494
                                },
                                {
                                    "index": 82,
                                    "loss": 11.3546040895
                                },
                                {
                                    "index": 83,
                                    "loss": 11.2005163636
                                },
                                {
                                    "index": 84,
                                    "loss": 11.0484454041
                                },
                                {
                                    "index": 85,
                                    "loss": 10.8983561358
                                },
                                {
                                    "index": 86,
                                    "loss": 10.7502350213
                                },
                                {
                                    "index": 87,
                                    "loss": 10.6040616636
                                },
                                {
                                    "index": 88,
                                    "loss": 10.4598002446
                                },
                                {
                                    "index": 89,
                                    "loss": 10.3174281494
                                },
                                {
                                    "index": 90,
                                    "loss": 10.1769272935
                                },
                                {
                                    "index": 91,
                                    "loss": 10.038272399
                                },
                                {
                                    "index": 92,
                                    "loss": 9.9014339919
                                },
                                {
                                    "index": 93,
                                    "loss": 9.7663846314
                                },
                                {
                                    "index": 94,
                                    "loss": 9.6330982543
                                },
                                {
                                    "index": 95,
                                    "loss": 9.5015788792
                                },
                                {
                                    "index": 96,
                                    "loss": 9.3718023388
                                },
                                {
                                    "index": 97,
                                    "loss": 9.2437401192
                                },
                                {
                                    "index": 98,
                                    "loss": 9.117372771
                                },
                                {
                                    "index": 99,
                                    "loss": 8.9926815699
                                },
                                {
                                    "index": 100,
                                    "loss": 8.8696447225
                                },
                                {
                                    "index": 101,
                                    "loss": 8.74823217
                                },
                                {
                                    "index": 102,
                                    "loss": 8.6284223045
                                },
                                {
                                    "index": 103,
                                    "loss": 8.5102108311
                                },
                                {
                                    "index": 104,
                                    "loss": 8.3935809203
                                },
                                {
                                    "index": 105,
                                    "loss": 8.278509408
                                },
                                {
                                    "index": 106,
                                    "loss": 8.1649702715
                                },
                                {
                                    "index": 107,
                                    "loss": 8.0529471945
                                },
                                {
                                    "index": 108,
                                    "loss": 7.9424248963
                                },
                                {
                                    "index": 109,
                                    "loss": 7.8333900385
                                },
                                {
                                    "index": 110,
                                    "loss": 7.7258289677
                                },
                                {
                                    "index": 111,
                                    "loss": 7.6197191675
                                },
                                {
                                    "index": 112,
                                    "loss": 7.5150385556
                                },
                                {
                                    "index": 113,
                                    "loss": 7.4117721088
                                },
                                {
                                    "index": 114,
                                    "loss": 7.309901205
                                },
                                {
                                    "index": 115,
                                    "loss": 7.2094090079
                                },
                                {
                                    "index": 116,
                                    "loss": 7.1102820165
                                },
                                {
                                    "index": 117,
                                    "loss": 7.0125038314
                                },
                                {
                                    "index": 118,
                                    "loss": 6.9160511973
                                },
                                {
                                    "index": 119,
                                    "loss": 6.8209100633
                                },
                                {
                                    "index": 120,
                                    "loss": 6.7270664545
                                },
                                {
                                    "index": 121,
                                    "loss": 6.6345067587
                                },
                                {
                                    "index": 122,
                                    "loss": 6.5432111371
                                },
                                {
                                    "index": 123,
                                    "loss": 6.4531643021
                                },
                                {
                                    "index": 124,
                                    "loss": 6.3643486515
                                },
                                {
                                    "index": 125,
                                    "loss": 6.2767543805
                                },
                                {
                                    "index": 126,
                                    "loss": 6.1903635287
                                },
                                {
                                    "index": 127,
                                    "loss": 6.1051588913
                                },
                                {
                                    "index": 128,
                                    "loss": 6.0211254665
                                },
                                {
                                    "index": 129,
                                    "loss": 5.9382504913
                                },
                                {
                                    "index": 130,
                                    "loss": 5.8565188909
                                },
                                {
                                    "index": 131,
                                    "loss": 5.7759141258
                                },
                                {
                                    "index": 132,
                                    "loss": 5.696419741
                                },
                                {
                                    "index": 133,
                                    "loss": 5.6180224959
                                },
                                {
                                    "index": 134,
                                    "loss": 5.540710583
                                },
                                {
                                    "index": 135,
                                    "loss": 5.4644719939
                                },
                                {
                                    "index": 136,
                                    "loss": 5.389291582
                                },
                                {
                                    "index": 137,
                                    "loss": 5.3151536039
                                },
                                {
                                    "index": 138,
                                    "loss": 5.2420455312
                                },
                                {
                                    "index": 139,
                                    "loss": 5.1699565721
                                },
                                {
                                    "index": 140,
                                    "loss": 5.0988739233
                                },
                                {
                                    "index": 141,
                                    "loss": 5.028783942
                                },
                                {
                                    "index": 142,
                                    "loss": 4.9596750674
                                },
                                {
                                    "index": 143,
                                    "loss": 4.8915359054
                                },
                                {
                                    "index": 144,
                                    "loss": 4.8243534458
                                },
                                {
                                    "index": 145,
                                    "loss": 4.7581138109
                                },
                                {
                                    "index": 146,
                                    "loss": 4.6928047895
                                },
                                {
                                    "index": 147,
                                    "loss": 4.6284183113
                                },
                                {
                                    "index": 148,
                                    "loss": 4.5649426702
                                },
                                {
                                    "index": 149,
                                    "loss": 4.5023655152
                                },
                                {
                                    "index": 150,
                                    "loss": 4.440675613
                                },
                                {
                                    "index": 151,
                                    "loss": 4.3798627934
                                },
                                {
                                    "index": 152,
                                    "loss": 4.3199137014
                                },
                                {
                                    "index": 153,
                                    "loss": 4.2608182711
                                },
                                {
                                    "index": 154,
                                    "loss": 4.202565672
                                },
                                {
                                    "index": 155,
                                    "loss": 4.1451438294
                                },
                                {
                                    "index": 156,
                                    "loss": 4.0885415205
                                },
                                {
                                    "index": 157,
                                    "loss": 4.0327500548
                                },
                                {
                                    "index": 158,
                                    "loss": 3.9777569095
                                },
                                {
                                    "index": 159,
                                    "loss": 3.9235508998
                                },
                                {
                                    "index": 160,
                                    "loss": 3.8701237947
                                },
                                {
                                    "index": 161,
                                    "loss": 3.8174650509
                                },
                                {
                                    "index": 162,
                                    "loss": 3.765564179
                                },
                                {
                                    "index": 163,
                                    "loss": 3.7144124239
                                },
                                {
                                    "index": 164,
                                    "loss": 3.6640017206
                                },
                                {
                                    "index": 165,
                                    "loss": 3.6143208481
                                },
                                {
                                    "index": 166,
                                    "loss": 3.5653620012
                                },
                                {
                                    "index": 167,
                                    "loss": 3.5171166864
                                },
                                {
                                    "index": 168,
                                    "loss": 3.4695745566
                                },
                                {
                                    "index": 169,
                                    "loss": 3.4227248287
                                },
                                {
                                    "index": 170,
                                    "loss": 3.3765585902
                                },
                                {
                                    "index": 171,
                                    "loss": 3.3310666765
                                },
                                {
                                    "index": 172,
                                    "loss": 3.2862394772
                                },
                                {
                                    "index": 173,
                                    "loss": 3.2420651263
                                },
                                {
                                    "index": 174,
                                    "loss": 3.1985369007
                                },
                                {
                                    "index": 175,
                                    "loss": 3.1556461798
                                },
                                {
                                    "index": 176,
                                    "loss": 3.1133863905
                                },
                                {
                                    "index": 177,
                                    "loss": 3.0717484386
                                },
                                {
                                    "index": 178,
                                    "loss": 3.0307234503
                                },
                                {
                                    "index": 179,
                                    "loss": 2.9903050084
                                },
                                {
                                    "index": 180,
                                    "loss": 2.9504839471
                                },
                                {
                                    "index": 181,
                                    "loss": 2.9112512838
                                },
                                {
                                    "index": 182,
                                    "loss": 2.8726002116
                                },
                                {
                                    "index": 183,
                                    "loss": 2.8345218574
                                },
                                {
                                    "index": 184,
                                    "loss": 2.7970095852
                                },
                                {
                                    "index": 185,
                                    "loss": 2.760054805
                                },
                                {
                                    "index": 186,
                                    "loss": 2.7236494853
                                },
                                {
                                    "index": 187,
                                    "loss": 2.6877878527
                                },
                                {
                                    "index": 188,
                                    "loss": 2.652461829
                                },
                                {
                                    "index": 189,
                                    "loss": 2.6176647854
                                },
                                {
                                    "index": 190,
                                    "loss": 2.5833898962
                                },
                                {
                                    "index": 191,
                                    "loss": 2.5496295877
                                },
                                {
                                    "index": 192,
                                    "loss": 2.516376482
                                },
                                {
                                    "index": 193,
                                    "loss": 2.4836234818
                                },
                                {
                                    "index": 194,
                                    "loss": 2.4513634998
                                },
                                {
                                    "index": 195,
                                    "loss": 2.4195900963
                                },
                                {
                                    "index": 196,
                                    "loss": 2.3882962138
                                },
                                {
                                    "index": 197,
                                    "loss": 2.3574764192
                                },
                                {
                                    "index": 198,
                                    "loss": 2.3271227883
                                },
                                {
                                    "index": 199,
                                    "loss": 2.2972298341
                                },
                                {
                                    "index": 200,
                                    "loss": 2.2677905738
                                },
                                {
                                    "index": 201,
                                    "loss": 2.2387987052
                                },
                                {
                                    "index": 202,
                                    "loss": 2.2102474306
                                },
                                {
                                    "index": 203,
                                    "loss": 2.1821308872
                                },
                                {
                                    "index": 204,
                                    "loss": 2.1544428974
                                },
                                {
                                    "index": 205,
                                    "loss": 2.1271764395
                                },
                                {
                                    "index": 206,
                                    "loss": 2.1003257422
                                },
                                {
                                    "index": 207,
                                    "loss": 2.0738856458
                                },
                                {
                                    "index": 208,
                                    "loss": 2.0478508269
                                },
                                {
                                    "index": 209,
                                    "loss": 2.0222156719
                                },
                                {
                                    "index": 210,
                                    "loss": 1.9969741102
                                },
                                {
                                    "index": 211,
                                    "loss": 1.9721204609
                                },
                                {
                                    "index": 212,
                                    "loss": 1.9476499062
                                },
                                {
                                    "index": 213,
                                    "loss": 1.9235574961
                                },
                                {
                                    "index": 214,
                                    "loss": 1.8998373883
                                },
                                {
                                    "index": 215,
                                    "loss": 1.8764844536
                                },
                                {
                                    "index": 216,
                                    "loss": 1.8534933883
                                },
                                {
                                    "index": 217,
                                    "loss": 1.8308585063
                                },
                                {
                                    "index": 218,
                                    "loss": 1.8085746572
                                },
                                {
                                    "index": 219,
                                    "loss": 1.7866371045
                                },
                                {
                                    "index": 220,
                                    "loss": 1.7650419828
                                },
                                {
                                    "index": 221,
                                    "loss": 1.7437839266
                                },
                                {
                                    "index": 222,
                                    "loss": 1.7228578323
                                },
                                {
                                    "index": 223,
                                    "loss": 1.7022588324
                                },
                                {
                                    "index": 224,
                                    "loss": 1.6819820565
                                },
                                {
                                    "index": 225,
                                    "loss": 1.6620224513
                                },
                                {
                                    "index": 226,
                                    "loss": 1.6423758118
                                },
                                {
                                    "index": 227,
                                    "loss": 1.6230373818
                                },
                                {
                                    "index": 228,
                                    "loss": 1.604003298
                                },
                                {
                                    "index": 229,
                                    "loss": 1.5852696697
                                },
                                {
                                    "index": 230,
                                    "loss": 1.5668313484
                                },
                                {
                                    "index": 231,
                                    "loss": 1.5486843917
                                },
                                {
                                    "index": 232,
                                    "loss": 1.5308243391
                                },
                                {
                                    "index": 233,
                                    "loss": 1.5132471603
                                },
                                {
                                    "index": 234,
                                    "loss": 1.4959485757
                                },
                                {
                                    "index": 235,
                                    "loss": 1.4789245981
                                },
                                {
                                    "index": 236,
                                    "loss": 1.4621708138
                                },
                                {
                                    "index": 237,
                                    "loss": 1.4456841819
                                },
                                {
                                    "index": 238,
                                    "loss": 1.429459857
                                },
                                {
                                    "index": 239,
                                    "loss": 1.413493982
                                },
                                {
                                    "index": 240,
                                    "loss": 1.397783043
                                },
                                {
                                    "index": 241,
                                    "loss": 1.3823233032
                                },
                                {
                                    "index": 242,
                                    "loss": 1.3671103554
                                },
                                {
                                    "index": 243,
                                    "loss": 1.3521398509
                                },
                                {
                                    "index": 244,
                                    "loss": 1.3374085854
                                },
                                {
                                    "index": 245,
                                    "loss": 1.3229130124
                                },
                                {
                                    "index": 246,
                                    "loss": 1.3086495334
                                },
                                {
                                    "index": 247,
                                    "loss": 1.2946147477
                                },
                                {
                                    "index": 248,
                                    "loss": 1.2808051864
                                },
                                {
                                    "index": 249,
                                    "loss": 1.2672176031
                                },
                                {
                                    "index": 250,
                                    "loss": 1.2538486252
                                },
                                {
                                    "index": 251,
                                    "loss": 1.2406954627
                                },
                                {
                                    "index": 252,
                                    "loss": 1.2277544336
                                },
                                {
                                    "index": 253,
                                    "loss": 1.2150226185
                                },
                                {
                                    "index": 254,
                                    "loss": 1.2024970605
                                },
                                {
                                    "index": 255,
                                    "loss": 1.1901744349
                                },
                                {
                                    "index": 256,
                                    "loss": 1.1780515595
                                },
                                {
                                    "index": 257,
                                    "loss": 1.1661254499
                                },
                                {
                                    "index": 258,
                                    "loss": 1.1543927682
                                },
                                {
                                    "index": 259,
                                    "loss": 1.142850516
                                },
                                {
                                    "index": 260,
                                    "loss": 1.1314957379
                                },
                                {
                                    "index": 261,
                                    "loss": 1.1203257125
                                },
                                {
                                    "index": 262,
                                    "loss": 1.1093376018
                                },
                                {
                                    "index": 263,
                                    "loss": 1.0985284801
                                },
                                {
                                    "index": 264,
                                    "loss": 1.0878958167
                                },
                                {
                                    "index": 265,
                                    "loss": 1.0774367937
                                },
                                {
                                    "index": 266,
                                    "loss": 1.067149046
                                },
                                {
                                    "index": 267,
                                    "loss": 1.0570296043
                                },
                                {
                                    "index": 268,
                                    "loss": 1.047075931
                                },
                                {
                                    "index": 269,
                                    "loss": 1.0372856028
                                },
                                {
                                    "index": 270,
                                    "loss": 1.0276558874
                                },
                                {
                                    "index": 271,
                                    "loss": 1.0181843868
                                },
                                {
                                    "index": 272,
                                    "loss": 1.0088685885
                                },
                                {
                                    "index": 273,
                                    "loss": 0.9997059479
                                },
                                {
                                    "index": 274,
                                    "loss": 0.9906941104
                                },
                                {
                                    "index": 275,
                                    "loss": 0.9818305673
                                },
                                {
                                    "index": 276,
                                    "loss": 0.9731129361
                                },
                                {
                                    "index": 277,
                                    "loss": 0.9645390479
                                },
                                {
                                    "index": 278,
                                    "loss": 0.9561067537
                                },
                                {
                                    "index": 279,
                                    "loss": 0.9478137317
                                },
                                {
                                    "index": 280,
                                    "loss": 0.9396578024
                                },
                                {
                                    "index": 281,
                                    "loss": 0.9316366193
                                },
                                {
                                    "index": 282,
                                    "loss": 0.923748117
                                },
                                {
                                    "index": 283,
                                    "loss": 0.9159903017
                                },
                                {
                                    "index": 284,
                                    "loss": 0.9083610706
                                },
                                {
                                    "index": 285,
                                    "loss": 0.9008581362
                                },
                                {
                                    "index": 286,
                                    "loss": 0.8934795981
                                },
                                {
                                    "index": 287,
                                    "loss": 0.8862235211
                                },
                                {
                                    "index": 288,
                                    "loss": 0.8790877651
                                },
                                {
                                    "index": 289,
                                    "loss": 0.8720703516
                                },
                                {
                                    "index": 290,
                                    "loss": 0.8651695301
                                },
                                {
                                    "index": 291,
                                    "loss": 0.8583833506
                                },
                                {
                                    "index": 292,
                                    "loss": 0.8517100094
                                },
                                {
                                    "index": 293,
                                    "loss": 0.8451476704
                                },
                                {
                                    "index": 294,
                                    "loss": 0.8386947318
                                },
                                {
                                    "index": 295,
                                    "loss": 0.8323494074
                                },
                                {
                                    "index": 296,
                                    "loss": 0.826109685
                                },
                                {
                                    "index": 297,
                                    "loss": 0.8199738923
                                },
                                {
                                    "index": 298,
                                    "loss": 0.8139403486
                                },
                                {
                                    "index": 299,
                                    "loss": 0.808007299
                                },
                                {
                                    "index": 300,
                                    "loss": 0.8021731816
                                },
                                {
                                    "index": 301,
                                    "loss": 0.7964363992
                                },
                                {
                                    "index": 302,
                                    "loss": 0.7907953247
                                },
                                {
                                    "index": 303,
                                    "loss": 0.7852483235
                                },
                                {
                                    "index": 304,
                                    "loss": 0.7797938168
                                },
                                {
                                    "index": 305,
                                    "loss": 0.7744302951
                                },
                                {
                                    "index": 306,
                                    "loss": 0.7691562374
                                },
                                {
                                    "index": 307,
                                    "loss": 0.76397016
                                },
                                {
                                    "index": 308,
                                    "loss": 0.758870588
                                },
                                {
                                    "index": 309,
                                    "loss": 0.7538560803
                                },
                                {
                                    "index": 310,
                                    "loss": 0.7489252258
                                },
                                {
                                    "index": 311,
                                    "loss": 0.7440766302
                                },
                                {
                                    "index": 312,
                                    "loss": 0.7393089183
                                },
                                {
                                    "index": 313,
                                    "loss": 0.7346207308
                                },
                                {
                                    "index": 314,
                                    "loss": 0.7300106888
                                },
                                {
                                    "index": 315,
                                    "loss": 0.7254774686
                                },
                                {
                                    "index": 316,
                                    "loss": 0.7210198459
                                },
                                {
                                    "index": 317,
                                    "loss": 0.7166365607
                                },
                                {
                                    "index": 318,
                                    "loss": 0.712326351
                                },
                                {
                                    "index": 319,
                                    "loss": 0.7080879868
                                },
                                {
                                    "index": 320,
                                    "loss": 0.703920253
                                },
                                {
                                    "index": 321,
                                    "loss": 0.6998219622
                                },
                                {
                                    "index": 322,
                                    "loss": 0.6957919271
                                },
                                {
                                    "index": 323,
                                    "loss": 0.6918290228
                                },
                                {
                                    "index": 324,
                                    "loss": 0.6879321033
                                },
                                {
                                    "index": 325,
                                    "loss": 0.6841000414
                                },
                                {
                                    "index": 326,
                                    "loss": 0.6803317317
                                },
                                {
                                    "index": 327,
                                    "loss": 0.6766260964
                                },
                                {
                                    "index": 328,
                                    "loss": 0.6729820702
                                },
                                {
                                    "index": 329,
                                    "loss": 0.6693985944
                                },
                                {
                                    "index": 330,
                                    "loss": 0.6658746385
                                },
                                {
                                    "index": 331,
                                    "loss": 0.6624091902
                                },
                                {
                                    "index": 332,
                                    "loss": 0.6590012207
                                },
                                {
                                    "index": 333,
                                    "loss": 0.6556497415
                                },
                                {
                                    "index": 334,
                                    "loss": 0.6523537834
                                },
                                {
                                    "index": 335,
                                    "loss": 0.6491123893
                                },
                                {
                                    "index": 336,
                                    "loss": 0.6459246358
                                },
                                {
                                    "index": 337,
                                    "loss": 0.6427895968
                                },
                                {
                                    "index": 338,
                                    "loss": 0.6397063661
                                },
                                {
                                    "index": 339,
                                    "loss": 0.6366740491
                                },
                                {
                                    "index": 340,
                                    "loss": 0.6336917828
                                },
                                {
                                    "index": 341,
                                    "loss": 0.63075869
                                },
                                {
                                    "index": 342,
                                    "loss": 0.6278739182
                                },
                                {
                                    "index": 343,
                                    "loss": 0.6250366113
                                },
                                {
                                    "index": 344,
                                    "loss": 0.6222459495
                                },
                                {
                                    "index": 345,
                                    "loss": 0.6195011255
                                },
                                {
                                    "index": 346,
                                    "loss": 0.6168013453
                                },
                                {
                                    "index": 347,
                                    "loss": 0.614145832
                                },
                                {
                                    "index": 348,
                                    "loss": 0.6115338038
                                },
                                {
                                    "index": 349,
                                    "loss": 0.6089644973
                                },
                                {
                                    "index": 350,
                                    "loss": 0.606437167
                                },
                                {
                                    "index": 351,
                                    "loss": 0.60395107
                                },
                                {
                                    "index": 352,
                                    "loss": 0.6015054514
                                },
                                {
                                    "index": 353,
                                    "loss": 0.5990996304
                                },
                                {
                                    "index": 354,
                                    "loss": 0.5967328988
                                },
                                {
                                    "index": 355,
                                    "loss": 0.5944045724
                                },
                                {
                                    "index": 356,
                                    "loss": 0.592113982
                                },
                                {
                                    "index": 357,
                                    "loss": 0.589860459
                                },
                                {
                                    "index": 358,
                                    "loss": 0.5876433483
                                },
                                {
                                    "index": 359,
                                    "loss": 0.5854620067
                                },
                                {
                                    "index": 360,
                                    "loss": 0.5833158149
                                },
                                {
                                    "index": 361,
                                    "loss": 0.581204137
                                },
                                {
                                    "index": 362,
                                    "loss": 0.5791263672
                                },
                                {
                                    "index": 363,
                                    "loss": 0.5770818991
                                },
                                {
                                    "index": 364,
                                    "loss": 0.5750701488
                                },
                                {
                                    "index": 365,
                                    "loss": 0.5730905429
                                },
                                {
                                    "index": 366,
                                    "loss": 0.5711424923
                                },
                                {
                                    "index": 367,
                                    "loss": 0.5692254342
                                },
                                {
                                    "index": 368,
                                    "loss": 0.5673388207
                                },
                                {
                                    "index": 369,
                                    "loss": 0.5654821061
                                },
                                {
                                    "index": 370,
                                    "loss": 0.5636547569
                                },
                                {
                                    "index": 371,
                                    "loss": 0.5618562498
                                },
                                {
                                    "index": 372,
                                    "loss": 0.5600860651
                                },
                                {
                                    "index": 373,
                                    "loss": 0.558343698
                                },
                                {
                                    "index": 374,
                                    "loss": 0.5566286455
                                },
                                {
                                    "index": 375,
                                    "loss": 0.5549404166
                                },
                                {
                                    "index": 376,
                                    "loss": 0.5532785312
                                },
                                {
                                    "index": 377,
                                    "loss": 0.551642514
                                },
                                {
                                    "index": 378,
                                    "loss": 0.5500318998
                                },
                                {
                                    "index": 379,
                                    "loss": 0.5484462315
                                },
                                {
                                    "index": 380,
                                    "loss": 0.5468850605
                                },
                                {
                                    "index": 381,
                                    "loss": 0.5453479451
                                },
                                {
                                    "index": 382,
                                    "loss": 0.5438344508
                                },
                                {
                                    "index": 383,
                                    "loss": 0.5423441513
                                },
                                {
                                    "index": 384,
                                    "loss": 0.5408766252
                                },
                                {
                                    "index": 385,
                                    "loss": 0.5394314598
                                },
                                {
                                    "index": 386,
                                    "loss": 0.5380082534
                                },
                                {
                                    "index": 387,
                                    "loss": 0.5366066138
                                },
                                {
                                    "index": 388,
                                    "loss": 0.5352261464
                                },
                                {
                                    "index": 389,
                                    "loss": 0.5338664634
                                },
                                {
                                    "index": 390,
                                    "loss": 0.5325271907
                                },
                                {
                                    "index": 391,
                                    "loss": 0.5312079679
                                },
                                {
                                    "index": 392,
                                    "loss": 0.5299084236
                                },
                                {
                                    "index": 393,
                                    "loss": 0.5286282016
                                },
                                {
                                    "index": 394,
                                    "loss": 0.5273669531
                                },
                                {
                                    "index": 395,
                                    "loss": 0.5261243237
                                },
                                {
                                    "index": 396,
                                    "loss": 0.5248999755
                                },
                                {
                                    "index": 397,
                                    "loss": 0.5236935755
                                },
                                {
                                    "index": 398,
                                    "loss": 0.5225047974
                                },
                                {
                                    "index": 399,
                                    "loss": 0.5213333246
                                },
                                {
                                    "index": 400,
                                    "loss": 0.5201788369
                                },
                                {
                                    "index": 401,
                                    "loss": 0.5190410234
                                },
                                {
                                    "index": 402,
                                    "loss": 0.5179195796
                                },
                                {
                                    "index": 403,
                                    "loss": 0.5168142071
                                },
                                {
                                    "index": 404,
                                    "loss": 0.5157246106
                                },
                                {
                                    "index": 405,
                                    "loss": 0.5146505045
                                },
                                {
                                    "index": 406,
                                    "loss": 0.5135916064
                                },
                                {
                                    "index": 407,
                                    "loss": 0.5125476364
                                },
                                {
                                    "index": 408,
                                    "loss": 0.5115183215
                                },
                                {
                                    "index": 409,
                                    "loss": 0.5105034031
                                },
                                {
                                    "index": 410,
                                    "loss": 0.5095026149
                                },
                                {
                                    "index": 411,
                                    "loss": 0.5085156968
                                },
                                {
                                    "index": 412,
                                    "loss": 0.5075423927
                                },
                                {
                                    "index": 413,
                                    "loss": 0.506582452
                                },
                                {
                                    "index": 414,
                                    "loss": 0.5056356298
                                },
                                {
                                    "index": 415,
                                    "loss": 0.5047016859
                                },
                                {
                                    "index": 416,
                                    "loss": 0.5037803859
                                },
                                {
                                    "index": 417,
                                    "loss": 0.5028714969
                                },
                                {
                                    "index": 418,
                                    "loss": 0.5019747909
                                },
                                {
                                    "index": 419,
                                    "loss": 0.5010900453
                                },
                                {
                                    "index": 420,
                                    "loss": 0.5002170409
                                },
                                {
                                    "index": 421,
                                    "loss": 0.4993555632
                                },
                                {
                                    "index": 422,
                                    "loss": 0.4985054025
                                },
                                {
                                    "index": 423,
                                    "loss": 0.4976663518
                                },
                                {
                                    "index": 424,
                                    "loss": 0.4968382067
                                },
                                {
                                    "index": 425,
                                    "loss": 0.4960207681
                                },
                                {
                                    "index": 426,
                                    "loss": 0.4952138382
                                },
                                {
                                    "index": 427,
                                    "loss": 0.4944172262
                                },
                                {
                                    "index": 428,
                                    "loss": 0.4936307438
                                },
                                {
                                    "index": 429,
                                    "loss": 0.4928542062
                                },
                                {
                                    "index": 430,
                                    "loss": 0.4920874319
                                },
                                {
                                    "index": 431,
                                    "loss": 0.491330243
                                },
                                {
                                    "index": 432,
                                    "loss": 0.4905824646
                                },
                                {
                                    "index": 433,
                                    "loss": 0.4898439305
                                },
                                {
                                    "index": 434,
                                    "loss": 0.4891144714
                                },
                                {
                                    "index": 435,
                                    "loss": 0.4883939178
                                },
                                {
                                    "index": 436,
                                    "loss": 0.4876821072
                                },
                                {
                                    "index": 437,
                                    "loss": 0.4869788807
                                },
                                {
                                    "index": 438,
                                    "loss": 0.4862840821
                                },
                                {
                                    "index": 439,
                                    "loss": 0.4855975587
                                },
                                {
                                    "index": 440,
                                    "loss": 0.4849191599
                                },
                                {
                                    "index": 441,
                                    "loss": 0.484248738
                                },
                                {
                                    "index": 442,
                                    "loss": 0.4835861493
                                },
                                {
                                    "index": 443,
                                    "loss": 0.482931255
                                },
                                {
                                    "index": 444,
                                    "loss": 0.4822839121
                                },
                                {
                                    "index": 445,
                                    "loss": 0.4816439843
                                },
                                {
                                    "index": 446,
                                    "loss": 0.4810113375
                                },
                                {
                                    "index": 447,
                                    "loss": 0.4803858402
                                },
                                {
                                    "index": 448,
                                    "loss": 0.4797673634
                                },
                                {
                                    "index": 449,
                                    "loss": 0.4791557808
                                },
                                {
                                    "index": 450,
                                    "loss": 0.4785509684
                                },
                                {
                                    "index": 451,
                                    "loss": 0.4779528044
                                },
                                {
                                    "index": 452,
                                    "loss": 0.4773611695
                                },
                                {
                                    "index": 453,
                                    "loss": 0.4767759466
                                },
                                {
                                    "index": 454,
                                    "loss": 0.4761970207
                                },
                                {
                                    "index": 455,
                                    "loss": 0.4756242795
                                },
                                {
                                    "index": 456,
                                    "loss": 0.4750576126
                                },
                                {
                                    "index": 457,
                                    "loss": 0.4744969116
                                },
                                {
                                    "index": 458,
                                    "loss": 0.4739420705
                                },
                                {
                                    "index": 459,
                                    "loss": 0.4733929849
                                },
                                {
                                    "index": 460,
                                    "loss": 0.4728495528
                                },
                                {
                                    "index": 461,
                                    "loss": 0.4723116739
                                },
                                {
                                    "index": 462,
                                    "loss": 0.4717792501
                                },
                                {
                                    "index": 463,
                                    "loss": 0.4712521863
                                },
                                {
                                    "index": 464,
                                    "loss": 0.4707303892
                                },
                                {
                                    "index": 465,
                                    "loss": 0.4702137639
                                },
                                {
                                    "index": 466,
                                    "loss": 0.4697022198
                                },
                                {
                                    "index": 467,
                                    "loss": 0.4691956677
                                },
                                {
                                    "index": 468,
                                    "loss": 0.4686940204
                                },
                                {
                                    "index": 469,
                                    "loss": 0.468197192
                                },
                                {
                                    "index": 470,
                                    "loss": 0.467705099
                                },
                                {
                                    "index": 471,
                                    "loss": 0.4672176591
                                },
                                {
                                    "index": 472,
                                    "loss": 0.4667347912
                                },
                                {
                                    "index": 473,
                                    "loss": 0.4662564163
                                },
                                {
                                    "index": 474,
                                    "loss": 0.4657824593
                                },
                                {
                                    "index": 475,
                                    "loss": 0.4653128425
                                },
                                {
                                    "index": 476,
                                    "loss": 0.4648474909
                                },
                                {
                                    "index": 477,
                                    "loss": 0.4643863313
                                },
                                {
                                    "index": 478,
                                    "loss": 0.4639292919
                                },
                                {
                                    "index": 479,
                                    "loss": 0.4634763026
                                },
                                {
                                    "index": 480,
                                    "loss": 0.4630272945
                                },
                                {
                                    "index": 481,
                                    "loss": 0.4625822001
                                },
                                {
                                    "index": 482,
                                    "loss": 0.4621409532
                                },
                                {
                                    "index": 483,
                                    "loss": 0.461703489
                                },
                                {
                                    "index": 484,
                                    "loss": 0.461269744
                                },
                                {
                                    "index": 485,
                                    "loss": 0.4608396558
                                },
                                {
                                    "index": 486,
                                    "loss": 0.4604131641
                                },
                                {
                                    "index": 487,
                                    "loss": 0.4599902102
                                },
                                {
                                    "index": 488,
                                    "loss": 0.4595707336
                                },
                                {
                                    "index": 489,
                                    "loss": 0.4591546767
                                },
                                {
                                    "index": 490,
                                    "loss": 0.4587419831
                                },
                                {
                                    "index": 491,
                                    "loss": 0.4583325977
                                },
                                {
                                    "index": 492,
                                    "loss": 0.4579264661
                                },
                                {
                                    "index": 493,
                                    "loss": 0.4575235352
                                },
                                {
                                    "index": 494,
                                    "loss": 0.4571237533
                                },
                                {
                                    "index": 495,
                                    "loss": 0.4567270691
                                },
                                {
                                    "index": 496,
                                    "loss": 0.4563334327
                                },
                                {
                                    "index": 497,
                                    "loss": 0.4559427951
                                },
                                {
                                    "index": 498,
                                    "loss": 0.4555551082
                                },
                                {
                                    "index": 499,
                                    "loss": 0.4551703251
                                },
                                {
                                    "index": 500,
                                    "loss": 0.4547883996
                                },
                                {
                                    "index": 501,
                                    "loss": 0.4544092865
                                },
                                {
                                    "index": 502,
                                    "loss": 0.4540329415
                                },
                                {
                                    "index": 503,
                                    "loss": 0.4536593213
                                },
                                {
                                    "index": 504,
                                    "loss": 0.4532883834
                                },
                                {
                                    "index": 505,
                                    "loss": 0.4529200858
                                },
                                {
                                    "index": 506,
                                    "loss": 0.4525543878
                                },
                                {
                                    "index": 507,
                                    "loss": 0.4521912493
                                },
                                {
                                    "index": 508,
                                    "loss": 0.4518306313
                                },
                                {
                                    "index": 509,
                                    "loss": 0.4514724951
                                },
                                {
                                    "index": 510,
                                    "loss": 0.4511168029
                                },
                                {
                                    "index": 511,
                                    "loss": 0.450763518
                                },
                                {
                                    "index": 512,
                                    "loss": 0.4504126041
                                },
                                {
                                    "index": 513,
                                    "loss": 0.4500640258
                                },
                                {
                                    "index": 514,
                                    "loss": 0.4497177483
                                },
                                {
                                    "index": 515,
                                    "loss": 0.4493737374
                                },
                                {
                                    "index": 516,
                                    "loss": 0.4490319598
                                },
                                {
                                    "index": 517,
                                    "loss": 0.4486923828
                                },
                                {
                                    "index": 518,
                                    "loss": 0.4483549743
                                },
                                {
                                    "index": 519,
                                    "loss": 0.4480197029
                                },
                                {
                                    "index": 520,
                                    "loss": 0.4476865376
                                },
                                {
                                    "index": 521,
                                    "loss": 0.4473554484
                                },
                                {
                                    "index": 522,
                                    "loss": 0.4470264057
                                },
                                {
                                    "index": 523,
                                    "loss": 0.4466993803
                                },
                                {
                                    "index": 524,
                                    "loss": 0.446374344
                                },
                                {
                                    "index": 525,
                                    "loss": 0.4460512688
                                },
                                {
                                    "index": 526,
                                    "loss": 0.4457301274
                                },
                                {
                                    "index": 527,
                                    "loss": 0.4454108932
                                },
                                {
                                    "index": 528,
                                    "loss": 0.4450935398
                                },
                                {
                                    "index": 529,
                                    "loss": 0.4447780415
                                },
                                {
                                    "index": 530,
                                    "loss": 0.4444643732
                                },
                                {
                                    "index": 531,
                                    "loss": 0.44415251
                                },
                                {
                                    "index": 532,
                                    "loss": 0.4438424279
                                },
                                {
                                    "index": 533,
                                    "loss": 0.443534103
                                },
                                {
                                    "index": 534,
                                    "loss": 0.4432275121
                                },
                                {
                                    "index": 535,
                                    "loss": 0.4429226325
                                },
                                {
                                    "index": 536,
                                    "loss": 0.4426194416
                                },
                                {
                                    "index": 537,
                                    "loss": 0.4423179177
                                },
                                {
                                    "index": 538,
                                    "loss": 0.4420180391
                                },
                                {
                                    "index": 539,
                                    "loss": 0.4417197849
                                },
                                {
                                    "index": 540,
                                    "loss": 0.4414231344
                                },
                                {
                                    "index": 541,
                                    "loss": 0.4411280673
                                },
                                {
                                    "index": 542,
                                    "loss": 0.4408345639
                                },
                                {
                                    "index": 543,
                                    "loss": 0.4405426046
                                },
                                {
                                    "index": 544,
                                    "loss": 0.4402521704
                                },
                                {
                                    "index": 545,
                                    "loss": 0.4399632425
                                },
                                {
                                    "index": 546,
                                    "loss": 0.4396758026
                                },
                                {
                                    "index": 547,
                                    "loss": 0.4393898328
                                },
                                {
                                    "index": 548,
                                    "loss": 0.4391053154
                                },
                                {
                                    "index": 549,
                                    "loss": 0.4388222331
                                },
                                {
                                    "index": 550,
                                    "loss": 0.438540569
                                },
                                {
                                    "index": 551,
                                    "loss": 0.4382603064
                                },
                                {
                                    "index": 552,
                                    "loss": 0.437981429
                                },
                                {
                                    "index": 553,
                                    "loss": 0.4377039207
                                },
                                {
                                    "index": 554,
                                    "loss": 0.437427766
                                },
                                {
                                    "index": 555,
                                    "loss": 0.4371529494
                                },
                                {
                                    "index": 556,
                                    "loss": 0.4368794559
                                },
                                {
                                    "index": 557,
                                    "loss": 0.4366072706
                                },
                                {
                                    "index": 558,
                                    "loss": 0.4363363789
                                },
                                {
                                    "index": 559,
                                    "loss": 0.4360667667
                                },
                                {
                                    "index": 560,
                                    "loss": 0.43579842
                                },
                                {
                                    "index": 561,
                                    "loss": 0.435531325
                                },
                                {
                                    "index": 562,
                                    "loss": 0.4352654684
                                },
                                {
                                    "index": 563,
                                    "loss": 0.4350008368
                                },
                                {
                                    "index": 564,
                                    "loss": 0.4347374174
                                },
                                {
                                    "index": 565,
                                    "loss": 0.4344751974
                                },
                                {
                                    "index": 566,
                                    "loss": 0.4342141644
                                },
                                {
                                    "index": 567,
                                    "loss": 0.4339543061
                                },
                                {
                                    "index": 568,
                                    "loss": 0.4336956106
                                },
                                {
                                    "index": 569,
                                    "loss": 0.4334380659
                                },
                                {
                                    "index": 570,
                                    "loss": 0.4331816606
                                },
                                {
                                    "index": 571,
                                    "loss": 0.4329263833
                                },
                                {
                                    "index": 572,
                                    "loss": 0.4326722227
                                },
                                {
                                    "index": 573,
                                    "loss": 0.4324191681
                                },
                                {
                                    "index": 574,
                                    "loss": 0.4321672086
                                },
                                {
                                    "index": 575,
                                    "loss": 0.4319163337
                                },
                                {
                                    "index": 576,
                                    "loss": 0.431666533
                                },
                                {
                                    "index": 577,
                                    "loss": 0.4314177964
                                },
                                {
                                    "index": 578,
                                    "loss": 0.4311701138
                                },
                                {
                                    "index": 579,
                                    "loss": 0.4309234755
                                },
                                {
                                    "index": 580,
                                    "loss": 0.4306778717
                                },
                                {
                                    "index": 581,
                                    "loss": 0.4304332931
                                },
                                {
                                    "index": 582,
                                    "loss": 0.4301897304
                                },
                                {
                                    "index": 583,
                                    "loss": 0.4299471744
                                },
                                {
                                    "index": 584,
                                    "loss": 0.4297056161
                                },
                                {
                                    "index": 585,
                                    "loss": 0.4294650468
                                },
                                {
                                    "index": 586,
                                    "loss": 0.4292254577
                                },
                                {
                                    "index": 587,
                                    "loss": 0.4289868404
                                },
                                {
                                    "index": 588,
                                    "loss": 0.4287491864
                                },
                                {
                                    "index": 589,
                                    "loss": 0.4285124877
                                },
                                {
                                    "index": 590,
                                    "loss": 0.428276736
                                },
                                {
                                    "index": 591,
                                    "loss": 0.4280419234
                                },
                                {
                                    "index": 592,
                                    "loss": 0.4278080422
                                },
                                {
                                    "index": 593,
                                    "loss": 0.4275750847
                                },
                                {
                                    "index": 594,
                                    "loss": 0.4273430433
                                },
                                {
                                    "index": 595,
                                    "loss": 0.4271119106
                                },
                                {
                                    "index": 596,
                                    "loss": 0.4268816792
                                },
                                {
                                    "index": 597,
                                    "loss": 0.4266523422
                                },
                                {
                                    "index": 598,
                                    "loss": 0.4264238922
                                },
                                {
                                    "index": 599,
                                    "loss": 0.4261963226
                                },
                                {
                                    "index": 600,
                                    "loss": 0.4259696263
                                },
                                {
                                    "index": 601,
                                    "loss": 0.4257437967
                                },
                                {
                                    "index": 602,
                                    "loss": 0.4255188272
                                },
                                {
                                    "index": 603,
                                    "loss": 0.4252947112
                                },
                                {
                                    "index": 604,
                                    "loss": 0.4250714425
                                },
                                {
                                    "index": 605,
                                    "loss": 0.4248490146
                                },
                                {
                                    "index": 606,
                                    "loss": 0.4246274214
                                },
                                {
                                    "index": 607,
                                    "loss": 0.4244066568
                                },
                                {
                                    "index": 608,
                                    "loss": 0.4241867148
                                },
                                {
                                    "index": 609,
                                    "loss": 0.4239675894
                                },
                                {
                                    "index": 610,
                                    "loss": 0.4237492749
                                },
                                {
                                    "index": 611,
                                    "loss": 0.4235317654
                                },
                                {
                                    "index": 612,
                                    "loss": 0.4233150555
                                },
                                {
                                    "index": 613,
                                    "loss": 0.4230991395
                                },
                                {
                                    "index": 614,
                                    "loss": 0.4228840119
                                },
                                {
                                    "index": 615,
                                    "loss": 0.4226696673
                                },
                                {
                                    "index": 616,
                                    "loss": 0.4224561005
                                },
                                {
                                    "index": 617,
                                    "loss": 0.4222433062
                                },
                                {
                                    "index": 618,
                                    "loss": 0.4220312792
                                },
                                {
                                    "index": 619,
                                    "loss": 0.4218200144
                                },
                                {
                                    "index": 620,
                                    "loss": 0.4216095069
                                },
                                {
                                    "index": 621,
                                    "loss": 0.4213997517
                                },
                                {
                                    "index": 622,
                                    "loss": 0.4211907439
                                },
                                {
                                    "index": 623,
                                    "loss": 0.4209824787
                                },
                                {
                                    "index": 624,
                                    "loss": 0.4207749515
                                },
                                {
                                    "index": 625,
                                    "loss": 0.4205681574
                                },
                                {
                                    "index": 626,
                                    "loss": 0.420362092
                                },
                                {
                                    "index": 627,
                                    "loss": 0.4201567507
                                },
                                {
                                    "index": 628,
                                    "loss": 0.419952129
                                },
                                {
                                    "index": 629,
                                    "loss": 0.4197482225
                                },
                                {
                                    "index": 630,
                                    "loss": 0.4195450268
                                },
                                {
                                    "index": 631,
                                    "loss": 0.4193425377
                                },
                                {
                                    "index": 632,
                                    "loss": 0.4191407509
                                },
                                {
                                    "index": 633,
                                    "loss": 0.4189396622
                                },
                                {
                                    "index": 634,
                                    "loss": 0.4187392675
                                },
                                {
                                    "index": 635,
                                    "loss": 0.4185395626
                                },
                                {
                                    "index": 636,
                                    "loss": 0.4183405437
                                },
                                {
                                    "index": 637,
                                    "loss": 0.4181422066
                                },
                                {
                                    "index": 638,
                                    "loss": 0.4179445476
                                },
                                {
                                    "index": 639,
                                    "loss": 0.4177475626
                                },
                                {
                                    "index": 640,
                                    "loss": 0.4175512479
                                },
                                {
                                    "index": 641,
                                    "loss": 0.4173555997
                                },
                                {
                                    "index": 642,
                                    "loss": 0.4171606142
                                },
                                {
                                    "index": 643,
                                    "loss": 0.4169662878
                                },
                                {
                                    "index": 644,
                                    "loss": 0.4167726168
                                },
                                {
                                    "index": 645,
                                    "loss": 0.4165795977
                                },
                                {
                                    "index": 646,
                                    "loss": 0.4163872267
                                },
                                {
                                    "index": 647,
                                    "loss": 0.4161955006
                                },
                                {
                                    "index": 648,
                                    "loss": 0.4160044157
                                },
                                {
                                    "index": 649,
                                    "loss": 0.4158139686
                                },
                                {
                                    "index": 650,
                                    "loss": 0.4156241559
                                },
                                {
                                    "index": 651,
                                    "loss": 0.4154349743
                                },
                                {
                                    "index": 652,
                                    "loss": 0.4152464205
                                },
                                {
                                    "index": 653,
                                    "loss": 0.4150584911
                                },
                                {
                                    "index": 654,
                                    "loss": 0.4148711829
                                },
                                {
                                    "index": 655,
                                    "loss": 0.4146844928
                                },
                                {
                                    "index": 656,
                                    "loss": 0.4144984174
                                },
                                {
                                    "index": 657,
                                    "loss": 0.4143129537
                                },
                                {
                                    "index": 658,
                                    "loss": 0.4141280986
                                },
                                {
                                    "index": 659,
                                    "loss": 0.4139438489
                                },
                                {
                                    "index": 660,
                                    "loss": 0.4137602017
                                },
                                {
                                    "index": 661,
                                    "loss": 0.4135771539
                                },
                                {
                                    "index": 662,
                                    "loss": 0.4133947026
                                },
                                {
                                    "index": 663,
                                    "loss": 0.4132128447
                                },
                                {
                                    "index": 664,
                                    "loss": 0.4130315773
                                },
                                {
                                    "index": 665,
                                    "loss": 0.4128508977
                                },
                                {
                                    "index": 666,
                                    "loss": 0.4126708028
                                },
                                {
                                    "index": 667,
                                    "loss": 0.4124912899
                                },
                                {
                                    "index": 668,
                                    "loss": 0.4123123561
                                },
                                {
                                    "index": 669,
                                    "loss": 0.4121339987
                                },
                                {
                                    "index": 670,
                                    "loss": 0.4119562148
                                },
                                {
                                    "index": 671,
                                    "loss": 0.4117790019
                                },
                                {
                                    "index": 672,
                                    "loss": 0.4116023571
                                },
                                {
                                    "index": 673,
                                    "loss": 0.4114262778
                                },
                                {
                                    "index": 674,
                                    "loss": 0.4112507613
                                },
                                {
                                    "index": 675,
                                    "loss": 0.411075805
                                },
                                {
                                    "index": 676,
                                    "loss": 0.4109014064
                                },
                                {
                                    "index": 677,
                                    "loss": 0.4107275627
                                },
                                {
                                    "index": 678,
                                    "loss": 0.4105542714
                                },
                                {
                                    "index": 679,
                                    "loss": 0.41038153
                                },
                                {
                                    "index": 680,
                                    "loss": 0.4102093361
                                },
                                {
                                    "index": 681,
                                    "loss": 0.410037687
                                },
                                {
                                    "index": 682,
                                    "loss": 0.4098665803
                                },
                                {
                                    "index": 683,
                                    "loss": 0.4096960136
                                },
                                {
                                    "index": 684,
                                    "loss": 0.4095259844
                                },
                                {
                                    "index": 685,
                                    "loss": 0.4093564903
                                },
                                {
                                    "index": 686,
                                    "loss": 0.4091875289
                                },
                                {
                                    "index": 687,
                                    "loss": 0.4090190979
                                },
                                {
                                    "index": 688,
                                    "loss": 0.4088511949
                                },
                                {
                                    "index": 689,
                                    "loss": 0.4086838175
                                },
                                {
                                    "index": 690,
                                    "loss": 0.4085169635
                                },
                                {
                                    "index": 691,
                                    "loss": 0.4083506305
                                },
                                {
                                    "index": 692,
                                    "loss": 0.4081848163
                                },
                                {
                                    "index": 693,
                                    "loss": 0.4080195186
                                },
                                {
                                    "index": 694,
                                    "loss": 0.4078547351
                                },
                                {
                                    "index": 695,
                                    "loss": 0.4076904637
                                },
                                {
                                    "index": 696,
                                    "loss": 0.407526702
                                },
                                {
                                    "index": 697,
                                    "loss": 0.407363448
                                },
                                {
                                    "index": 698,
                                    "loss": 0.4072006995
                                },
                                {
                                    "index": 699,
                                    "loss": 0.4070384542
                                },
                                {
                                    "index": 700,
                                    "loss": 0.4068767101
                                },
                                {
                                    "index": 701,
                                    "loss": 0.406715465
                                },
                                {
                                    "index": 702,
                                    "loss": 0.4065547167
                                },
                                {
                                    "index": 703,
                                    "loss": 0.4063944633
                                },
                                {
                                    "index": 704,
                                    "loss": 0.4062347026
                                },
                                {
                                    "index": 705,
                                    "loss": 0.4060754325
                                },
                                {
                                    "index": 706,
                                    "loss": 0.405916651
                                },
                                {
                                    "index": 707,
                                    "loss": 0.405758356
                                },
                                {
                                    "index": 708,
                                    "loss": 0.4056005455
                                },
                                {
                                    "index": 709,
                                    "loss": 0.4054432175
                                },
                                {
                                    "index": 710,
                                    "loss": 0.4052863701
                                },
                                {
                                    "index": 711,
                                    "loss": 0.4051300011
                                },
                                {
                                    "index": 712,
                                    "loss": 0.4049741087
                                },
                                {
                                    "index": 713,
                                    "loss": 0.4048186909
                                },
                                {
                                    "index": 714,
                                    "loss": 0.4046637457
                                },
                                {
                                    "index": 715,
                                    "loss": 0.4045092712
                                },
                                {
                                    "index": 716,
                                    "loss": 0.4043552654
                                },
                                {
                                    "index": 717,
                                    "loss": 0.4042017266
                                },
                                {
                                    "index": 718,
                                    "loss": 0.4040486526
                                },
                                {
                                    "index": 719,
                                    "loss": 0.4038960418
                                },
                                {
                                    "index": 720,
                                    "loss": 0.4037438922
                                },
                                {
                                    "index": 721,
                                    "loss": 0.403592202
                                },
                                {
                                    "index": 722,
                                    "loss": 0.4034409692
                                },
                                {
                                    "index": 723,
                                    "loss": 0.4032901921
                                },
                                {
                                    "index": 724,
                                    "loss": 0.4031398688
                                },
                                {
                                    "index": 725,
                                    "loss": 0.4029899975
                                },
                                {
                                    "index": 726,
                                    "loss": 0.4028405765
                                },
                                {
                                    "index": 727,
                                    "loss": 0.4026916038
                                },
                                {
                                    "index": 728,
                                    "loss": 0.4025430778
                                },
                                {
                                    "index": 729,
                                    "loss": 0.4023949967
                                },
                                {
                                    "index": 730,
                                    "loss": 0.4022473586
                                },
                                {
                                    "index": 731,
                                    "loss": 0.4021001619
                                },
                                {
                                    "index": 732,
                                    "loss": 0.4019534048
                                },
                                {
                                    "index": 733,
                                    "loss": 0.4018070856
                                },
                                {
                                    "index": 734,
                                    "loss": 0.4016612025
                                },
                                {
                                    "index": 735,
                                    "loss": 0.4015157538
                                },
                                {
                                    "index": 736,
                                    "loss": 0.4013707379
                                },
                                {
                                    "index": 737,
                                    "loss": 0.401226153
                                },
                                {
                                    "index": 738,
                                    "loss": 0.4010819975
                                },
                                {
                                    "index": 739,
                                    "loss": 0.4009382697
                                },
                                {
                                    "index": 740,
                                    "loss": 0.4007949678
                                },
                                {
                                    "index": 741,
                                    "loss": 0.4006520904
                                },
                                {
                                    "index": 742,
                                    "loss": 0.4005096357
                                },
                                {
                                    "index": 743,
                                    "loss": 0.400367602
                                },
                                {
                                    "index": 744,
                                    "loss": 0.4002259879
                                },
                                {
                                    "index": 745,
                                    "loss": 0.4000847915
                                },
                                {
                                    "index": 746,
                                    "loss": 0.3999440114
                                },
                                {
                                    "index": 747,
                                    "loss": 0.3998036459
                                },
                                {
                                    "index": 748,
                                    "loss": 0.3996636935
                                },
                                {
                                    "index": 749,
                                    "loss": 0.3995241525
                                },
                                {
                                    "index": 750,
                                    "loss": 0.3993850214
                                },
                                {
                                    "index": 751,
                                    "loss": 0.3992462986
                                },
                                {
                                    "index": 752,
                                    "loss": 0.3991079825
                                },
                                {
                                    "index": 753,
                                    "loss": 0.3989700716
                                },
                                {
                                    "index": 754,
                                    "loss": 0.3988325644
                                },
                                {
                                    "index": 755,
                                    "loss": 0.3986954593
                                },
                                {
                                    "index": 756,
                                    "loss": 0.3985587549
                                },
                                {
                                    "index": 757,
                                    "loss": 0.3984224494
                                },
                                {
                                    "index": 758,
                                    "loss": 0.3982865416
                                },
                                {
                                    "index": 759,
                                    "loss": 0.3981510298
                                },
                                {
                                    "index": 760,
                                    "loss": 0.3980159126
                                },
                                {
                                    "index": 761,
                                    "loss": 0.3978811884
                                },
                                {
                                    "index": 762,
                                    "loss": 0.3977468559
                                },
                                {
                                    "index": 763,
                                    "loss": 0.3976129135
                                },
                                {
                                    "index": 764,
                                    "loss": 0.3974793597
                                },
                                {
                                    "index": 765,
                                    "loss": 0.3973461932
                                },
                                {
                                    "index": 766,
                                    "loss": 0.3972134123
                                },
                                {
                                    "index": 767,
                                    "loss": 0.3970810158
                                },
                                {
                                    "index": 768,
                                    "loss": 0.3969490022
                                },
                                {
                                    "index": 769,
                                    "loss": 0.39681737
                                },
                                {
                                    "index": 770,
                                    "loss": 0.3966861179
                                },
                                {
                                    "index": 771,
                                    "loss": 0.3965552443
                                },
                                {
                                    "index": 772,
                                    "loss": 0.3964247479
                                },
                                {
                                    "index": 773,
                                    "loss": 0.3962946273
                                },
                                {
                                    "index": 774,
                                    "loss": 0.3961648812
                                },
                                {
                                    "index": 775,
                                    "loss": 0.396035508
                                },
                                {
                                    "index": 776,
                                    "loss": 0.3959065065
                                },
                                {
                                    "index": 777,
                                    "loss": 0.3957778752
                                },
                                {
                                    "index": 778,
                                    "loss": 0.3956496128
                                },
                                {
                                    "index": 779,
                                    "loss": 0.3955217179
                                },
                                {
                                    "index": 780,
                                    "loss": 0.3953941892
                                },
                                {
                                    "index": 781,
                                    "loss": 0.3952670253
                                },
                                {
                                    "index": 782,
                                    "loss": 0.3951402249
                                },
                                {
                                    "index": 783,
                                    "loss": 0.3950137867
                                },
                                {
                                    "index": 784,
                                    "loss": 0.3948877093
                                },
                                {
                                    "index": 785,
                                    "loss": 0.3947619913
                                },
                                {
                                    "index": 786,
                                    "loss": 0.3946366316
                                },
                                {
                                    "index": 787,
                                    "loss": 0.3945116287
                                },
                                {
                                    "index": 788,
                                    "loss": 0.3943869814
                                },
                                {
                                    "index": 789,
                                    "loss": 0.3942626883
                                },
                                {
                                    "index": 790,
                                    "loss": 0.3941387482
                                },
                                {
                                    "index": 791,
                                    "loss": 0.3940151598
                                },
                                {
                                    "index": 792,
                                    "loss": 0.3938919218
                                },
                                {
                                    "index": 793,
                                    "loss": 0.3937690329
                                },
                                {
                                    "index": 794,
                                    "loss": 0.3936464919
                                },
                                {
                                    "index": 795,
                                    "loss": 0.3935242975
                                },
                                {
                                    "index": 796,
                                    "loss": 0.3934024484
                                },
                                {
                                    "index": 797,
                                    "loss": 0.3932809434
                                },
                                {
                                    "index": 798,
                                    "loss": 0.3931597813
                                },
                                {
                                    "index": 799,
                                    "loss": 0.3930389608
                                },
                                {
                                    "index": 800,
                                    "loss": 0.3929184807
                                },
                                {
                                    "index": 801,
                                    "loss": 0.3927983397
                                },
                                {
                                    "index": 802,
                                    "loss": 0.3926785366
                                },
                                {
                                    "index": 803,
                                    "loss": 0.3925590702
                                },
                                {
                                    "index": 804,
                                    "loss": 0.3924399394
                                },
                                {
                                    "index": 805,
                                    "loss": 0.3923211428
                                },
                                {
                                    "index": 806,
                                    "loss": 0.3922026793
                                },
                                {
                                    "index": 807,
                                    "loss": 0.3920845477
                                },
                                {
                                    "index": 808,
                                    "loss": 0.3919667468
                                },
                                {
                                    "index": 809,
                                    "loss": 0.3918492754
                                },
                                {
                                    "index": 810,
                                    "loss": 0.3917321324
                                },
                                {
                                    "index": 811,
                                    "loss": 0.3916153165
                                },
                                {
                                    "index": 812,
                                    "loss": 0.3914988267
                                },
                                {
                                    "index": 813,
                                    "loss": 0.3913826616
                                },
                                {
                                    "index": 814,
                                    "loss": 0.3912668203
                                },
                                {
                                    "index": 815,
                                    "loss": 0.3911513015
                                },
                                {
                                    "index": 816,
                                    "loss": 0.391036104
                                },
                                {
                                    "index": 817,
                                    "loss": 0.3909212268
                                },
                                {
                                    "index": 818,
                                    "loss": 0.3908066687
                                },
                                {
                                    "index": 819,
                                    "loss": 0.3906924286
                                },
                                {
                                    "index": 820,
                                    "loss": 0.3905785052
                                },
                                {
                                    "index": 821,
                                    "loss": 0.3904648976
                                },
                                {
                                    "index": 822,
                                    "loss": 0.3903516047
                                },
                                {
                                    "index": 823,
                                    "loss": 0.3902386251
                                },
                                {
                                    "index": 824,
                                    "loss": 0.390125958
                                },
                                {
                                    "index": 825,
                                    "loss": 0.3900136022
                                },
                                {
                                    "index": 826,
                                    "loss": 0.3899015565
                                },
                                {
                                    "index": 827,
                                    "loss": 0.3897898199
                                },
                                {
                                    "index": 828,
                                    "loss": 0.3896783913
                                },
                                {
                                    "index": 829,
                                    "loss": 0.3895672696
                                },
                                {
                                    "index": 830,
                                    "loss": 0.3894564537
                                },
                                {
                                    "index": 831,
                                    "loss": 0.3893459426
                                },
                                {
                                    "index": 832,
                                    "loss": 0.3892357352
                                },
                                {
                                    "index": 833,
                                    "loss": 0.3891258305
                                },
                                {
                                    "index": 834,
                                    "loss": 0.3890162273
                                },
                                {
                                    "index": 835,
                                    "loss": 0.3889069246
                                },
                                {
                                    "index": 836,
                                    "loss": 0.3887979213
                                },
                                {
                                    "index": 837,
                                    "loss": 0.3886892165
                                },
                                {
                                    "index": 838,
                                    "loss": 0.388580809
                                },
                                {
                                    "index": 839,
                                    "loss": 0.3884726979
                                },
                                {
                                    "index": 840,
                                    "loss": 0.3883648821
                                },
                                {
                                    "index": 841,
                                    "loss": 0.3882573606
                                },
                                {
                                    "index": 842,
                                    "loss": 0.3881501323
                                },
                                {
                                    "index": 843,
                                    "loss": 0.3880431962
                                },
                                {
                                    "index": 844,
                                    "loss": 0.3879365514
                                },
                                {
                                    "index": 845,
                                    "loss": 0.3878301967
                                },
                                {
                                    "index": 846,
                                    "loss": 0.3877241313
                                },
                                {
                                    "index": 847,
                                    "loss": 0.387618354
                                },
                                {
                                    "index": 848,
                                    "loss": 0.387512864
                                },
                                {
                                    "index": 849,
                                    "loss": 0.3874076602
                                },
                                {
                                    "index": 850,
                                    "loss": 0.3873027415
                                },
                                {
                                    "index": 851,
                                    "loss": 0.3871981072
                                },
                                {
                                    "index": 852,
                                    "loss": 0.387093756
                                },
                                {
                                    "index": 853,
                                    "loss": 0.3869896872
                                },
                                {
                                    "index": 854,
                                    "loss": 0.3868858996
                                },
                                {
                                    "index": 855,
                                    "loss": 0.3867823924
                                },
                                {
                                    "index": 856,
                                    "loss": 0.3866791645
                                },
                                {
                                    "index": 857,
                                    "loss": 0.3865762151
                                },
                                {
                                    "index": 858,
                                    "loss": 0.3864735431
                                },
                                {
                                    "index": 859,
                                    "loss": 0.3863711476
                                },
                                {
                                    "index": 860,
                                    "loss": 0.3862690277
                                },
                                {
                                    "index": 861,
                                    "loss": 0.3861671824
                                },
                                {
                                    "index": 862,
                                    "loss": 0.3860656108
                                },
                                {
                                    "index": 863,
                                    "loss": 0.3859643119
                                },
                                {
                                    "index": 864,
                                    "loss": 0.3858632848
                                },
                                {
                                    "index": 865,
                                    "loss": 0.3857625286
                                },
                                {
                                    "index": 866,
                                    "loss": 0.3856620423
                                },
                                {
                                    "index": 867,
                                    "loss": 0.3855618251
                                },
                                {
                                    "index": 868,
                                    "loss": 0.385461876
                                },
                                {
                                    "index": 869,
                                    "loss": 0.3853621941
                                },
                                {
                                    "index": 870,
                                    "loss": 0.3852627786
                                },
                                {
                                    "index": 871,
                                    "loss": 0.3851636284
                                },
                                {
                                    "index": 872,
                                    "loss": 0.3850647427
                                },
                                {
                                    "index": 873,
                                    "loss": 0.3849661206
                                },
                                {
                                    "index": 874,
                                    "loss": 0.3848677612
                                },
                                {
                                    "index": 875,
                                    "loss": 0.3847696636
                                },
                                {
                                    "index": 876,
                                    "loss": 0.384671827
                                },
                                {
                                    "index": 877,
                                    "loss": 0.3845742504
                                },
                                {
                                    "index": 878,
                                    "loss": 0.3844769329
                                }
                            ],
                            "metadata": {
                                "name": "Loss Curve",
                                "columns": [
                                    "index",
                                    "loss"
                                ],
                                "n_rows": 879,
                                "n_columns": 2,
                                "features": null,
                                "target": null,
                                "column_info": null,
                                "skip_column_info": true
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 862.542469512925,
                    "y": 654.1885823862671
                }
            },
            {
                "id": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95",
                "name": "Decision Tree",
                "name_count": 0,
                "type": "node-prediction-decision-tree",
                "parameters": {
                    "features": [],
                    "target": "",
                    "criterion": "gini",
                    "max_depth": 3,
                    "min_samples_split": 2,
                    "min_samples_leaf": 1
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
                    "x": 863.925145119402,
                    "y": 791.7162423096868
                }
            },
            {
                "id": "node-prediction-adaboost-8ffef7a2-b0e2-4c2e-ab04-98573fd6c149",
                "name": "AdaBoost",
                "name_count": 0,
                "type": "node-prediction-adaboost",
                "parameters": {
                    "n_estimators": 50,
                    "learning_rate": 1,
                    "loss": "Linear",
                    "fixed_seed": false,
                    "random_state": 0
                },
                "outputs": {
                    "model": {
                        "name": "Model",
                        "type": "output-model",
                        "display_value": {
                            "model": "AdaBoost model trained."
                        },
                        "value": {}
                    },
                    "learner": {
                        "name": "Learner",
                        "type": "output-dict",
                        "display_value": {
                            "name": "AdaBoost",
                            "parameters": {
                                "n_estimators": 50,
                                "learning_rate": 1,
                                "loss": "Linear",
                                "random_state": null
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 861.5298125040699,
                    "y": 932.2363168308895
                }
            },
            {
                "id": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "name": "Predictions",
                "name_count": 0,
                "type": "node-evaluation-predictions",
                "parameters": {},
                "outputs": {
                    "evaluation_results": {
                        "name": "Evaluation Results",
                        "type": "output-evaluation-results",
                        "display_value": {
                            "Logistic Regression": {
                                "model": "Logistic Regression",
                                "scores": {
                                    "accuracy": 0.96,
                                    "precision": 0.9657142857142857,
                                    "recall": 0.96,
                                    "f1": 0.9604273504273505,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "prediction",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            19,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            17,
                                            2
                                        ],
                                        [
                                            0,
                                            0,
                                            12
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": {
                                    "type": "multiclass",
                                    "data": [
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.05263157894736842,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Setosa"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.05263157894736842,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Versicolor"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.08333333333333333,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Virginica"
                                        }
                                    ]
                                }
                            },
                            "Linear Regression": {
                                "model": "Linear Regression",
                                "scores": {
                                    "accuracy": null,
                                    "precision": null,
                                    "recall": null,
                                    "f1": null,
                                    "nmse": 0.04374221177102531,
                                    "r2": 0.9271448837924295
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "prediction",
                                "confusion_matrix": {
                                    "data": [],
                                    "labels": []
                                },
                                "roc_curve": null
                            },
                            "Support Vector Machine": {
                                "model": "Support Vector Machine",
                                "scores": {
                                    "accuracy": 0.96,
                                    "precision": 0.9657142857142857,
                                    "recall": 0.96,
                                    "f1": 0.9604273504273505,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "prediction",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            19,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            17,
                                            2
                                        ],
                                        [
                                            0,
                                            0,
                                            12
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": null
                            },
                            "Gradient Boosting": {
                                "model": "Gradient Boosting",
                                "scores": {
                                    "accuracy": 0.96,
                                    "precision": 0.9657142857142857,
                                    "recall": 0.96,
                                    "f1": 0.9604273504273505,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "prediction",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            19,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            17,
                                            2
                                        ],
                                        [
                                            0,
                                            0,
                                            12
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": {
                                    "type": "multiclass",
                                    "data": [
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                0.03225806451612903,
                                                0.2903225806451613,
                                                0.3870967741935484,
                                                0.5161290322580645,
                                                0.6129032258064516,
                                                0.6774193548387096,
                                                0.9032258064516129,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.9473684210526315,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1
                                            ],
                                            "auc": 0.9999999999999999,
                                            "class": "Setosa"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0.0967741935483871,
                                                0.0967741935483871,
                                                0.16129032258064516,
                                                0.7419354838709677,
                                                0.967741935483871,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.05263157894736842,
                                                0.21052631578947367,
                                                0.2631578947368421,
                                                0.42105263157894735,
                                                0.8421052631578947,
                                                0.8947368421052632,
                                                0.8947368421052632,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1
                                            ],
                                            "auc": 0.9898132427843803,
                                            "class": "Versicolor"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0.02631578947368421,
                                                0.02631578947368421,
                                                0.05263157894736842,
                                                0.05263157894736842,
                                                0.07894736842105263,
                                                0.2894736842105263,
                                                0.3684210526315789,
                                                0.39473684210526316,
                                                0.47368421052631576,
                                                0.5,
                                                0.9736842105263158,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.08333333333333333,
                                                0.6666666666666666,
                                                0.75,
                                                0.75,
                                                0.8333333333333334,
                                                0.8333333333333334,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1
                                            ],
                                            "auc": 0.9890350877192983,
                                            "class": "Virginica"
                                        }
                                    ]
                                }
                            },
                            "Neural Network": {
                                "model": "Neural Network",
                                "scores": {
                                    "accuracy": null,
                                    "precision": null,
                                    "recall": null,
                                    "f1": null,
                                    "nmse": 0.5978917447493103,
                                    "r2": 0.004177640324266818
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "prediction",
                                "confusion_matrix": {
                                    "data": [],
                                    "labels": []
                                },
                                "roc_curve": null
                            },
                            "Decision Tree": {
                                "model": "Decision Tree",
                                "scores": {
                                    "accuracy": 0.96,
                                    "precision": 0.9657142857142857,
                                    "recall": 0.96,
                                    "f1": 0.9604273504273505,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "prediction",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            19,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            17,
                                            2
                                        ],
                                        [
                                            0,
                                            0,
                                            12
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": {
                                    "type": "multiclass",
                                    "data": [
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Setosa"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0.03225806451612903,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.8947368421052632,
                                                0.8947368421052632,
                                                1
                                            ],
                                            "auc": 0.9456706281833618,
                                            "class": "Versicolor"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0.05263157894736842,
                                                0.05263157894736842,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.9166666666666666,
                                                1,
                                                1
                                            ],
                                            "auc": 0.9714912280701755,
                                            "class": "Virginica"
                                        }
                                    ]
                                }
                            },
                            "AdaBoost": {
                                "model": "AdaBoost",
                                "scores": {
                                    "accuracy": null,
                                    "precision": null,
                                    "recall": null,
                                    "f1": null,
                                    "nmse": 0.1585609467455621,
                                    "r2": 0.7359078168794768
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "prediction",
                                "confusion_matrix": {
                                    "data": [],
                                    "labels": []
                                },
                                "roc_curve": null
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
                                    "sepal.length": 5.7,
                                    "sepal.width": 2.8,
                                    "petal.length": 4.1,
                                    "petal.width": 1.3,
                                    "variety (Target)": "Versicolor",
                                    "Logistic Regression": "Versicolor",
                                    "Linear Regression": 1.1920597903,
                                    "Support Vector Machine": "Versicolor",
                                    "Gradient Boosting": "Versicolor",
                                    "Neural Network": 0.9098688511,
                                    "Decision Tree": "Versicolor",
                                    "AdaBoost": 1.5230769231
                                },
                                {
                                    "sepal.length": 6.4,
                                    "sepal.width": 2.9,
                                    "petal.length": 4.3,
                                    "petal.width": 1.3,
                                    "variety (Target)": "Versicolor",
                                    "Logistic Regression": "Versicolor",
                                    "Linear Regression": 1.150336385,
                                    "Support Vector Machine": "Versicolor",
                                    "Gradient Boosting": "Versicolor",
                                    "Neural Network": 0.9106617545,
                                    "Decision Tree": "Versicolor",
                                    "AdaBoost": 1.5230769231
                                },
                                {
                                    "sepal.length": 7.7,
                                    "sepal.width": 3.8,
                                    "petal.length": 6.7,
                                    "petal.width": 2.2,
                                    "variety (Target)": "Virginica",
                                    "Logistic Regression": "Virginica",
                                    "Linear Regression": 2.087589029,
                                    "Support Vector Machine": "Virginica",
                                    "Gradient Boosting": "Virginica",
                                    "Neural Network": 0.9149483433,
                                    "Decision Tree": "Virginica",
                                    "AdaBoost": 1.5230769231
                                },
                                {
                                    "sepal.length": 6.3,
                                    "sepal.width": 2.5,
                                    "petal.length": 4.9,
                                    "petal.width": 1.5,
                                    "variety (Target)": "Versicolor",
                                    "Logistic Regression": "Versicolor",
                                    "Linear Regression": 1.4393849865,
                                    "Support Vector Machine": "Versicolor",
                                    "Gradient Boosting": "Versicolor",
                                    "Neural Network": 0.9116515639,
                                    "Decision Tree": "Versicolor",
                                    "AdaBoost": 1.5230769231
                                },
                                {
                                    "sepal.length": 4.6,
                                    "sepal.width": 3.2,
                                    "petal.length": 1.4,
                                    "petal.width": 0.2,
                                    "variety (Target)": "Setosa",
                                    "Logistic Regression": "Setosa",
                                    "Linear Regression": 0.0016809717,
                                    "Support Vector Machine": "Setosa",
                                    "Gradient Boosting": "Setosa",
                                    "Neural Network": 0.9045372415,
                                    "Decision Tree": "Setosa",
                                    "AdaBoost": 0
                                }
                            ],
                            "metadata": {
                                "name": "Predictions",
                                "columns": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width",
                                    "variety (Target)",
                                    "Logistic Regression",
                                    "Linear Regression",
                                    "Support Vector Machine",
                                    "Gradient Boosting",
                                    "Neural Network",
                                    "Decision Tree",
                                    "AdaBoost"
                                ],
                                "n_rows": 50,
                                "n_columns": 12,
                                "features": null,
                                "target": null,
                                "column_info": null,
                                "skip_column_info": true
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 1181.7287628226468,
                    "y": 218.40426932026253
                }
            },
            {
                "id": "node-evaluation-confusion-matrix-26a8e4af-143a-455f-ba19-796b8c51ed7a",
                "name": "Confusion Matrix",
                "name_count": 0,
                "type": "node-evaluation-confusion-matrix",
                "parameters": {},
                "outputs": {
                    "confusion_matrix": {
                        "name": "Confusion Matrix",
                        "type": "output-dict",
                        "display_value": {
                            "Logistic Regression": {
                                "data": [
                                    [
                                        19,
                                        0,
                                        0
                                    ],
                                    [
                                        0,
                                        17,
                                        2
                                    ],
                                    [
                                        0,
                                        0,
                                        12
                                    ]
                                ],
                                "labels": [
                                    "Setosa",
                                    "Versicolor",
                                    "Virginica"
                                ]
                            },
                            "Linear Regression": {
                                "data": [],
                                "labels": []
                            },
                            "Support Vector Machine": {
                                "data": [
                                    [
                                        19,
                                        0,
                                        0
                                    ],
                                    [
                                        0,
                                        17,
                                        2
                                    ],
                                    [
                                        0,
                                        0,
                                        12
                                    ]
                                ],
                                "labels": [
                                    "Setosa",
                                    "Versicolor",
                                    "Virginica"
                                ]
                            },
                            "Gradient Boosting": {
                                "data": [
                                    [
                                        19,
                                        0,
                                        0
                                    ],
                                    [
                                        0,
                                        17,
                                        2
                                    ],
                                    [
                                        0,
                                        0,
                                        12
                                    ]
                                ],
                                "labels": [
                                    "Setosa",
                                    "Versicolor",
                                    "Virginica"
                                ]
                            },
                            "Neural Network": {
                                "data": [],
                                "labels": []
                            },
                            "Decision Tree": {
                                "data": [
                                    [
                                        19,
                                        0,
                                        0
                                    ],
                                    [
                                        0,
                                        17,
                                        2
                                    ],
                                    [
                                        0,
                                        0,
                                        12
                                    ]
                                ],
                                "labels": [
                                    "Setosa",
                                    "Versicolor",
                                    "Virginica"
                                ]
                            },
                            "AdaBoost": {
                                "data": [],
                                "labels": []
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 1473.645827065355,
                    "y": 219.47569670069018
                }
            },
            {
                "id": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "name": "Test and Score",
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
                            "Logistic Regression": {
                                "model": "Logistic Regression",
                                "scores": {
                                    "accuracy": 0.9199999999999999,
                                    "precision": 0.9273333333333333,
                                    "recall": 0.9199999999999999,
                                    "f1": 0.9196825396825397,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "cross_validation",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            13,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            16,
                                            2
                                        ],
                                        [
                                            0,
                                            0,
                                            19
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": {
                                    "type": "multiclass",
                                    "data": [
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.07692307692307693,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Setosa"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                0.0625,
                                                0.0625,
                                                0.15625,
                                                0.15625,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.05555555555555555,
                                                0.8888888888888888,
                                                0.8888888888888888,
                                                0.9444444444444444,
                                                0.9444444444444444,
                                                1,
                                                1
                                            ],
                                            "auc": 0.9878472222222222,
                                            "class": "Versicolor"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                0.03225806451612903,
                                                0.03225806451612903,
                                                0.06451612903225806,
                                                0.06451612903225806,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.05263157894736842,
                                                0.7368421052631579,
                                                0.7368421052631579,
                                                0.8947368421052632,
                                                0.8947368421052632,
                                                1,
                                                1
                                            ],
                                            "auc": 0.9881154499151104,
                                            "class": "Virginica"
                                        }
                                    ]
                                }
                            },
                            "Linear Regression": {
                                "model": "Linear Regression",
                                "scores": {
                                    "accuracy": null,
                                    "precision": null,
                                    "recall": null,
                                    "f1": null,
                                    "nmse": 0.07003576645225702,
                                    "r2": 0.8869624266878621
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "cross_validation",
                                "confusion_matrix": {
                                    "data": [],
                                    "labels": []
                                },
                                "roc_curve": null
                            },
                            "Support Vector Machine": {
                                "model": "Support Vector Machine",
                                "scores": {
                                    "accuracy": 0.9,
                                    "precision": 0.9113333333333333,
                                    "recall": 0.9,
                                    "f1": 0.8993650793650794,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "cross_validation",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            13,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            16,
                                            2
                                        ],
                                        [
                                            0,
                                            1,
                                            18
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": null
                            },
                            "Gradient Boosting": {
                                "model": "Gradient Boosting",
                                "scores": {
                                    "accuracy": 0.9400000000000001,
                                    "precision": 0.944,
                                    "recall": 0.9400000000000001,
                                    "f1": 0.9396825396825397,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "cross_validation",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            13,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            18,
                                            0
                                        ],
                                        [
                                            0,
                                            0,
                                            19
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": {
                                    "type": "multiclass",
                                    "data": [
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0.05405405405405406,
                                                0.4594594594594595,
                                                0.8918918918918919,
                                                0.9459459459459459,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Setosa"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0.0625,
                                                0.09375,
                                                0.5,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.05555555555555555,
                                                0.8888888888888888,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Versicolor"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0.06451612903225806,
                                                0.5483870967741935,
                                                0.967741935483871,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                0.8421052631578947,
                                                0.8947368421052632,
                                                1,
                                                1,
                                                1,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Virginica"
                                        }
                                    ]
                                }
                            },
                            "Decision Tree": {
                                "model": "Decision Tree",
                                "scores": {
                                    "accuracy": 0.9399999999999998,
                                    "precision": 0.952,
                                    "recall": 0.9399999999999998,
                                    "f1": 0.9384761904761906,
                                    "nmse": null,
                                    "r2": null
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "cross_validation",
                                "confusion_matrix": {
                                    "data": [
                                        [
                                            13,
                                            0,
                                            0
                                        ],
                                        [
                                            0,
                                            18,
                                            0
                                        ],
                                        [
                                            0,
                                            0,
                                            19
                                        ]
                                    ],
                                    "labels": [
                                        "Setosa",
                                        "Versicolor",
                                        "Virginica"
                                    ]
                                },
                                "roc_curve": {
                                    "type": "multiclass",
                                    "data": [
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Setosa"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Versicolor"
                                        },
                                        {
                                            "fpr": [
                                                0,
                                                0,
                                                1
                                            ],
                                            "tpr": [
                                                0,
                                                1,
                                                1
                                            ],
                                            "auc": 1,
                                            "class": "Virginica"
                                        }
                                    ]
                                }
                            },
                            "AdaBoost": {
                                "model": "AdaBoost",
                                "scores": {
                                    "accuracy": null,
                                    "precision": null,
                                    "recall": null,
                                    "f1": null,
                                    "nmse": 0.18936771925058915,
                                    "r2": 0.6895219086401708
                                },
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "evaluation_type": "cross_validation",
                                "confusion_matrix": {
                                    "data": [],
                                    "labels": []
                                },
                                "roc_curve": null
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
                                    "sepal.length": 6.7,
                                    "sepal.width": 3,
                                    "petal.length": 5,
                                    "petal.width": 1.7,
                                    "target": "Versicolor",
                                    "Logistic Regression": "Virginica",
                                    "Linear Regression": 1.5146831597,
                                    "Support Vector Machine": "Virginica",
                                    "Gradient Boosting": "Virginica",
                                    "Decision Tree": "Virginica",
                                    "AdaBoost": 2,
                                    "Fold": 1
                                },
                                {
                                    "sepal.length": 5.5,
                                    "sepal.width": 2.3,
                                    "petal.length": 4,
                                    "petal.width": 1.3,
                                    "target": "Versicolor",
                                    "Logistic Regression": "Versicolor",
                                    "Linear Regression": 1.2747892753,
                                    "Support Vector Machine": "Versicolor",
                                    "Gradient Boosting": "Versicolor",
                                    "Decision Tree": "Versicolor",
                                    "AdaBoost": 0.6923076923,
                                    "Fold": 1
                                },
                                {
                                    "sepal.length": 5.2,
                                    "sepal.width": 4.1,
                                    "petal.length": 1.5,
                                    "petal.width": 0.1,
                                    "target": "Setosa",
                                    "Logistic Regression": "Setosa",
                                    "Linear Regression": -0.2120568663,
                                    "Support Vector Machine": "Setosa",
                                    "Gradient Boosting": "Setosa",
                                    "Decision Tree": "Setosa",
                                    "AdaBoost": 0.6923076923,
                                    "Fold": 1
                                },
                                {
                                    "sepal.length": 5.7,
                                    "sepal.width": 3,
                                    "petal.length": 4.2,
                                    "petal.width": 1.2,
                                    "target": "Versicolor",
                                    "Logistic Regression": "Versicolor",
                                    "Linear Regression": 1.1548875015,
                                    "Support Vector Machine": "Versicolor",
                                    "Gradient Boosting": "Versicolor",
                                    "Decision Tree": "Versicolor",
                                    "AdaBoost": 0.6923076923,
                                    "Fold": 1
                                },
                                {
                                    "sepal.length": 5.2,
                                    "sepal.width": 3.5,
                                    "petal.length": 1.5,
                                    "petal.width": 0.2,
                                    "target": "Setosa",
                                    "Logistic Regression": "Setosa",
                                    "Linear Regression": -0.0918091026,
                                    "Support Vector Machine": "Setosa",
                                    "Gradient Boosting": "Setosa",
                                    "Decision Tree": "Setosa",
                                    "AdaBoost": 0.6923076923,
                                    "Fold": 1
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
                                    "Logistic Regression",
                                    "Linear Regression",
                                    "Support Vector Machine",
                                    "Gradient Boosting",
                                    "Decision Tree",
                                    "AdaBoost",
                                    "Fold"
                                ],
                                "n_rows": 50,
                                "n_columns": 12,
                                "features": null,
                                "target": null,
                                "column_info": null,
                                "skip_column_info": true
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 1186.4416449741298,
                    "y": 436.01959023851424
                }
            },
            {
                "id": "node-evaluation-roc-curve-77da7e55-b906-4f1c-8a46-ccdf5b8b50d7",
                "name": "ROC Curve",
                "name_count": 0,
                "type": "node-evaluation-roc-curve",
                "parameters": {},
                "outputs": {
                    "roc_curve": {
                        "name": "ROC Curve",
                        "type": "output-dict",
                        "display_value": {
                            "Logistic Regression": {
                                "type": "multiclass",
                                "data": [
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0,
                                            0.5641025641025641,
                                            0.6153846153846154,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            0.09090909090909091,
                                            1,
                                            1,
                                            1,
                                            1
                                        ],
                                        "auc": 1,
                                        "class": "Setosa"
                                    },
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0,
                                            0.058823529411764705,
                                            0.058823529411764705,
                                            0.17647058823529413,
                                            0.23529411764705882,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            0.0625,
                                            0.9375,
                                            0.9375,
                                            1,
                                            1,
                                            1,
                                            1
                                        ],
                                        "auc": 0.9963235294117646,
                                        "class": "Versicolor"
                                    },
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0.037037037037037035,
                                            0.037037037037037035,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            0.043478260869565216,
                                            0.6521739130434783,
                                            0.7391304347826086,
                                            0.9130434782608695,
                                            0.9130434782608695,
                                            1,
                                            1
                                        ],
                                        "auc": 0.996779388083736,
                                        "class": "Virginica"
                                    }
                                ]
                            },
                            "Gradient Boosting": {
                                "type": "multiclass",
                                "data": [
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0.02564102564102564,
                                            0.10256410256410256,
                                            0.1794871794871795,
                                            0.23076923076923078,
                                            0.2564102564102564,
                                            0.3333333333333333,
                                            0.38461538461538464,
                                            0.4358974358974359,
                                            0.48717948717948717,
                                            0.6410256410256411,
                                            0.6923076923076923,
                                            0.7948717948717948,
                                            0.9487179487179487,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1
                                        ],
                                        "auc": 1,
                                        "class": "Setosa"
                                    },
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0.14705882352941177,
                                            0.20588235294117646,
                                            0.5294117647058824,
                                            0.5882352941176471,
                                            0.7647058823529411,
                                            0.8529411764705882,
                                            0.9117647058823529,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            0.0625,
                                            0.25,
                                            0.5,
                                            0.625,
                                            0.8125,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1
                                        ],
                                        "auc": 1,
                                        "class": "Versicolor"
                                    },
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0.1111111111111111,
                                            0.2222222222222222,
                                            0.2962962962962963,
                                            0.4444444444444444,
                                            0.5555555555555556,
                                            0.5925925925925926,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            0.043478260869565216,
                                            0.13043478260869565,
                                            0.21739130434782608,
                                            0.2608695652173913,
                                            0.5217391304347826,
                                            0.7391304347826086,
                                            0.8260869565217391,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1
                                        ],
                                        "auc": 1,
                                        "class": "Virginica"
                                    }
                                ]
                            },
                            "Decision Tree": {
                                "type": "multiclass",
                                "data": [
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            1,
                                            1
                                        ],
                                        "auc": 1,
                                        "class": "Setosa"
                                    },
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0.058823529411764705,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            0.9375,
                                            1,
                                            1
                                        ],
                                        "auc": 0.9981617647058824,
                                        "class": "Versicolor"
                                    },
                                    {
                                        "fpr": [
                                            0,
                                            0,
                                            0.037037037037037035,
                                            1
                                        ],
                                        "tpr": [
                                            0,
                                            0.9130434782608695,
                                            1,
                                            1
                                        ],
                                        "auc": 0.9983896940418681,
                                        "class": "Virginica"
                                    }
                                ]
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 1479.1842834042357,
                    "y": 436.2562091187647
                }
            },
            {
                "id": "node-visualization-tree-viewer-e2f3d24b-e5d7-4e21-a02b-b02d4727b3a0",
                "name": "Tree Viewer",
                "name_count": 0,
                "type": "node-visualization-tree-viewer",
                "parameters": {},
                "outputs": {
                    "tree": {
                        "name": "Tree",
                        "type": "output-dict",
                        "display_value": {
                            "nodes": [
                                {
                                    "id": "0",
                                    "data": {
                                        "label": "petal.length <= 2.45",
                                        "type": "decision",
                                        "samples": 100,
                                        "impurity": 0.6648000000000001
                                    },
                                    "type": "tree-node-decision"
                                },
                                {
                                    "id": "1",
                                    "data": {
                                        "label": "Class: Setosa (1.00)",
                                        "type": "leaf",
                                        "samples": 36,
                                        "impurity": 0
                                    },
                                    "type": "tree-node-leaf"
                                },
                                {
                                    "id": "2",
                                    "data": {
                                        "label": "petal.width <= 1.75",
                                        "type": "decision",
                                        "samples": 64,
                                        "impurity": 0.498046875
                                    },
                                    "type": "tree-node-decision"
                                },
                                {
                                    "id": "3",
                                    "data": {
                                        "label": "petal.length <= 5.35",
                                        "type": "decision",
                                        "samples": 33,
                                        "impurity": 0.1652892561983471
                                    },
                                    "type": "tree-node-decision"
                                },
                                {
                                    "id": "4",
                                    "data": {
                                        "label": "Class: Versicolor (0.97)",
                                        "type": "leaf",
                                        "samples": 31,
                                        "impurity": 0.06243496357960454
                                    },
                                    "type": "tree-node-leaf"
                                },
                                {
                                    "id": "5",
                                    "data": {
                                        "label": "Class: Virginica (1.00)",
                                        "type": "leaf",
                                        "samples": 2,
                                        "impurity": 0
                                    },
                                    "type": "tree-node-leaf"
                                },
                                {
                                    "id": "6",
                                    "data": {
                                        "label": "Class: Virginica (1.00)",
                                        "type": "leaf",
                                        "samples": 31,
                                        "impurity": 0
                                    },
                                    "type": "tree-node-leaf"
                                }
                            ],
                            "edges": [
                                {
                                    "id": "e0-1",
                                    "source": "0",
                                    "target": "1",
                                    "label": "True",
                                    "type": "default"
                                },
                                {
                                    "id": "e0-2",
                                    "source": "0",
                                    "target": "2",
                                    "label": "False",
                                    "type": "default"
                                },
                                {
                                    "id": "e2-3",
                                    "source": "2",
                                    "target": "3",
                                    "label": "True",
                                    "type": "default"
                                },
                                {
                                    "id": "e3-4",
                                    "source": "3",
                                    "target": "4",
                                    "label": "True",
                                    "type": "default"
                                },
                                {
                                    "id": "e3-5",
                                    "source": "3",
                                    "target": "5",
                                    "label": "False",
                                    "type": "default"
                                },
                                {
                                    "id": "e2-6",
                                    "source": "2",
                                    "target": "6",
                                    "label": "False",
                                    "type": "default"
                                }
                            ],
                            "model_type": "DecisionTreeClassifier",
                            "feature_names": [
                                "sepal.length",
                                "sepal.width",
                                "petal.length",
                                "petal.width"
                            ],
                            "target_name": "variety"
                        }
                    }
                },
                "position": {
                    "x": 1148.2509222335211,
                    "y": 791.3188860007194
                }
            },
            {
                "id": "node-visualization-bar-plot-4246a21d-1b6f-40a8-ae10-ab754779f74c",
                "name": "Bar Plot",
                "name_count": 0,
                "type": "node-visualization-bar-plot",
                "parameters": {
                    "x": "sepal.width",
                    "y": "Linear Regression"
                },
                "outputs": {
                    "visualization": {
                        "name": "Visualization",
                        "type": "output-dict",
                        "display_value": {
                            "data": [
                                {
                                    "name": 2.2,
                                    "value": 3.7570870247
                                },
                                {
                                    "name": 2.3,
                                    "value": 1.2747892753
                                },
                                {
                                    "name": 2.4,
                                    "value": 1.033780549
                                },
                                {
                                    "name": 2.5,
                                    "value": 1.5689852165
                                },
                                {
                                    "name": 2.6,
                                    "value": 6.2328120752
                                },
                                {
                                    "name": 2.7,
                                    "value": 6.1879391795
                                },
                                {
                                    "name": 2.8,
                                    "value": 8.5404811702
                                },
                                {
                                    "name": 2.9,
                                    "value": 2.9020077644000004
                                },
                                {
                                    "name": 3,
                                    "value": 12.377630704600001
                                },
                                {
                                    "name": 3.1,
                                    "value": 3.7609950174
                                },
                                {
                                    "name": 3.2,
                                    "value": 3.1160920651
                                },
                                {
                                    "name": 3.3,
                                    "value": 1.4555872888
                                },
                                {
                                    "name": 3.4,
                                    "value": 0.177537212
                                },
                                {
                                    "name": 3.5,
                                    "value": -0.4761585733
                                },
                                {
                                    "name": 3.6,
                                    "value": 2.181805791
                                },
                                {
                                    "name": 3.8,
                                    "value": 2.0005080381
                                },
                                {
                                    "name": 4.1,
                                    "value": -0.2120568663
                                },
                                {
                                    "name": 4.4,
                                    "value": -0.1398101552
                                }
                            ],
                            "metadata": {
                                "x": "sepal.width",
                                "y": "Linear Regression"
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 1477.6762258653262,
                    "y": 643.4211652522055
                }
            }
        ],
        "edges": [
            {
                "id": "node-data-file-331cadff-76e0-4031-ae67-f31ef0c77d74-node-transform-impute-ef57cf47-b0b3-45f2-9011-f3778ce9b96b-4e8fc9a9-03a7-4c88-8be6-fdb5983fc404",
                "source": "node-data-file-331cadff-76e0-4031-ae67-f31ef0c77d74",
                "target": "node-transform-impute-ef57cf47-b0b3-45f2-9011-f3778ce9b96b",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-transform-impute-ef57cf47-b0b3-45f2-9011-f3778ce9b96b-node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-8e2950c4-1f28-4b4e-8135-971d833f3e10",
                "source": "node-transform-impute-ef57cf47-b0b3-45f2-9011-f3778ce9b96b",
                "target": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-prediction-logistic-regression-4da3c2eb-32bd-4f90-abea-4fd6f6da6f3d-b7614b85-33b4-4610-9d95-c08391de29ba",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-prediction-logistic-regression-4da3c2eb-32bd-4f90-abea-4fd6f6da6f3d",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-prediction-linear-regression-c31859af-0e55-4749-bb4f-2508d694fe4d-672e2f42-844c-4433-897a-e66c6dbc80bf",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-prediction-linear-regression-c31859af-0e55-4749-bb4f-2508d694fe4d",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-prediction-svm-65db61ff-a9b9-45e7-a639-cf91141233ac-7d111c4e-4cbc-4af5-96e2-0f0c7b92b4a1",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-prediction-svm-65db61ff-a9b9-45e7-a639-cf91141233ac",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-prediction-gradient-boosting-dc5175e6-9f10-46db-a48f-2705fdf291d1-8de620e9-df48-4790-b176-a9825eea328d",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-prediction-gradient-boosting-dc5175e6-9f10-46db-a48f-2705fdf291d1",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-supervised-neural-network-f99522a4-3a6b-46be-9b9e-84328154bf70-753ac3e0-d4c2-4acf-a5e2-5b6802453ce6",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-supervised-neural-network-f99522a4-3a6b-46be-9b9e-84328154bf70",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95-5937fea2-c12e-4401-ba6b-01929580849f",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-prediction-adaboost-8ffef7a2-b0e2-4c2e-ab04-98573fd6c149-815c9031-cc78-45f1-8391-961dc8f1c25b",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-prediction-adaboost-8ffef7a2-b0e2-4c2e-ab04-98573fd6c149",
                "sourceHandle": "train",
                "targetHandle": "data"
            },
            {
                "id": "node-prediction-logistic-regression-4da3c2eb-32bd-4f90-abea-4fd6f6da6f3d-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-c43f0097-d43a-432f-8da9-4a4cd16bf2c3",
                "source": "node-prediction-logistic-regression-4da3c2eb-32bd-4f90-abea-4fd6f6da6f3d",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-linear-regression-c31859af-0e55-4749-bb4f-2508d694fe4d-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-1b351e63-b952-4c8e-8d05-7266b27ced79",
                "source": "node-prediction-linear-regression-c31859af-0e55-4749-bb4f-2508d694fe4d",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-svm-65db61ff-a9b9-45e7-a639-cf91141233ac-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-75b07889-0b9e-43f2-acfa-d26fe375d783",
                "source": "node-prediction-svm-65db61ff-a9b9-45e7-a639-cf91141233ac",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-gradient-boosting-dc5175e6-9f10-46db-a48f-2705fdf291d1-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-31106b3e-e0e3-4c59-b17a-2310587f2be6",
                "source": "node-prediction-gradient-boosting-dc5175e6-9f10-46db-a48f-2705fdf291d1",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-supervised-neural-network-f99522a4-3a6b-46be-9b9e-84328154bf70-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-6d7479fd-d6e8-42a2-b019-02ad4b596afd",
                "source": "node-supervised-neural-network-f99522a4-3a6b-46be-9b9e-84328154bf70",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-adaboost-8ffef7a2-b0e2-4c2e-ab04-98573fd6c149-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-fd139cef-46aa-4015-bc88-9dc6bf44b8c7",
                "source": "node-prediction-adaboost-8ffef7a2-b0e2-4c2e-ab04-98573fd6c149",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-node-evaluation-confusion-matrix-26a8e4af-143a-455f-ba19-796b8c51ed7a-b5e60108-0750-4c06-85db-711f2f46e5d5",
                "source": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "target": "node-evaluation-confusion-matrix-26a8e4af-143a-455f-ba19-796b8c51ed7a",
                "sourceHandle": "evaluation_results",
                "targetHandle": "evaluation_results"
            },
            {
                "id": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-363a418c-336c-4565-8473-f37b66e1f7de",
                "source": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b-1f028d97-8c58-4d07-815b-e9db4067423c",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-evaluation-predictions-8c96c63d-4d59-4f9a-965c-8cb84d8c279b",
                "sourceHandle": "test",
                "targetHandle": "data"
            },
            {
                "id": "node-prediction-logistic-regression-4da3c2eb-32bd-4f90-abea-4fd6f6da6f3d-node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-c94b131e-90dd-4ea7-843c-3f86c93c9cf5",
                "source": "node-prediction-logistic-regression-4da3c2eb-32bd-4f90-abea-4fd6f6da6f3d",
                "target": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-linear-regression-c31859af-0e55-4749-bb4f-2508d694fe4d-node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-40beca56-5692-4d7e-8994-fb90cea9fe82",
                "source": "node-prediction-linear-regression-c31859af-0e55-4749-bb4f-2508d694fe4d",
                "target": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-svm-65db61ff-a9b9-45e7-a639-cf91141233ac-node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-fab7ee56-3bee-4eea-b9da-81326d949176",
                "source": "node-prediction-svm-65db61ff-a9b9-45e7-a639-cf91141233ac",
                "target": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-gradient-boosting-dc5175e6-9f10-46db-a48f-2705fdf291d1-node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-6acbeaf2-2a47-488e-9869-4090766c66be",
                "source": "node-prediction-gradient-boosting-dc5175e6-9f10-46db-a48f-2705fdf291d1",
                "target": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95-node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-db4a461c-dbd6-4781-acf2-5f0ad6d804f6",
                "source": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95",
                "target": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-prediction-adaboost-8ffef7a2-b0e2-4c2e-ab04-98573fd6c149-node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-24581e5b-0687-43e4-bdf3-670999697292",
                "source": "node-prediction-adaboost-8ffef7a2-b0e2-4c2e-ab04-98573fd6c149",
                "target": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209-node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-f1166e06-0725-4543-a3a4-8df7c2cbd479",
                "source": "node-data-train-test-split-81b1f58c-fcb5-413d-abfe-d6c60ae48209",
                "target": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "sourceHandle": "test",
                "targetHandle": "data"
            },
            {
                "id": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-node-evaluation-roc-curve-77da7e55-b906-4f1c-8a46-ccdf5b8b50d7-1597113b-887e-4344-92a7-e71c93fea2bb",
                "source": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "target": "node-evaluation-roc-curve-77da7e55-b906-4f1c-8a46-ccdf5b8b50d7",
                "sourceHandle": "evaluation_results",
                "targetHandle": "evaluation_results"
            },
            {
                "id": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95-node-visualization-tree-viewer-e2f3d24b-e5d7-4e21-a02b-b02d4727b3a0-b7232b34-ca4f-41ea-870b-6aa94a13948a",
                "source": "node-prediction-decision-tree-e76c8ce6-669c-4e25-8892-d5b0b140fd95",
                "target": "node-visualization-tree-viewer-e2f3d24b-e5d7-4e21-a02b-b02d4727b3a0",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7-node-visualization-bar-plot-4246a21d-1b6f-40a8-ae10-ab754779f74c-9df483b8-84a6-4ce0-a1b4-a826473db7a3",
                "source": "node-evaluation-test-and-score-52fc93e4-12bc-4118-b53d-67d24fc40ff7",
                "target": "node-visualization-bar-plot-4246a21d-1b6f-40a8-ae10-ab754779f74c",
                "sourceHandle": "predictions",
                "targetHandle": "data"
            }
        ],
        "viewport": {
            "x": -25.022989556553853,
            "y": -31.24902102861654,
            "zoom": 0.9241563170326493
        }
    }
};