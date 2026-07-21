export const exampleBasic = {
    "name": "Basic",
    "description": "A basic example which includes loading a dataset and calculating feature statistics.",
    "cover": "/assets/playgroundExamples/basic.png",
    "graph": {
        "nodes": [
            {
                "id": "node-data-file-f8870d41-8f16-484c-bfc9-fab4266c56fd",
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
                    "x": 204.12414198898776,
                    "y": 313.6115134563726
                }
            },
            {
                "id": "node-data-feature-statistics-cc52419b-98f6-493d-bdfa-9f87a6d62dfc",
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
                    "x": 459.62061012406457,
                    "y": 313.9129053909341
                }
            }
        ],
        "edges": [
            {
                "id": "node-data-file-f8870d41-8f16-484c-bfc9-fab4266c56fd-node-data-feature-statistics-cc52419b-98f6-493d-bdfa-9f87a6d62dfc-222af5fb-0f10-43d5-94f5-aca7d23f02cc",
                "source": "node-data-file-f8870d41-8f16-484c-bfc9-fab4266c56fd",
                "target": "node-data-feature-statistics-cc52419b-98f6-493d-bdfa-9f87a6d62dfc",
                "sourceHandle": "data",
                "targetHandle": "data"
            }
        ],
        "viewport": {
            "x": -37.2447521130523,
            "y": -254.52441884730672,
            "zoom": 2
        }
    }
};
