export const examplePrincipalComponentAnalysis = {
    "name": "PCA",
    "description": "Principal Component Analysis (PCA) is a dimensionality reduction technique that transforms high-dimensional data into a lower-dimensional space while preserving the most important information. This example demonstrates how to use PCA to reduce the dimensionality of the Iris dataset and visualize the results.",
    "cover": "/assets/playgroundExamples/principalComponentAnalysis.png",
    "graph": {
        "nodes": [
            {
                "id": "node-data-file-ab6eab98-e109-4d6f-bf81-105bddeaa826",
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
                    "x": 196.53877769250823,
                    "y": 159.7846303259726
                }
            },
            {
                "id": "node-unsupervised-pca-40dc7a67-bde3-4712-988a-1e8f0ad04249",
                "name": "PCA",
                "name_count": 0,
                "type": "node-unsupervised-pca",
                "parameters": {
                    "n_components": 2
                },
                "outputs": {
                    "transformed_data": {
                        "name": "Transformed Data",
                        "type": "output-file-data",
                        "display_value": {
                            "data": [
                                {
                                    "sepal.length": 5.1,
                                    "sepal.width": 3.5,
                                    "petal.length": 1.4,
                                    "petal.width": 0.2,
                                    "variety": "Setosa",
                                    "PC1": -2.2647028088,
                                    "PC2": 0.4800265965,
                                    "PC3": -0.1277060223,
                                    "PC4": -0.0241682039
                                },
                                {
                                    "sepal.length": 4.9,
                                    "sepal.width": 3,
                                    "petal.length": 1.4,
                                    "petal.width": 0.2,
                                    "variety": "Setosa",
                                    "PC1": -2.080961152,
                                    "PC2": -0.6741335566,
                                    "PC3": -0.234608854,
                                    "PC4": -0.1030067748
                                },
                                {
                                    "sepal.length": 4.7,
                                    "sepal.width": 3.2,
                                    "petal.length": 1.3,
                                    "petal.width": 0.2,
                                    "variety": "Setosa",
                                    "PC1": -2.3642290539,
                                    "PC2": -0.3419080239,
                                    "PC3": 0.0442014848,
                                    "PC4": -0.0283770534
                                },
                                {
                                    "sepal.length": 4.6,
                                    "sepal.width": 3.1,
                                    "petal.length": 1.5,
                                    "petal.width": 0.2,
                                    "variety": "Setosa",
                                    "PC1": -2.299384217,
                                    "PC2": -0.5973945077,
                                    "PC3": 0.0912901063,
                                    "PC4": 0.0659555596
                                },
                                {
                                    "sepal.length": 5,
                                    "sepal.width": 3.6,
                                    "petal.length": 1.4,
                                    "petal.width": 0.2,
                                    "variety": "Setosa",
                                    "PC1": -2.3898421663,
                                    "PC2": 0.6468353829,
                                    "PC3": 0.0157381957,
                                    "PC4": 0.0359228133
                                }
                            ],
                            "metadata": {
                                "name": "Data",
                                "columns": [
                                    "sepal.length",
                                    "sepal.width",
                                    "petal.length",
                                    "petal.width",
                                    "variety",
                                    "PC1",
                                    "PC2",
                                    "PC3",
                                    "PC4"
                                ],
                                "n_rows": 150,
                                "n_columns": 9,
                                "features": null,
                                "target": null,
                                "column_info": null,
                                "skip_column_info": true
                            }
                        },
                        "value": {}
                    },
                    "components": {
                        "name": "Components",
                        "type": "output-file-data",
                        "display_value": {
                            "data": [
                                {
                                    "PC1": -2.2647028088,
                                    "PC2": 0.4800265965,
                                    "PC3": -0.1277060223,
                                    "PC4": -0.0241682039
                                },
                                {
                                    "PC1": -2.080961152,
                                    "PC2": -0.6741335566,
                                    "PC3": -0.234608854,
                                    "PC4": -0.1030067748
                                },
                                {
                                    "PC1": -2.3642290539,
                                    "PC2": -0.3419080239,
                                    "PC3": 0.0442014848,
                                    "PC4": -0.0283770534
                                },
                                {
                                    "PC1": -2.299384217,
                                    "PC2": -0.5973945077,
                                    "PC3": 0.0912901063,
                                    "PC4": 0.0659555596
                                },
                                {
                                    "PC1": -2.3898421663,
                                    "PC2": 0.6468353829,
                                    "PC3": 0.0157381957,
                                    "PC4": 0.0359228133
                                }
                            ],
                            "metadata": {
                                "name": "Data",
                                "columns": [
                                    "PC1",
                                    "PC2",
                                    "PC3",
                                    "PC4"
                                ],
                                "n_rows": 150,
                                "n_columns": 4,
                                "features": null,
                                "target": null,
                                "column_info": null,
                                "skip_column_info": true
                            }
                        },
                        "value": {}
                    },
                    "variance_info": {
                        "name": "Variance Information",
                        "type": "output-file-data",
                        "display_value": {
                            "data": [
                                {
                                    "Component": 1,
                                    "Individual Variance": 0.7296244541,
                                    "Cumulative Variance": 0.7296244541
                                },
                                {
                                    "Component": 2,
                                    "Individual Variance": 0.2285076179,
                                    "Cumulative Variance": 0.958132072
                                },
                                {
                                    "Component": 3,
                                    "Individual Variance": 0.0366892189,
                                    "Cumulative Variance": 0.9948212909
                                },
                                {
                                    "Component": 4,
                                    "Individual Variance": 0.0051787091,
                                    "Cumulative Variance": 1
                                }
                            ],
                            "metadata": {
                                "name": "Data",
                                "columns": [
                                    "Component",
                                    "Individual Variance",
                                    "Cumulative Variance"
                                ],
                                "n_rows": 4,
                                "n_columns": 3,
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
                    "x": 559.4127558429864,
                    "y": 162.82560810155897
                }
            },
            {
                "id": "node-visualization-scatter-plot-7cc77d9e-2f41-4546-b584-fde09d61625c",
                "name": "Scatter Plot",
                "name_count": 0,
                "type": "node-visualization-scatter-plot",
                "parameters": {
                    "x": "PC1",
                    "y": "PC2",
                    "group_by": "variety"
                },
                "outputs": {
                    "visualization": {
                        "name": "Visualization",
                        "type": "output-dict",
                        "display_value": {
                            "data": [
                                {
                                    "x": -2.2647028088,
                                    "y": 0.4800265965,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.080961152,
                                    "y": -0.6741335566000001,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.3642290539,
                                    "y": -0.3419080239,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.299384217,
                                    "y": -0.5973945077,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.3898421663,
                                    "y": 0.6468353829,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.0756309482,
                                    "y": 1.4891775233,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.4440288351,
                                    "y": 0.0476441976,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2328471589,
                                    "y": 0.2231480727,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.3346404779,
                                    "y": -1.1153276755,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1843281749,
                                    "y": -0.4690135614,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1663101007,
                                    "y": 1.0436906531,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.3261308664,
                                    "y": 0.1330783352,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2184508988,
                                    "y": -0.7286761653,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.6331006958,
                                    "y": -0.9615067292,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1987406033,
                                    "y": 1.8600571133000001,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2622145316,
                                    "y": 2.6862844851,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2075876958,
                                    "y": 1.4836093632,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1903495092,
                                    "y": 0.48883831650000004,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -1.8985719958,
                                    "y": 1.4050187945000001,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.3433690531,
                                    "y": 1.1278493819,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -1.9143229961000001,
                                    "y": 0.4088557078,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2070128432,
                                    "y": 0.9241214267000001,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.7743447029,
                                    "y": 0.4583436678,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -1.8186695287,
                                    "y": 0.0855585263,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2271633057,
                                    "y": 0.1372544554,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -1.9518463309,
                                    "y": -0.6256185878,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.0511513727,
                                    "y": 0.2421635527,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1685771747,
                                    "y": 0.5271495253,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1395634513,
                                    "y": 0.3132178101,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2652614932,
                                    "y": -0.3377319038,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1401221356,
                                    "y": -0.5045406901,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -1.8315947707,
                                    "y": 0.42369506760000003,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.6149479359,
                                    "y": 1.7935758561,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.4461773917,
                                    "y": 2.1507278774,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1099748753,
                                    "y": -0.46020184140000003,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2078088991,
                                    "y": -0.2061073977,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.0451462068,
                                    "y": 0.6615581115,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.5273319132,
                                    "y": 0.5922927742,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.4296325751,
                                    "y": -0.9041800404,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1697107116,
                                    "y": 0.2688789614,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2864751433,
                                    "y": 0.4417153877,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -1.8581224564,
                                    "y": -2.3374151576,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.5536383956,
                                    "y": -0.4791006901,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -1.9644476838,
                                    "y": 0.47232666770000004,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.1370590058,
                                    "y": 1.142229262,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.0697442996,
                                    "y": -0.7110527254,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.3847331658,
                                    "y": 1.120429702,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.3943763142,
                                    "y": -0.3862468726,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2294465479,
                                    "y": 0.9979597643,
                                    "group": "Setosa"
                                },
                                {
                                    "x": -2.2038334355,
                                    "y": 0.009216357500000001,
                                    "group": "Setosa"
                                },
                                {
                                    "x": 1.1017811831,
                                    "y": 0.8629724183,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.7313374254,
                                    "y": 0.5946147257000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.2409793195,
                                    "y": 0.6162976544000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.4074830588,
                                    "y": -1.7544039893,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.0754747006,
                                    "y": -0.2084210461,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.38868733650000004,
                                    "y": -0.593283636,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.7465297413,
                                    "y": 0.7730193121000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": -0.48732274210000004,
                                    "y": -1.8524290869,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.9279016384000001,
                                    "y": 0.032226077900000004,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.011426188700000001,
                                    "y": -1.0340182751,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": -0.11019628000000001,
                                    "y": -2.6540728185,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.440693449,
                                    "y": -0.06329518840000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.5621083064,
                                    "y": -1.7647243806,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.7195618887,
                                    "y": -0.1862246058,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": -0.0333547032,
                                    "y": -0.43900321000000003,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.8754071909000001,
                                    "y": 0.5090639568,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.350251668,
                                    "y": -0.1963117346,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.1588100475,
                                    "y": -0.7920957424,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.2250936336,
                                    "y": -1.6222438031,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.1649178994,
                                    "y": -1.3026092303,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.7376826488,
                                    "y": 0.39657156200000004,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.4762871909,
                                    "y": -0.41732028120000003,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.2341780977,
                                    "y": -0.9333257288000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.6328581997,
                                    "y": -0.41638772090000004,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.7026611831,
                                    "y": -0.0634118197,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.8742736539,
                                    "y": 0.2507933929,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.2565091165,
                                    "y": -0.0772560197,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.3584051214,
                                    "y": 0.33131168180000004,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.6648003672,
                                    "y": -0.2259278547,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": -0.0402586109,
                                    "y": -1.0587185466,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.1307951755,
                                    "y": -1.5622718342,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.023452689000000002,
                                    "y": -1.5724755942,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.24153827300000003,
                                    "y": -0.7772563826000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.0610946088,
                                    "y": -0.6338432447,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.2239787735,
                                    "y": -0.287773512,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.4291391155,
                                    "y": 0.8455822409,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.0487280512,
                                    "y": 0.5220517969,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.0445313844,
                                    "y": -1.3829887192,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.0695883211,
                                    "y": -0.21950333460000002,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.2834772383,
                                    "y": -1.3293246391,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.2790777761,
                                    "y": -1.1200285237,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.6245697915,
                                    "y": 0.0249230293,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.33653037010000003,
                                    "y": -0.9884040177000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": -0.3621833846,
                                    "y": -2.0192378732,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.2885862388,
                                    "y": -0.85573032,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.0913606557,
                                    "y": -0.18119212580000002,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.2277168655,
                                    "y": -0.384920081,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.5763882887,
                                    "y": -0.15487359720000002,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": -0.44766701900000005,
                                    "y": -1.5437920344,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 0.2567305889,
                                    "y": -0.5988517962000001,
                                    "group": "Versicolor"
                                },
                                {
                                    "x": 1.8445688677,
                                    "y": 0.8704213123000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.1578816132,
                                    "y": -0.6988698623,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.2052667911,
                                    "y": 0.5620104770000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.4401506638000001,
                                    "y": -0.046987588100000005,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.8678122203,
                                    "y": 0.2950448245,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.7518733357,
                                    "y": 0.800409201,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 0.3670176879,
                                    "y": -1.5615028915,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.3024394446,
                                    "y": 0.4200655796,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.0066864677,
                                    "y": -0.7114386535,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.259777349,
                                    "y": 1.9210103765,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.3641754922,
                                    "y": 0.6927564545,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.6026786705,
                                    "y": -0.4217004498,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.8839007017,
                                    "y": 0.4192496506,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.2601150992,
                                    "y": -1.1622604214,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.467645201,
                                    "y": -0.4422715874,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.5900773176,
                                    "y": 0.6762448057,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.4714314611000001,
                                    "y": 0.2556218245,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.4263289873,
                                    "y": 2.5566612508,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 3.3106955839,
                                    "y": 0.0177809493,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.2637666736,
                                    "y": -1.7067453804000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.0377163015,
                                    "y": 0.9104674096,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 0.9779807342000001,
                                    "y": -0.5717643248000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.8976514907,
                                    "y": 0.4136410596,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.333232176,
                                    "y": -0.48181121860000004,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.7007338975,
                                    "y": 1.0139218673,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.9543267059,
                                    "y": 1.0077775962,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.1751036316,
                                    "y": -0.3163944723,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.0209505507,
                                    "y": 0.0643460292,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.7883499202,
                                    "y": -0.18736121460000002,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.8636475533,
                                    "y": 0.5622907259000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.4359537279,
                                    "y": 0.2592844331,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.3049277218,
                                    "y": 2.6263234682,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.8627032198,
                                    "y": -0.1785494946,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.1141477407,
                                    "y": -0.2929226233,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.2024733017,
                                    "y": -0.8113152708,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.7987704476,
                                    "y": 0.8568033295,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.5762559102,
                                    "y": 1.0685811073,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.3462921036,
                                    "y": 0.4224306109,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 0.9248249165,
                                    "y": 0.0172231005,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.8520450518,
                                    "y": 0.6761281744000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.01481043,
                                    "y": 0.6138856369,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.9017840903,
                                    "y": 0.6895754942,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.1578816132,
                                    "y": -0.6988698623,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 2.0405582281,
                                    "y": 0.8675206010000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.998147096,
                                    "y": 1.0491687472,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.870503293,
                                    "y": 0.3869660817,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.564580483,
                                    "y": -0.8966868089000001,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.5211704996,
                                    "y": 0.2690691443,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 1.3727877895,
                                    "y": 1.0112544185,
                                    "group": "Virginica"
                                },
                                {
                                    "x": 0.96065603,
                                    "y": -0.0243316682,
                                    "group": "Virginica"
                                }
                            ],
                            "metadata": {
                                "x": "PC1",
                                "y": "PC2",
                                "count": 150,
                                "groups": [
                                    "Setosa",
                                    "Versicolor",
                                    "Virginica"
                                ],
                                "group_by": "variety"
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 836.8126730485461,
                    "y": 83.66223970975966
                }
            },
            {
                "id": "node-visualization-heatmap-246126a2-c3da-46ea-85b1-dea9cc8b421f",
                "name": "Heatmap",
                "name_count": 0,
                "type": "node-visualization-heatmap",
                "parameters": {
                    "columns": [
                        "sepal.length",
                        "sepal.width",
                        "petal.length",
                        "petal.width",
                        "variety"
                    ],
                    "mode": "pca",
                    "values_row_annotation": ""
                },
                "outputs": {
                    "visualization": {
                        "name": "Heatmap Visualization",
                        "type": "output-dict",
                        "display_value": {
                            "data": [
                                [
                                    "PC1",
                                    "sepal.length",
                                    0.8902
                                ],
                                [
                                    "PC2",
                                    "sepal.length",
                                    0.3608
                                ],
                                [
                                    "PC3",
                                    "sepal.length",
                                    -0.2757
                                ],
                                [
                                    "PC4",
                                    "sepal.length",
                                    -0.0376
                                ],
                                [
                                    "PC1",
                                    "sepal.width",
                                    -0.4601
                                ],
                                [
                                    "PC2",
                                    "sepal.width",
                                    0.8827
                                ],
                                [
                                    "PC3",
                                    "sepal.width",
                                    0.0936
                                ],
                                [
                                    "PC4",
                                    "sepal.width",
                                    0.0178
                                ],
                                [
                                    "PC1",
                                    "petal.length",
                                    0.9916
                                ],
                                [
                                    "PC2",
                                    "petal.length",
                                    0.0234
                                ],
                                [
                                    "PC3",
                                    "petal.length",
                                    0.0544
                                ],
                                [
                                    "PC4",
                                    "petal.length",
                                    0.1153
                                ],
                                [
                                    "PC1",
                                    "petal.width",
                                    0.965
                                ],
                                [
                                    "PC2",
                                    "petal.width",
                                    0.064
                                ],
                                [
                                    "PC3",
                                    "petal.width",
                                    0.243
                                ],
                                [
                                    "PC4",
                                    "petal.width",
                                    -0.0754
                                ]
                            ],
                            "metadata": {
                                "x": [
                                    "PC1",
                                    "PC2",
                                    "PC3",
                                    "PC4"
                                ],
                                "y": [
                                    "PC1",
                                    "PC2",
                                    "PC3",
                                    "PC4"
                                ],
                                "count": 16
                            }
                        },
                        "value": {}
                    }
                },
                "position": {
                    "x": 833.7864929214581,
                    "y": 264.8543638774961
                }
            }
        ],
        "edges": [
            {
                "id": "node-data-file-ab6eab98-e109-4d6f-bf81-105bddeaa826-node-unsupervised-pca-40dc7a67-bde3-4712-988a-1e8f0ad04249-fc1f18f0-f736-4fa0-a72e-dc0cacae0139",
                "source": "node-data-file-ab6eab98-e109-4d6f-bf81-105bddeaa826",
                "target": "node-unsupervised-pca-40dc7a67-bde3-4712-988a-1e8f0ad04249",
                "sourceHandle": "data",
                "targetHandle": "data"
            },
            {
                "id": "node-unsupervised-pca-40dc7a67-bde3-4712-988a-1e8f0ad04249-node-visualization-scatter-plot-7cc77d9e-2f41-4546-b584-fde09d61625c-3e1af5a6-7bf0-483d-9e90-372b4b775f1c",
                "source": "node-unsupervised-pca-40dc7a67-bde3-4712-988a-1e8f0ad04249",
                "target": "node-visualization-scatter-plot-7cc77d9e-2f41-4546-b584-fde09d61625c",
                "sourceHandle": "transformed_data",
                "targetHandle": "data"
            },
            {
                "id": "node-unsupervised-pca-40dc7a67-bde3-4712-988a-1e8f0ad04249-node-visualization-heatmap-246126a2-c3da-46ea-85b1-dea9cc8b421f-c383c312-2cdf-45de-994e-e85f2d15ab69",
                "source": "node-unsupervised-pca-40dc7a67-bde3-4712-988a-1e8f0ad04249",
                "target": "node-visualization-heatmap-246126a2-c3da-46ea-85b1-dea9cc8b421f",
                "sourceHandle": "transformed_data",
                "targetHandle": "data"
            }
        ],
        "viewport": {
            "x": -280.52409218797584,
            "y": 74.49936160412773,
            "zoom": 1.786492240367022
        }
    }
}