export const exampleFeatureExplain = {
    "name": "Feature Explain",
    "description": "Demonstrates how to use the Explain nodes to explain the features of a model using SHAP and LIME.",
    "cover": "/assets/playgroundExamples/featureExplain.png",
    "graph": {
        "nodes": [
            {
                "id": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c",
                "name": "File",
                "name_count": 0,
                "type": "node-data-file",
                "parameters": {
                    "file_name": "wine.csv",
                    "file_label": "Wine Dataset",
                    "features": [],
                    "target": "wine",
                    "column_info": {
                        "wine": {
                            "name": "wine",
                            "type": "numeric",
                            "class": "target"
                        },
                        "alcohol": {
                            "name": "alcohol",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "malic.acid": {
                            "name": "malic.acid",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "ash": {
                            "name": "ash",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "acl": {
                            "name": "acl",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "mg": {
                            "name": "mg",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "phenols": {
                            "name": "phenols",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "flavanoids": {
                            "name": "flavanoids",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "nonflavanoid.phenols": {
                            "name": "nonflavanoid.phenols",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "proanth": {
                            "name": "proanth",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "color.int": {
                            "name": "color.int",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "hue": {
                            "name": "hue",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "od": {
                            "name": "od",
                            "type": "numeric",
                            "class": "feature"
                        },
                        "proline": {
                            "name": "proline",
                            "type": "numeric",
                            "class": "feature"
                        }
                    }
                },
                "outputs": {
                    "data": {
                        "name": "Data",
                        "type": "output-file-data",
                        "display_value": {
                            "data": [
                                {
                                    "wine": 1,
                                    "alcohol": 14.23,
                                    "malic.acid": 1.71,
                                    "ash": 2.43,
                                    "acl": 15.6,
                                    "mg": 127,
                                    "phenols": 2.8,
                                    "flavanoids": 3.06,
                                    "nonflavanoid.phenols": 0.28,
                                    "proanth": 2.29,
                                    "color.int": 5.64,
                                    "hue": 1.04,
                                    "od": 3.92,
                                    "proline": 1065
                                },
                                {
                                    "wine": 1,
                                    "alcohol": 13.2,
                                    "malic.acid": 1.78,
                                    "ash": 2.14,
                                    "acl": 11.2,
                                    "mg": 100,
                                    "phenols": 2.65,
                                    "flavanoids": 2.76,
                                    "nonflavanoid.phenols": 0.26,
                                    "proanth": 1.28,
                                    "color.int": 4.38,
                                    "hue": 1.05,
                                    "od": 3.4,
                                    "proline": 1050
                                },
                                {
                                    "wine": 1,
                                    "alcohol": 13.16,
                                    "malic.acid": 2.36,
                                    "ash": 2.67,
                                    "acl": 18.6,
                                    "mg": 101,
                                    "phenols": 2.8,
                                    "flavanoids": 3.24,
                                    "nonflavanoid.phenols": 0.3,
                                    "proanth": 2.81,
                                    "color.int": 5.68,
                                    "hue": 1.03,
                                    "od": 3.17,
                                    "proline": 1185
                                },
                                {
                                    "wine": 1,
                                    "alcohol": 14.37,
                                    "malic.acid": 1.95,
                                    "ash": 2.5,
                                    "acl": 16.8,
                                    "mg": 113,
                                    "phenols": 3.85,
                                    "flavanoids": 3.49,
                                    "nonflavanoid.phenols": 0.24,
                                    "proanth": 2.18,
                                    "color.int": 7.8,
                                    "hue": 0.86,
                                    "od": 3.45,
                                    "proline": 1480
                                },
                                {
                                    "wine": 1,
                                    "alcohol": 13.24,
                                    "malic.acid": 2.59,
                                    "ash": 2.87,
                                    "acl": 21,
                                    "mg": 118,
                                    "phenols": 2.8,
                                    "flavanoids": 2.69,
                                    "nonflavanoid.phenols": 0.39,
                                    "proanth": 1.82,
                                    "color.int": 4.32,
                                    "hue": 1.04,
                                    "od": 2.93,
                                    "proline": 735
                                }
                            ],
                            "metadata": {
                                "name": "Wine Dataset",
                                "columns": [
                                    "wine",
                                    "alcohol",
                                    "malic.acid",
                                    "ash",
                                    "acl",
                                    "mg",
                                    "phenols",
                                    "flavanoids",
                                    "nonflavanoid.phenols",
                                    "proanth",
                                    "color.int",
                                    "hue",
                                    "od",
                                    "proline"
                                ],
                                "n_rows": 178,
                                "n_columns": 14,
                                "features": [
                                    "alcohol",
                                    "malic.acid",
                                    "ash",
                                    "acl",
                                    "mg",
                                    "phenols",
                                    "flavanoids",
                                    "nonflavanoid.phenols",
                                    "proanth",
                                    "color.int",
                                    "hue",
                                    "od",
                                    "proline"
                                ],
                                "target": "wine",
                                "column_info": {
                                    "wine": {
                                        "name": "wine",
                                        "type": "numeric",
                                        "class": "target"
                                    },
                                    "alcohol": {
                                        "name": "alcohol",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "malic.acid": {
                                        "name": "malic.acid",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "ash": {
                                        "name": "ash",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "acl": {
                                        "name": "acl",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "mg": {
                                        "name": "mg",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "phenols": {
                                        "name": "phenols",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "flavanoids": {
                                        "name": "flavanoids",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "nonflavanoid.phenols": {
                                        "name": "nonflavanoid.phenols",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "proanth": {
                                        "name": "proanth",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "color.int": {
                                        "name": "color.int",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "hue": {
                                        "name": "hue",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "od": {
                                        "name": "od",
                                        "type": "numeric",
                                        "class": "feature"
                                    },
                                    "proline": {
                                        "name": "proline",
                                        "type": "numeric",
                                        "class": "feature"
                                    }
                                },
                                "skip_column_info": false
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 245.80248364836146,
                    "y": 343.7648121485265
                }
            },
            {
                "id": "node-data-feature-statistics-687b0de0-856b-487c-85a3-1c0a1a50c537",
                "name": "Feature Statistics",
                "name_count": 0,
                "type": "node-data-feature-statistics",
                "parameters": {},
                "outputs": {
                    "feature_statistics": {
                        "name": "Feature Statistics",
                        "type": "output-file-data",
                        "display_value": {
                            "data": [
                                {
                                    "Name": "sepal.length",
                                    "Class": "feature",
                                    "Type": "numeric",
                                    "Size": 150,
                                    "Mean": 5.843,
                                    "Mode": null,
                                    "Median": 5.8,
                                    "Dispersion": 0.142,
                                    "Standard Deviation": 0.828,
                                    "Min": 4.3,
                                    "Max": 7.9,
                                    "Unique Values": 35,
                                    "Missing Values": 0,
                                    "Missing Ratio": 0
                                },
                                {
                                    "Name": "sepal.width",
                                    "Class": "feature",
                                    "Type": "numeric",
                                    "Size": 150,
                                    "Mean": 3.057,
                                    "Mode": null,
                                    "Median": 3,
                                    "Dispersion": 0.143,
                                    "Standard Deviation": 0.436,
                                    "Min": 2,
                                    "Max": 4.4,
                                    "Unique Values": 23,
                                    "Missing Values": 0,
                                    "Missing Ratio": 0
                                },
                                {
                                    "Name": "petal.length",
                                    "Class": "feature",
                                    "Type": "numeric",
                                    "Size": 150,
                                    "Mean": 3.758,
                                    "Mode": null,
                                    "Median": 4.35,
                                    "Dispersion": 0.47,
                                    "Standard Deviation": 1.765,
                                    "Min": 1,
                                    "Max": 6.9,
                                    "Unique Values": 43,
                                    "Missing Values": 0,
                                    "Missing Ratio": 0
                                },
                                {
                                    "Name": "petal.width",
                                    "Class": "feature",
                                    "Type": "numeric",
                                    "Size": 150,
                                    "Mean": 1.199,
                                    "Mode": null,
                                    "Median": 1.3,
                                    "Dispersion": 0.636,
                                    "Standard Deviation": 0.762,
                                    "Min": 0.1,
                                    "Max": 2.5,
                                    "Unique Values": 22,
                                    "Missing Values": 0,
                                    "Missing Ratio": 0
                                },
                                {
                                    "Name": "variety",
                                    "Class": "target",
                                    "Type": "categorical",
                                    "Size": 150,
                                    "Mean": null,
                                    "Mode": "Setosa",
                                    "Median": null,
                                    "Dispersion": 1.099,
                                    "Standard Deviation": null,
                                    "Min": null,
                                    "Max": null,
                                    "Unique Values": 3,
                                    "Missing Values": 0,
                                    "Missing Ratio": 0
                                }
                            ],
                            "metadata": {
                                "name": "Feature Statistics",
                                "columns": [
                                    "Name",
                                    "Class",
                                    "Type",
                                    "Size",
                                    "Mean",
                                    "Mode",
                                    "Median",
                                    "Dispersion",
                                    "Standard Deviation",
                                    "Min",
                                    "Max",
                                    "Unique Values",
                                    "Missing Values",
                                    "Missing Ratio"
                                ],
                                "n_rows": 5,
                                "n_columns": 14,
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
                    "x": 514.3327501991778,
                    "y": 25.332737998787195
                }
            },
            {
                "id": "node-explain-feature-importance-91a27650-85ef-46ee-bd1b-66a6d81552d6",
                "name": "Feature Importance",
                "name_count": 0,
                "type": "node-explain-feature-importance",
                "parameters": {
                    "score": "mae",
                    "n_permutations": 5
                },
                "outputs": {
                    "importance": {
                        "name": "Importance",
                        "type": "output-dict",
                        "display_value": {
                            "data": [
                                {
                                    "name": "alcohol",
                                    "value": -0.0501015650414723
                                },
                                {
                                    "name": "malic.acid",
                                    "value": -0.001620498312562882
                                },
                                {
                                    "name": "ash",
                                    "value": -0.002202021396949877
                                },
                                {
                                    "name": "acl",
                                    "value": -0.004354463449538226
                                },
                                {
                                    "name": "mg",
                                    "value": -0.00527340823970038
                                },
                                {
                                    "name": "phenols",
                                    "value": -0.0026574724596799826
                                },
                                {
                                    "name": "flavanoids",
                                    "value": -0.3573246581997382
                                },
                                {
                                    "name": "nonflavanoid.phenols",
                                    "value": 0
                                },
                                {
                                    "name": "proanth",
                                    "value": -0.0011978492091511486
                                },
                                {
                                    "name": "color.int",
                                    "value": -0.1501415462583308
                                },
                                {
                                    "name": "hue",
                                    "value": -0.03691206698486658
                                },
                                {
                                    "name": "od",
                                    "value": -0.054128929600290344
                                },
                                {
                                    "name": "proline",
                                    "value": -0.19160780696003837
                                }
                            ],
                            "metadata": {
                                "x": "Feature",
                                "y": "Importance"
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 774.4629922933043,
                    "y": 319.9819917587173
                }
            },
            {
                "id": "node-explain-explain-model-8c5fea14-6dd0-4eb0-a63e-e63e31a3f65a",
                "name": "Explain Model",
                "name_count": 0,
                "type": "node-explain-explain-model",
                "parameters": {
                    "explanation_type": "shap",
                    "n_samples": 100,
                    "background_samples": 100
                },
                "outputs": {
                    "explanation": {
                        "name": "Explanation",
                        "type": "output-dict",
                        "display_value": {
                            "data": [
                                {
                                    "feature": "petal.width",
                                    "values": [
                                        [
                                            1.2,
                                            0.034118115030708246
                                        ],
                                        [
                                            0.30000000000000004,
                                            -0.5142087336771028
                                        ],
                                        [
                                            2.3,
                                            0.7042953745624777
                                        ],
                                        [
                                            1.5,
                                            0.2168937312666454
                                        ],
                                        [
                                            1.4,
                                            0.1559685258546663
                                        ],
                                        [
                                            0.4,
                                            -0.45328352826512386
                                        ],
                                        [
                                            1.3,
                                            0.09504332044268704
                                        ],
                                        [
                                            2.3,
                                            0.7042953745624773
                                        ],
                                        [
                                            1.5,
                                            0.21689373126664524
                                        ],
                                        [
                                            1.2,
                                            0.03411811503070811
                                        ],
                                        [
                                            2,
                                            0.5215197583265404
                                        ],
                                        [
                                            0.1,
                                            -0.636059144501061
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890821
                                        ],
                                        [
                                            0.1,
                                            -0.636059144501061
                                        ],
                                        [
                                            0.30000000000000004,
                                            -0.5142087336771031
                                        ],
                                        [
                                            1.6,
                                            0.27781893667862423
                                        ],
                                        [
                                            2.2,
                                            0.6433701691504984
                                        ],
                                        [
                                            1.1,
                                            -0.02680709038127091
                                        ],
                                        [
                                            1.3,
                                            0.09504332044268707
                                        ],
                                        [
                                            2.2,
                                            0.6433701691504986
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890818
                                        ],
                                        [
                                            1.8,
                                            0.3996693475025822
                                        ],
                                        [
                                            0.4,
                                            -0.4532835282651239
                                        ],
                                        [
                                            2.1,
                                            0.5824449637385192
                                        ],
                                        [
                                            2,
                                            0.5215197583265405
                                        ],
                                        [
                                            2.3,
                                            0.7042953745624776
                                        ],
                                        [
                                            1.8,
                                            0.39966934750258215
                                        ],
                                        [
                                            2.3,
                                            0.7042953745624777
                                        ],
                                        [
                                            0.30000000000000004,
                                            -0.514208733677103
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890822
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.4,
                                            -0.45328352826512386
                                        ],
                                        [
                                            1.4,
                                            0.15596852585466592
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890821
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890817
                                        ],
                                        [
                                            1.9000000000000001,
                                            0.46059455291456125
                                        ],
                                        [
                                            1.5,
                                            0.2168937312666455
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.1,
                                            -0.636059144501061
                                        ],
                                        [
                                            1.9000000000000001,
                                            0.46059455291456153
                                        ],
                                        [
                                            1.6,
                                            0.2778189366786244
                                        ],
                                        [
                                            1.5,
                                            0.2168937312666454
                                        ],
                                        [
                                            0.4,
                                            -0.45328352826512397
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890821
                                        ],
                                        [
                                            1,
                                            -0.08773229579324973
                                        ],
                                        [
                                            1.5,
                                            0.21689373126664535
                                        ],
                                        [
                                            1.8,
                                            0.3996693475025825
                                        ],
                                        [
                                            1.4,
                                            0.15596852585466642
                                        ],
                                        [
                                            2.5,
                                            0.8261457853864356
                                        ],
                                        [
                                            1.3,
                                            0.09504332044268693
                                        ],
                                        [
                                            2.1,
                                            0.5824449637385194
                                        ],
                                        [
                                            1.5,
                                            0.21689373126664543
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            2,
                                            0.5215197583265407
                                        ],
                                        [
                                            1,
                                            -0.08773229579324991
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.30000000000000004,
                                            -0.5142087336771031
                                        ],
                                        [
                                            0.4,
                                            -0.45328352826512414
                                        ],
                                        [
                                            1,
                                            -0.08773229579324975
                                        ],
                                        [
                                            1.8,
                                            0.3996693475025822
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890818
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.5,
                                            -0.3923583228531449
                                        ],
                                        [
                                            1.3,
                                            0.09504332044268715
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890818
                                        ],
                                        [
                                            1.2,
                                            0.03411811503070816
                                        ],
                                        [
                                            2.2,
                                            0.6433701691504987
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            1.3,
                                            0.09504332044268723
                                        ],
                                        [
                                            2,
                                            0.5215197583265406
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890822
                                        ],
                                        [
                                            1.8,
                                            0.3996693475025826
                                        ],
                                        [
                                            1.9000000000000001,
                                            0.46059455291456153
                                        ],
                                        [
                                            1,
                                            -0.08773229579324973
                                        ],
                                        [
                                            1.5,
                                            0.2168937312666452
                                        ],
                                        [
                                            2.3,
                                            0.7042953745624769
                                        ],
                                        [
                                            1.3,
                                            0.0950433204426871
                                        ],
                                        [
                                            0.4,
                                            -0.45328352826512386
                                        ],
                                        [
                                            1,
                                            -0.08773229579324991
                                        ],
                                        [
                                            1.9000000000000001,
                                            0.46059455291456153
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890818
                                        ],
                                        [
                                            1.1,
                                            -0.026807090381270673
                                        ],
                                        [
                                            1.7,
                                            0.3387441420906035
                                        ],
                                        [
                                            0.2,
                                            -0.5751339390890821
                                        ],
                                        [
                                            2.4,
                                            0.7652205799744564
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.6000000000000001,
                                            -0.33143311744116605
                                        ],
                                        [
                                            1.8,
                                            0.3996693475025823
                                        ],
                                        [
                                            1.1,
                                            -0.026807090381270687
                                        ],
                                        [
                                            2.3,
                                            0.7042953745624773
                                        ],
                                        [
                                            1.6,
                                            0.27781893667862423
                                        ],
                                        [
                                            1.4,
                                            0.1559685258546662
                                        ],
                                        [
                                            2.3,
                                            0.7042953745624774
                                        ],
                                        [
                                            1.3,
                                            0.09504332044268718
                                        ],
                                        [
                                            0.2,
                                            -0.575133939089082
                                        ],
                                        [
                                            0.1,
                                            -0.636059144501061
                                        ],
                                        [
                                            1.5,
                                            0.21689373126664552
                                        ],
                                        [
                                            1.8,
                                            0.3996693475025824
                                        ]
                                    ],
                                    "importance": 0.41282919187156986
                                },
                                {
                                    "feature": "petal.length",
                                    "values": [
                                        [
                                            4.7,
                                            0.24350695401286118
                                        ],
                                        [
                                            1.7,
                                            -0.44242812771350915
                                        ],
                                        [
                                            6.9,
                                            0.746526013945533
                                        ],
                                        [
                                            4.5,
                                            0.19777794856443687
                                        ],
                                        [
                                            4.8,
                                            0.26637145673707363
                                        ],
                                        [
                                            1.5,
                                            -0.4881571331619336
                                        ],
                                        [
                                            3.6,
                                            -0.008002575953474332
                                        ],
                                        [
                                            5.1,
                                            0.3349649649097106
                                        ],
                                        [
                                            4.5,
                                            0.19777794856443678
                                        ],
                                        [
                                            3.9,
                                            0.06059093221916255
                                        ],
                                        [
                                            5.1,
                                            0.3349649649097105
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861459
                                        ],
                                        [
                                            1.3,
                                            -0.533886138610358
                                        ],
                                        [
                                            1.5,
                                            -0.4881571331619333
                                        ],
                                        [
                                            1.5,
                                            -0.4881571331619335
                                        ],
                                        [
                                            4.7,
                                            0.24350695401286138
                                        ],
                                        [
                                            5.8,
                                            0.4950164839791971
                                        ],
                                        [
                                            3.9,
                                            0.06059093221916276
                                        ],
                                        [
                                            4.5,
                                            0.19777794856443667
                                        ],
                                        [
                                            5.6,
                                            0.44928747853077244
                                        ],
                                        [
                                            1.6,
                                            -0.46529263043772123
                                        ],
                                        [
                                            4.9,
                                            0.28923595946128605
                                        ],
                                        [
                                            1.6,
                                            -0.46529263043772123
                                        ],
                                        [
                                            5.6,
                                            0.44928747853077244
                                        ],
                                        [
                                            6.4,
                                            0.6322035003244714
                                        ],
                                        [
                                            5.2,
                                            0.3578294676339232
                                        ],
                                        [
                                            5.8,
                                            0.4950164839791972
                                        ],
                                        [
                                            5.9,
                                            0.517880986703409
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861457
                                        ],
                                        [
                                            1.6,
                                            -0.46529263043772107
                                        ],
                                        [
                                            1,
                                            -0.6024796467829951
                                        ],
                                        [
                                            1.5,
                                            -0.4881571331619336
                                        ],
                                        [
                                            4.4,
                                            0.17491344584022442
                                        ],
                                        [
                                            1.6,
                                            -0.4652926304377211
                                        ],
                                        [
                                            1.3,
                                            -0.5338861386103582
                                        ],
                                        [
                                            5,
                                            0.31210046218549853
                                        ],
                                        [
                                            4.5,
                                            0.19777794856443656
                                        ],
                                        [
                                            1.5,
                                            -0.4881571331619335
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861459
                                        ],
                                        [
                                            1.5,
                                            -0.4881571331619336
                                        ],
                                        [
                                            5.1,
                                            0.3349649649097103
                                        ],
                                        [
                                            4.5,
                                            0.19777794856443667
                                        ],
                                        [
                                            4.7,
                                            0.2435069540128612
                                        ],
                                        [
                                            1.3,
                                            -0.5338861386103578
                                        ],
                                        [
                                            1.5,
                                            -0.4881571331619333
                                        ],
                                        [
                                            3.7,
                                            0.014861926770737981
                                        ],
                                        [
                                            5.1,
                                            0.3349649649097106
                                        ],
                                        [
                                            5.5,
                                            0.42642297580655986
                                        ],
                                        [
                                            4.4,
                                            0.1749134458402243
                                        ],
                                        [
                                            6.1,
                                            0.563609992151834
                                        ],
                                        [
                                            4.2,
                                            0.12918444039179985
                                        ],
                                        [
                                            6.6,
                                            0.6779325057728957
                                        ],
                                        [
                                            4.5,
                                            0.19777794856443676
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861457
                                        ],
                                        [
                                            6.7,
                                            0.7007970084971079
                                        ],
                                        [
                                            4.1,
                                            0.1063199376675872
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861459
                                        ],
                                        [
                                            1.3,
                                            -0.5338861386103583
                                        ],
                                        [
                                            1.9000000000000001,
                                            -0.3966991222650841
                                        ],
                                        [
                                            3.5,
                                            -0.030867078677686777
                                        ],
                                        [
                                            4.9,
                                            0.28923595946128605
                                        ],
                                        [
                                            1.9000000000000001,
                                            -0.3966991222650842
                                        ],
                                        [
                                            1.6,
                                            -0.46529263043772123
                                        ],
                                        [
                                            1.7,
                                            -0.4424281277135088
                                        ],
                                        [
                                            4.2,
                                            0.12918444039179988
                                        ],
                                        [
                                            1.5,
                                            -0.48815713316193343
                                        ],
                                        [
                                            4.2,
                                            0.12918444039179988
                                        ],
                                        [
                                            6.7,
                                            0.7007970084971079
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861458
                                        ],
                                        [
                                            4.3,
                                            0.1520489431160119
                                        ],
                                        [
                                            5,
                                            0.31210046218549836
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861458
                                        ],
                                        [
                                            4.8,
                                            0.2663714567370738
                                        ],
                                        [
                                            5.1,
                                            0.3349649649097103
                                        ],
                                        [
                                            4,
                                            0.08345543494337528
                                        ],
                                        [
                                            4.5,
                                            0.19777794856443667
                                        ],
                                        [
                                            5.4,
                                            0.40355847308234766
                                        ],
                                        [
                                            4,
                                            0.08345543494337512
                                        ],
                                        [
                                            1.7,
                                            -0.4424281277135088
                                        ],
                                        [
                                            3.3,
                                            -0.07659608412611145
                                        ],
                                        [
                                            5.3,
                                            0.3806939703581354
                                        ],
                                        [
                                            1.4,
                                            -0.511021635886146
                                        ],
                                        [
                                            1.2,
                                            -0.5567506413345704
                                        ],
                                        [
                                            3.8,
                                            0.03772642949495039
                                        ],
                                        [
                                            5,
                                            0.3121004621854983
                                        ],
                                        [
                                            1.5,
                                            -0.48815713316193343
                                        ],
                                        [
                                            5.1,
                                            0.3349649649097105
                                        ],
                                        [
                                            1.5,
                                            -0.48815713316193343
                                        ],
                                        [
                                            1.6,
                                            -0.4652926304377211
                                        ],
                                        [
                                            4.8,
                                            0.2663714567370737
                                        ],
                                        [
                                            3,
                                            -0.14518959229874837
                                        ],
                                        [
                                            5.7,
                                            0.47215198125498475
                                        ],
                                        [
                                            5.1,
                                            0.33496496490971056
                                        ],
                                        [
                                            5.6,
                                            0.4492874785307724
                                        ],
                                        [
                                            6.1,
                                            0.563609992151834
                                        ],
                                        [
                                            4,
                                            0.08345543494337512
                                        ],
                                        [
                                            1.4,
                                            -0.5110216358861457
                                        ],
                                        [
                                            1.1,
                                            -0.579615144058783
                                        ],
                                        [
                                            5,
                                            0.3121004621854985
                                        ],
                                        [
                                            6,
                                            0.5407454894276219
                                        ]
                                    ],
                                    "importance": 0.37056499565130935
                                },
                                {
                                    "feature": "sepal.length",
                                    "values": [
                                        [
                                            6.1,
                                            -0.033795567885912425
                                        ],
                                        [
                                            5.7,
                                            0.010966773684832535
                                        ],
                                        [
                                            7.7,
                                            -0.21284493416889405
                                        ],
                                        [
                                            6,
                                            -0.022604982493226584
                                        ],
                                        [
                                            6.8,
                                            -0.11212966563471682
                                        ],
                                        [
                                            5.4,
                                            0.044538529862891474
                                        ],
                                        [
                                            5.6,
                                            0.02215735907751872
                                        ],
                                        [
                                            6.9,
                                            -0.12332025102740334
                                        ],
                                        [
                                            6.2,
                                            -0.04498615327859902
                                        ],
                                        [
                                            5.8,
                                            -0.00022381170785368976
                                        ],
                                        [
                                            6.5,
                                            -0.07855790945665764
                                        ],
                                        [
                                            4.8,
                                            0.11168204221900943
                                        ],
                                        [
                                            5.5,
                                            0.0333479444702052
                                        ],
                                        [
                                            4.9,
                                            0.10049145682632289
                                        ],
                                        [
                                            5.1,
                                            0.07811028604095034
                                        ],
                                        [
                                            6.3,
                                            -0.056176738671285274
                                        ],
                                        [
                                            6.5,
                                            -0.0785579094566582
                                        ],
                                        [
                                            5.6,
                                            0.02215735907751869
                                        ],
                                        [
                                            5.7,
                                            0.010966773684832539
                                        ],
                                        [
                                            6.4,
                                            -0.06736732406397195
                                        ],
                                        [
                                            4.7,
                                            0.12287262761169568
                                        ],
                                        [
                                            6.1,
                                            -0.033795567885912675
                                        ],
                                        [
                                            5,
                                            0.08930087143363684
                                        ],
                                        [
                                            6.4,
                                            -0.06736732406397178
                                        ],
                                        [
                                            7.9,
                                            -0.23522610495426652
                                        ],
                                        [
                                            6.7,
                                            -0.10093908024203091
                                        ],
                                        [
                                            6.7,
                                            -0.10093908024203074
                                        ],
                                        [
                                            6.8,
                                            -0.11212966563471703
                                        ],
                                        [
                                            4.8,
                                            0.11168204221900943
                                        ],
                                        [
                                            4.8,
                                            0.1116820422190095
                                        ],
                                        [
                                            4.6,
                                            0.134063213004382
                                        ],
                                        [
                                            5.7,
                                            0.010966773684832476
                                        ],
                                        [
                                            6.7,
                                            -0.10093908024203056
                                        ],
                                        [
                                            4.8,
                                            0.11168204221900953
                                        ],
                                        [
                                            4.4,
                                            0.15644438378975448
                                        ],
                                        [
                                            6.3,
                                            -0.05617673867128502
                                        ],
                                        [
                                            6.4,
                                            -0.06736732406397178
                                        ],
                                        [
                                            5.2,
                                            0.06691970064826401
                                        ],
                                        [
                                            5,
                                            0.08930087143363674
                                        ],
                                        [
                                            5.2,
                                            0.06691970064826415
                                        ],
                                        [
                                            5.8,
                                            -0.00022381170785343662
                                        ],
                                        [
                                            6,
                                            -0.022604982493226174
                                        ],
                                        [
                                            6.7,
                                            -0.10093908024203078
                                        ],
                                        [
                                            5.4,
                                            0.04453852986289133
                                        ],
                                        [
                                            5.4,
                                            0.04453852986289151
                                        ],
                                        [
                                            5.5,
                                            0.03334794447020511
                                        ],
                                        [
                                            6.3,
                                            -0.05617673867128518
                                        ],
                                        [
                                            6.4,
                                            -0.06736732406397167
                                        ],
                                        [
                                            6.6,
                                            -0.08974849484934429
                                        ],
                                        [
                                            7.2,
                                            -0.15689200720546206
                                        ],
                                        [
                                            5.7,
                                            0.010966773684832502
                                        ],
                                        [
                                            7.6,
                                            -0.20165434877620692
                                        ],
                                        [
                                            5.6,
                                            0.02215735907751886
                                        ],
                                        [
                                            5.1,
                                            0.0781102860409504
                                        ],
                                        [
                                            7.7,
                                            -0.21284493416889408
                                        ],
                                        [
                                            5.8,
                                            -0.00022381170785354705
                                        ],
                                        [
                                            5.2,
                                            0.06691970064826407
                                        ],
                                        [
                                            5,
                                            0.08930087143363685
                                        ],
                                        [
                                            5.1,
                                            0.07811028604095044
                                        ],
                                        [
                                            5,
                                            0.08930087143363674
                                        ],
                                        [
                                            6.3,
                                            -0.056176738671285094
                                        ],
                                        [
                                            4.8,
                                            0.11168204221900944
                                        ],
                                        [
                                            5,
                                            0.08930087143363688
                                        ],
                                        [
                                            5.1,
                                            0.07811028604095033
                                        ],
                                        [
                                            5.6,
                                            0.02215735907751869
                                        ],
                                        [
                                            5.1,
                                            0.07811028604095036
                                        ],
                                        [
                                            5.7,
                                            0.010966773684832374
                                        ],
                                        [
                                            7.7,
                                            -0.21284493416889352
                                        ],
                                        [
                                            4.6,
                                            0.13406321300438204
                                        ],
                                        [
                                            6.2,
                                            -0.044986153278598964
                                        ],
                                        [
                                            5.7,
                                            0.010966773684832504
                                        ],
                                        [
                                            5.5,
                                            0.033347944470205275
                                        ],
                                        [
                                            6,
                                            -0.02260498249322655
                                        ],
                                        [
                                            5.8,
                                            -0.00022381170785343662
                                        ],
                                        [
                                            6,
                                            -0.022604982493226417
                                        ],
                                        [
                                            5.4,
                                            0.044538529862891495
                                        ],
                                        [
                                            6.2,
                                            -0.044986153278598555
                                        ],
                                        [
                                            5.5,
                                            0.033347944470205254
                                        ],
                                        [
                                            5.4,
                                            0.04453852986289148
                                        ],
                                        [
                                            5,
                                            0.08930087143363681
                                        ],
                                        [
                                            6.4,
                                            -0.0673673240639717
                                        ],
                                        [
                                            5,
                                            0.08930087143363692
                                        ],
                                        [
                                            5,
                                            0.08930087143363677
                                        ],
                                        [
                                            5.5,
                                            0.03334794447020532
                                        ],
                                        [
                                            6.7,
                                            -0.10093908024203042
                                        ],
                                        [
                                            4.9,
                                            0.10049145682632289
                                        ],
                                        [
                                            5.8,
                                            -0.00022381170785350997
                                        ],
                                        [
                                            5,
                                            0.08930087143363682
                                        ],
                                        [
                                            5,
                                            0.08930087143363688
                                        ],
                                        [
                                            5.9,
                                            -0.011414397100540132
                                        ],
                                        [
                                            5.1,
                                            0.07811028604095029
                                        ],
                                        [
                                            6.9,
                                            -0.12332025102740325
                                        ],
                                        [
                                            6,
                                            -0.022604982493226313
                                        ],
                                        [
                                            6.1,
                                            -0.03379556788591268
                                        ],
                                        [
                                            7.7,
                                            -0.21284493416889372
                                        ],
                                        [
                                            5.5,
                                            0.03334794447020539
                                        ],
                                        [
                                            4.4,
                                            0.15644438378975434
                                        ],
                                        [
                                            4.3,
                                            0.16763496918244106
                                        ],
                                        [
                                            6,
                                            -0.02260498249322637
                                        ],
                                        [
                                            7.2,
                                            -0.1568920072054621
                                        ]
                                    ],
                                    "importance": 0.07541111684423452
                                },
                                {
                                    "feature": "sepal.width",
                                    "values": [
                                        [
                                            2.8,
                                            0.010981779299612193
                                        ],
                                        [
                                            3.8,
                                            -0.02909770719532275
                                        ],
                                        [
                                            2.6,
                                            0.018997676598598766
                                        ],
                                        [
                                            2.9,
                                            0.006973830650118503
                                        ],
                                        [
                                            2.8,
                                            0.010981779299612015
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597348912
                                        ],
                                        [
                                            2.9,
                                            0.006973830650118809
                                        ],
                                        [
                                            3.1,
                                            -0.0010420666488682368
                                        ],
                                        [
                                            2.2,
                                            0.035029471196573174
                                        ],
                                        [
                                            2.7,
                                            0.014989727949105653
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298362116
                                        ],
                                        [
                                            3,
                                            0.002965882000625105
                                        ],
                                        [
                                            3.5,
                                            -0.017073861246842396
                                        ],
                                        [
                                            3.1,
                                            -0.0010420666488682913
                                        ],
                                        [
                                            3.8,
                                            -0.02909770719532285
                                        ],
                                        [
                                            3.3,
                                            -0.009057963947855161
                                        ],
                                        [
                                            3,
                                            0.002965882000625176
                                        ],
                                        [
                                            2.5,
                                            0.023005625248092694
                                        ],
                                        [
                                            2.8,
                                            0.010981779299612507
                                        ],
                                        [
                                            2.8,
                                            0.010981779299612174
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298361928
                                        ],
                                        [
                                            3,
                                            0.0029658820006252667
                                        ],
                                        [
                                            3.4,
                                            -0.01306591259734891
                                        ],
                                        [
                                            2.8,
                                            0.010981779299612447
                                        ],
                                        [
                                            3.8,
                                            -0.029097707195323085
                                        ],
                                        [
                                            3,
                                            0.002965882000625148
                                        ],
                                        [
                                            2.5,
                                            0.023005625248092586
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298361946
                                        ],
                                        [
                                            3,
                                            0.002965882000625031
                                        ],
                                        [
                                            3.1,
                                            -0.0010420666488683552
                                        ],
                                        [
                                            3.6,
                                            -0.02108180989633589
                                        ],
                                        [
                                            4.4,
                                            -0.05314539909228407
                                        ],
                                        [
                                            3.1,
                                            -0.001042066648868251
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597348949
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298361917
                                        ],
                                        [
                                            2.5,
                                            0.023005625248092455
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298361804
                                        ],
                                        [
                                            3.5,
                                            -0.017073861246842306
                                        ],
                                        [
                                            3.6,
                                            -0.021081809896335915
                                        ],
                                        [
                                            4.1,
                                            -0.041121553143803356
                                        ],
                                        [
                                            2.7,
                                            0.014989727949105436
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597348893
                                        ],
                                        [
                                            3.1,
                                            -0.0010420666488682238
                                        ],
                                        [
                                            3.9,
                                            -0.03310565584481661
                                        ],
                                        [
                                            3.7,
                                            -0.025089758545829583
                                        ],
                                        [
                                            2.4,
                                            0.027013573897586234
                                        ],
                                        [
                                            2.8,
                                            0.010981779299612018
                                        ],
                                        [
                                            3.1,
                                            -0.0010420666488681945
                                        ],
                                        [
                                            3,
                                            0.002965882000624973
                                        ],
                                        [
                                            3.6,
                                            -0.02108180989633616
                                        ],
                                        [
                                            2.9,
                                            0.006973830650118795
                                        ],
                                        [
                                            3,
                                            0.0029658820006246657
                                        ],
                                        [
                                            3,
                                            0.0029658820006248526
                                        ],
                                        [
                                            3.5,
                                            -0.017073861246842462
                                        ],
                                        [
                                            2.8,
                                            0.010981779299612502
                                        ],
                                        [
                                            2.7,
                                            0.01498972794910553
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597348931
                                        ],
                                        [
                                            3.5,
                                            -0.01707386124684222
                                        ],
                                        [
                                            3.8,
                                            -0.029097707195322793
                                        ],
                                        [
                                            2,
                                            0.0430453684955602
                                        ],
                                        [
                                            2.7,
                                            0.014989727949105676
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597349011
                                        ],
                                        [
                                            3,
                                            0.0029658820006251076
                                        ],
                                        [
                                            3.3,
                                            -0.009057963947855302
                                        ],
                                        [
                                            2.7,
                                            0.014989727949105466
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597348968
                                        ],
                                        [
                                            3,
                                            0.002965882000625065
                                        ],
                                        [
                                            3.8,
                                            -0.029097707195323303
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298361984
                                        ],
                                        [
                                            2.9,
                                            0.006973830650118602
                                        ],
                                        [
                                            2.5,
                                            0.02300562524809254
                                        ],
                                        [
                                            4.2,
                                            -0.04512950179329691
                                        ],
                                        [
                                            3,
                                            0.002965882000625127
                                        ],
                                        [
                                            2.7,
                                            0.014989727949105436
                                        ],
                                        [
                                            2.2,
                                            0.035029471196572876
                                        ],
                                        [
                                            3,
                                            0.0029658820006252364
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597348897
                                        ],
                                        [
                                            2.3,
                                            0.031021522547079586
                                        ],
                                        [
                                            3.9,
                                            -0.033105655844816555
                                        ],
                                        [
                                            2.3,
                                            0.031021522547079756
                                        ],
                                        [
                                            2.7,
                                            0.014989727949105374
                                        ],
                                        [
                                            3.3,
                                            -0.009057963947855198
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298362022
                                        ],
                                        [
                                            2.4,
                                            0.027013573897586022
                                        ],
                                        [
                                            3,
                                            0.0029658820006249306
                                        ],
                                        [
                                            3.1,
                                            -0.0010420666488682201
                                        ],
                                        [
                                            2.8,
                                            0.010981779299612141
                                        ],
                                        [
                                            3.4,
                                            -0.013065912597348968
                                        ],
                                        [
                                            3.5,
                                            -0.017073861246842306
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298361989
                                        ],
                                        [
                                            2.5,
                                            0.023005625248092625
                                        ],
                                        [
                                            3.2,
                                            -0.0050500152983618775
                                        ],
                                        [
                                            2.7,
                                            0.01498972794910575
                                        ],
                                        [
                                            2.6,
                                            0.018997676598599245
                                        ],
                                        [
                                            3,
                                            0.0029658820006247923
                                        ],
                                        [
                                            2.5,
                                            0.023005625248092347
                                        ],
                                        [
                                            2.9,
                                            0.006973830650118659
                                        ],
                                        [
                                            3,
                                            0.002965882000625171
                                        ],
                                        [
                                            2.2,
                                            0.035029471196572966
                                        ],
                                        [
                                            3.2,
                                            -0.005050015298362132
                                        ]
                                    ],
                                    "importance": 0.014547250418201605
                                }
                            ],
                            "metadata": {
                                "features": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width"
                                ],
                                "target": "variety",
                                "n_samples": 100,
                                "background_samples": 100,
                                "model_type": "LinearRegression",
                                "explanation_type": "shap"
                            },
                            "base_value": 0.9425697885910259,
                            "final_value": 1.197381069048295,
                            "expected_value": 0.9425697885910259
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 1591.467095757803,
                    "y": 305.32428148953875
                }
            },
            {
                "id": "node-prediction-linear-regression-459ff857-d0fb-4eef-9615-407923eb27c1",
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
                    "x": 1303.0602637717893,
                    "y": 195.58343110608277
                }
            },
            {
                "id": "node-data-file-bf5f6ba5-f60c-4dad-a46a-ac6ed2943749",
                "name": "File",
                "name_count": 1,
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
                    "x": 1017.5403892618069,
                    "y": 317.6477494937825
                }
            },
            {
                "id": "node-prediction-random-forest-e514bd2f-56cb-4ea0-8921-714c12633bbe",
                "name": "Random Forest",
                "name_count": 0,
                "type": "node-prediction-random-forest",
                "parameters": {
                    "features": [],
                    "target": "",
                    "task_type": "regression",
                    "n_estimators": 100,
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
                    "x": 518.8625339546442,
                    "y": 190.34431973766243
                }
            },
            {
                "id": "node-visualization-distributions-f3e6779e-b06c-45d8-92f0-fd9c6016d42f",
                "name": "Distributions",
                "name_count": 0,
                "type": "node-visualization-distributions",
                "parameters": {
                    "x": "ash",
                    "group_by": "",
                    "bin_width": 2
                },
                "outputs": {
                    "visualization": {
                        "name": "Visualization",
                        "type": "output-dict",
                        "display_value": {
                            "data": [
                                {
                                    "name": "(1.358, 2.295]",
                                    "value": 0.38202247191011235
                                },
                                {
                                    "name": "(2.295, 3.23]",
                                    "value": 0.6179775280898876
                                }
                            ],
                            "metadata": {
                                "x": "ash",
                                "y": "Frequency",
                                "group_by": null,
                                "groups": null,
                                "type": "bar",
                                "num_bins": 2
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 516.9359096306501,
                    "y": -130.51163300114132
                }
            }
        ],
        "edges": [
            {
                "id": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c-node-data-feature-statistics-687b0de0-856b-487c-85a3-1c0a1a50c537-65ea8f8b-e048-4e33-9fe0-2ba8887ac40f",
                "source": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c",
                "target": "node-data-feature-statistics-687b0de0-856b-487c-85a3-1c0a1a50c537",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c-node-explain-feature-importance-91a27650-85ef-46ee-bd1b-66a6d81552d6-8dfa150d-d720-4427-923e-d28565634855",
                "source": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c",
                "target": "node-explain-feature-importance-91a27650-85ef-46ee-bd1b-66a6d81552d6",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-prediction-linear-regression-459ff857-d0fb-4eef-9615-407923eb27c1-node-explain-explain-model-8c5fea14-6dd0-4eb0-a63e-e63e31a3f65a-184e2512-f28f-41a7-89da-573d4e988c92",
                "source": "node-prediction-linear-regression-459ff857-d0fb-4eef-9615-407923eb27c1",
                "target": "node-explain-explain-model-8c5fea14-6dd0-4eb0-a63e-e63e31a3f65a",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-data-file-bf5f6ba5-f60c-4dad-a46a-ac6ed2943749-node-prediction-linear-regression-459ff857-d0fb-4eef-9615-407923eb27c1-f4a6478a-744d-4dc1-913f-41788db32080",
                "source": "node-data-file-bf5f6ba5-f60c-4dad-a46a-ac6ed2943749",
                "target": "node-prediction-linear-regression-459ff857-d0fb-4eef-9615-407923eb27c1",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-data-file-bf5f6ba5-f60c-4dad-a46a-ac6ed2943749-node-explain-explain-model-8c5fea14-6dd0-4eb0-a63e-e63e31a3f65a-045897c5-1d6d-41b4-8fb0-097284f5c7a2",
                "source": "node-data-file-bf5f6ba5-f60c-4dad-a46a-ac6ed2943749",
                "target": "node-explain-explain-model-8c5fea14-6dd0-4eb0-a63e-e63e31a3f65a",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c-node-prediction-random-forest-e514bd2f-56cb-4ea0-8921-714c12633bbe-323131d0-6ee6-454f-ae71-bdceed5c4b72",
                "source": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c",
                "target": "node-prediction-random-forest-e514bd2f-56cb-4ea0-8921-714c12633bbe",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-prediction-random-forest-e514bd2f-56cb-4ea0-8921-714c12633bbe-node-explain-feature-importance-91a27650-85ef-46ee-bd1b-66a6d81552d6-6cb022a5-fa89-40e4-a028-32775e22f7b8",
                "source": "node-prediction-random-forest-e514bd2f-56cb-4ea0-8921-714c12633bbe",
                "target": "node-explain-feature-importance-91a27650-85ef-46ee-bd1b-66a6d81552d6",
                "sourceHandle": "model",
                "targetHandle": "model"
            },
            {
                "id": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c-node-visualization-distributions-f3e6779e-b06c-45d8-92f0-fd9c6016d42f-721537a0-4107-4886-8114-7f46529e3c4f",
                "source": "node-data-file-3ea103ea-7037-47b1-888c-02910151ac4c",
                "target": "node-visualization-distributions-f3e6779e-b06c-45d8-92f0-fd9c6016d42f",
                "sourceHandle": "data",
                "targetHandle": "data"
            }
        ],
        "viewport": {
            "x": -161.4319740749794,
            "y": 335.71443823043296,
            "zoom": 0.94394035292912
        }
    }
}