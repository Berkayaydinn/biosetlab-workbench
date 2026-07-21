import React from 'react';
import { FileOutlined, FileSearchOutlined, BarChartOutlined, PartitionOutlined, TableOutlined, BorderOuterOutlined,
    ClusterOutlined, ExperimentOutlined, InteractionOutlined, DotChartOutlined, StockOutlined, 
    BoxPlotOutlined, LineChartOutlined, HeatMapOutlined, AppstoreOutlined, ApartmentOutlined, InfoCircleOutlined, ThunderboltOutlined, DownloadOutlined, DeleteRowOutlined } from '@ant-design/icons';

// Node types dictionary
export const toolbarNodeGroupList = ['node-data', 'node-transform', 'node-visualization', 'node-prediction', 'node-evaluation', 'node-unsupervised', 'node-explain'];
export const toolbarNodeGroups = {
    'node-data': {
        name: 'Data',
        icon: <TableOutlined />,
        type: 'node-data',
    },
    'node-transform': {
        name: 'Transform',
        icon: <InteractionOutlined />,
        type: 'node-transform',
    },
    'node-visualization': {
        name: 'Visualization',
        icon: <DotChartOutlined />,
        type: 'node-visualization',
    },
    'node-prediction': {
        name: 'Prediction',
        icon: <ClusterOutlined />,
        type: 'node-prediction',
    },
    'node-evaluation': {
        name: 'Evaluation',
        icon: <ExperimentOutlined />,
        type: 'node-evaluation',
    },
    'node-unsupervised': {
        name: 'Unsupervised Learning',
        icon: <BorderOuterOutlined />,
        type: 'node-unsupervised',
    },
    'node-explain': {
        name: 'Explain',
        icon: <InfoCircleOutlined />,
        type: 'node-explain',
    },
    
};

export const toolbarNodeGroupItemMap = {
    'node-data': ['node-data-file', 'node-data-feature-statistics', 'node-data-save-data'],
    'node-transform': ['node-data-train-test-split', 'node-transform-impute'],
    'node-visualization': ['node-visualization-distributions', 'node-visualization-bar-plot', 'node-visualization-box-plot', 'node-visualization-line-plot', 'node-visualization-scatter-plot', 'node-visualization-heatmap', 'node-visualization-tree-viewer', 'node-visualization-venn-diagram'],
    'node-prediction': ['node-prediction-logistic-regression', 'node-prediction-linear-regression', 'node-prediction-svm', 
                'node-prediction-random-forest', 'node-prediction-gradient-boosting', 'node-supervised-neural-network', 'node-prediction-decision-tree', 'node-prediction-adaboost', 'node-prediction-stacking'],
    'node-evaluation': ['node-evaluation-test-and-score', 'node-evaluation-predictions', 'node-evaluation-confusion-matrix', 'node-evaluation-roc-curve'],

    'node-unsupervised': ['node-unsupervised-pca','node-unsupervised-kmeans', 'node-unsupervised-tsne', 'node-unsupervised-correlations','node-unsupervised-hierarchical-clustering', 'node-unsupervised-distance', 'node-unsupervised-distance-map', 'node-unsupervised-distance-matrix'],
    'node-explain': ['node-explain-feature-importance', 'node-explain-explain-model'],
};

export const GroupColorMap = {
    'node-data': '#ffd49f',
    'node-transform': '#ff9e5e',
    'node-visualization': '#fdb6b0',
    'node-prediction': '#f8bfd9',
    'node-evaluation': '#c1f3f3',
    'node-unsupervised': '#cae0ef',
    'node-explain': '#ecb6e7',
};

export const NodeConfig = {
    'node-data-file': {
        name: 'File',
        description: 'File node to load datasets',
        icon: <FileOutlined />,
        type: 'node-data-file',
        group: 'node-data',
        color: GroupColorMap['node-data'],
        parameters: {
            file_name: '',
            file_label: '',
            features: [],
            target: '',
        },
        inputs: [],
        outputs: [
            {
                name: 'data',
                label: 'Data',
                type: 'data',
            },
        ],
    },
    'node-data-save-data': {
        name: 'Save Data',
        description: 'Save Data node to export data in various formats (CSV, TSV, Excel)',
        icon: <DownloadOutlined />,
        type: 'node-data-save-data',
        group: 'node-data',
        color: GroupColorMap['node-data'],
        parameters: {
            file_type: 'csv',
            filename: 'exported_data',
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'data',
                label: 'Export Data',
                type: 'dict',
            },
        ],
    },
    'node-data-train-test-split': {
        name: 'Train Test Split',
        description: 'Train Test Split node to split the data into training and testing sets',
        icon: <PartitionOutlined />,
        type: 'node-data-train-test-split',
        group: 'node-transform',
        color: GroupColorMap['node-transform'],
        parameters: {
            test_size: 0.33,
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'train',
                label: 'Train Data',
                type: 'data',
            },
            {
                name: 'test',
                label: 'Test Data',
                type: 'data',
            },
        ],
    },
    'node-data-feature-statistics': {
        name: 'Feature Statistics',
        description: 'Feature Statistics node to compute basic statistics for each feature',
        icon: <FileSearchOutlined />,
        type: 'node-data-feature-statistics',
        group: 'node-data',
        color: GroupColorMap['node-data'],
        parameters: {},
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'feature_statistics',
                label: 'Feature Statistics',
                type: 'data',
            },
        ],
    },
    'node-visualization-distributions': {
        name: 'Distributions',
        description: 'Distributions node to visualize data',
        icon: <BarChartOutlined />,
        type: 'node-visualization-distributions',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
        parameters: {
            x: '',
            group_by: '',
            bin_width: 2,
            
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'visualization',
                label: 'Visualization',
                type: 'visualization',
            },
        ],
    },
    
    'node-visualization-bar-plot': {
        name: 'Bar Plot',
        description: 'Bar plot node to visualize data',
        icon: <BarChartOutlined />,
        type: 'node-visualization-bar-plot',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
        parameters: {
            x: '',
            y: '',
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data', 'predictions'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'visualization',
                label: 'Visualization',
                type: 'visualization',
            },
        ],
    },
    'node-visualization-box-plot': {
        name: 'Box Plot',
        description: 'Box plot node to visualize data distribution',
        icon: <BoxPlotOutlined />,
        type: 'node-visualization-box-plot',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
        parameters: {
            x: '',
            y: ''
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data', 'predictions'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'visualization',
                label: 'Visualization',
                type: 'dict',
            },
        ],
    },
    'node-visualization-line-plot': {
        name: 'Line Plot',
        description: 'Line plot node to visualize data distribution',
        icon: <LineChartOutlined />,
        type: 'node-visualization-line-plot',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
        parameters: {
            x: '',
            y: ''
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data', 'predictions'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'visualization',
                label: 'Visualization',
                type: 'dict',
            },
        ],
    },
    'node-visualization-scatter-plot': {
        name: 'Scatter Plot',
        description: 'Scatter plot node to visualize relationships between two variables',
        icon: <DotChartOutlined />,
        type: 'node-visualization-scatter-plot',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
        parameters: {
            x: '',
            y: ''
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data', 'predictions'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'visualization',
                label: 'Visualization',
                type: 'visualization',
            },
        ],
    },
    'node-visualization-heatmap': {
        name: 'Heatmap',
        description: 'Heatmap node to visualize data relationships',
        icon: <AppstoreOutlined />,
        type: 'node-visualization-heatmap',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
        parameters: {
            columns: [],
            mode: 'values',
            values_row_annotation: '',
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'visualization',
                label: 'Heatmap',
                type: 'visualization',
            },
        ],
    },
    'node-unsupervised-distance-map': {
        name: 'Distance Map',
        description: 'Distance Map node to visualize distance matrices as heatmaps',
        icon: <HeatMapOutlined />,
        type: 'node-unsupervised-distance-map',
        group: 'node-unsupervised',
        color: GroupColorMap['node-unsupervised'],
        parameters: {},
        inputs: [
            {
                name: 'distance_matrix',
                label: 'Distance Matrix',
                type: ['distance'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'visualization',
                label: 'Distance Map',
                type: 'visualization',
            },
        ],
    },
    'node-unsupervised-distance-matrix': {
        name: 'Distance Matrix',
        description: 'Distance Matrix node to view and analyze distance matrix data',
        icon: <TableOutlined />,
        type: 'node-unsupervised-distance-matrix',
        group: 'node-unsupervised',
        color: GroupColorMap['node-unsupervised'],
        parameters: {},
        inputs: [
            {
                name: 'distance_matrix',
                label: 'Distance Matrix',
                type: ['distance'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'matrix_data',
                label: 'Matrix Data',
                type: 'dict',
            },
            {
                name: 'statistics',
                label: 'Statistics',
                type: 'dict',
            },
        ],
    },
    'node-prediction-svm': {
        name: 'Support Vector Machine',
        description: 'SVM node to train a support vector machine model',
        icon: <StockOutlined />, // Replace with a more appropriate icon for SVM if available
        type: 'node-prediction-svm',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {
            // Features and target columns
            features: [], // Array of feature column names
            target: '', // Target column name
    
            // SVM-specific parameters
            svmType: 'SVM', // Type of SVM ("SVM" or "v-SVM")
            kernel: 'rbf', // Kernel type ("linear", "poly", "rbf", "sigmoid")
    
            // General parameters
            C: 1.0, // Regularization parameter (cost)
            epsilon: 0.1, // Regression loss epsilon (only used in SVM type, not v-SVM)
            v: 0.5, // Complexity bound (only used in v-SVM type)
    
            // Kernel-specific parameters
            degree: 3, // Degree of polynomial kernel
            gamma: 0.1, // Kernel coefficient ("scale", "auto", or numeric value)
            coef0: 0.0, // Independent term for "poly" and "sigmoid" kernels
    
            // Optimization parameters
            tol: 0.001, // Numerical tolerance for convergence
            max_iter: 100, // Maximum number of iterations (-1 for unlimited)
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'], // Accepts a single data input
                multi: false, // Only one data input allowed
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Model',
                type: 'model', // Outputs the trained SVM model
            },
        ],
    },
    
    
    'node-prediction-logistic-regression': {
        name: 'Logistic Regression',
        description: 'Logistic Regression node to train a model',
        icon: <StockOutlined />,
        type: 'node-prediction-logistic-regression',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {
            features: [],
            C: 1.0,
            solver: 'newton-cg',
            penalty: 'l2',
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Model',
                type: 'model',
            },
        ],
    },
    'node-prediction-linear-regression': {
        name: 'Linear Regression',
        description: 'Linear Regression node to train a model',
        icon: <StockOutlined />,
        type: 'node-prediction-linear-regression',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {
            features: [],
            fitIntercept: true,
            regulazition: 'none',
            C: 1.0,
            elasticnetMixing: 0.5,
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Model',
                type: 'model',
            },
        ],
    },
    'node-prediction-random-forest': {
        name: 'Random Forest',
        description: 'Random Forest node for classification and regression',
        icon: <ApartmentOutlined />,
        type: 'node-prediction-random-forest',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {
            features: [],
            target: '',
            task_type: 'classification',
            n_estimators: 100,
            max_depth: 3,
            min_samples_split: 2,
            min_samples_leaf: 1
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Model',
                type: 'model',
            },
        ],
    },
    'node-prediction-gradient-boosting': {
        name: 'Gradient Boosting',
        description: 'Gradient Boosting node for classification and regression',
        icon: <ApartmentOutlined />,
        type: 'node-prediction-gradient-boosting',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {
            features: [],
            target: '',
            task_type: 'classification',
            n_estimators: 100,
            learning_rate: 0.1,
            replicable_training: true,
            max_depth: 3,
            min_samples_split: 2,
            subsample: 1.0,
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Model',
                type: 'model',
            },
        ],
    },
    'node-prediction-decision-tree': {
        name: 'Decision Tree',
        description: 'Decision Tree node for classification and regression',
        icon: <ApartmentOutlined />,
        type: 'node-prediction-decision-tree',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {
            features: [],
            target: '',
            criterion: 'gini',
            max_depth: 3,
            min_samples_split: 2,
            min_samples_leaf: 1,
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Model',
                type: 'model',
            },
        ],
    },
    'node-evaluation-test-and-score': {
        name: 'Test and Score',
        description: 'Test and Score node to evaluate the model',
        icon: <ExperimentOutlined />,
        type: 'node-evaluation-test-and-score',
        group: 'node-evaluation',
        color: GroupColorMap['node-evaluation'],
        parameters: {
            evaluation_type: 'random_sampling',
            n_splits: 5,
            stratified: true,
            train_size: 0.66,
            repeat: 10
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
            {
                name: 'model',
                label: 'Learner',
                type: ['model'],
                multi: true,
            },
        ],
        outputs: [
            {
                name: 'evaluation_results',
                label: 'Evaluation Results',
                type: 'evaluation_results',
            },
            {
                name: 'predictions',
                label: 'Predictions',
                type: 'predictions',
            },
        ],
    },
    'node-evaluation-predictions': {
        name: 'Predictions',
        description: 'Predictions node to evaluate the model',
        icon: <ExperimentOutlined />,
        type: 'node-evaluation-predictions',
        group: 'node-evaluation',
        color: GroupColorMap['node-evaluation'],
        inputs: [
            {
                name: 'model',
                label: 'Predictor',
                type: ['model'],
                multi: true,
            },
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'evaluation_results',
                label: 'Evaluation Results',
                type: 'evaluation_results',
            },
            {
                name: 'predictions',
                label: 'Predictions',
                type: 'predictions',
            },
        ],
    },
    'node-evaluation-confusion-matrix': {
        name: 'Confusion Matrix',
        description: 'Confusion Matrix node to evaluate the model',
        icon: <ExperimentOutlined />,
        type: 'node-evaluation-confusion-matrix',
        group: 'node-evaluation',
        color: GroupColorMap['node-evaluation'],
        parameters: {
        },
        inputs: [
            {
                name: 'evaluation_results',
                label: 'Evaluation Results',
                type: ['evaluation_results'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'confusion_matrix',
                label: 'Confusion Matrix',
                type: ['dict'],
                multi: false,
            },
        ],
    },
    'node-evaluation-roc-curve': {
        name: 'ROC Curve',
        description: 'ROC Curve node to visualize model performance',
        icon: <ExperimentOutlined />,
        type: 'node-evaluation-roc-curve',
        group: 'node-evaluation',
        color: GroupColorMap['node-evaluation'],
        parameters: {},
        inputs: [
            {
                name: 'evaluation_results',
                label: 'Evaluation Results',
                type: ['evaluation_results'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'roc_curve',
                label: 'ROC Curve',
                type: ['dict'],
                multi: false,
            },
        ],
    },
    'node-unsupervised-pca': {
        name: 'PCA',
        description: 'Principal Component Analysis node for dimensionality reduction',
        icon: <BorderOuterOutlined />,
        type: 'node-unsupervised-pca',
        group: 'node-unsupervised',
        color: GroupColorMap['node-unsupervised'],
        parameters: {
            n_components: 2,
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'transformed_data',
                label: 'Transformed Data',
                type: 'data',
            },
            {
                name: 'components',
                label: 'Components',
                type: 'data',
            },
            {
                name: 'variance_info',
                label: 'Variance Information',
                type: 'data',
            },
        ],
    },
    'node-unsupervised-kmeans': {
        name: 'K-Means',
        description: 'K-Means node for clustering',
        icon: <ClusterOutlined />,
        type: 'node-unsupervised-kmeans',
        group: 'node-unsupervised',
        color: GroupColorMap['node-unsupervised'],
        parameters: {
            n_clusters: 3,  // Default number of clusters
            normalize: false,
            init: 'k-means++',
            n_init: 10,
            max_iter: 300,
            tol: 0.0001,  // Numerical tolerance (Orange3 default)
            random_state: 42,  // Ensures reproducibility
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'clustered_data',
                label: 'Clustered Data',
                type: 'data',  // Dataset with cluster labels as meta attributes
            },
            {
                name: 'centroids',
                label: 'Centroids',
                type: 'table',  // Table with initial centroid coordinates
            },
        ],
    },
    'node-supervised-neural-network': {
        name: 'Neural Network',
        description: 'Neural Network node for supervised learning',
        icon: <StockOutlined />,
        type: 'node-supervised-neural-network',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {
            features: [],
            target: '',
            hiddenLayers: [100], // Default: Single hidden layer with 100 neurons
            activation: 'relu',  // Activation function
            solver: 'adam',      // Optimizer
            regularization: 650, // L2 Regularization (α)
            maxIterations: 1000000, // Maximum number of iterations
            replicable: false,   // Replicable training flag
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Model',
                type: 'model',
            },
            {
                name: 'loss_curve',
                label: 'Training Loss Curve',
                type: 'data',
            },
        ],
    },

    // 🔵 t-SNE Node (Unsupervised Learning - Dimensionality Reduction)
    'node-unsupervised-tsne': {
        name: 't-SNE',
        description: 't-SNE node for high-dimensional data visualization',
        icon: <DotChartOutlined />,
        type: 'node-unsupervised-tsne',
        group: 'node-unsupervised',
        color: GroupColorMap['node-unsupervised'],
        parameters: {
            features: [],
            normalize: true,  // Normalize data before t-SNE
            apply_pca: true,  // Apply PCA preprocessing before t-SNE
            pca_components: 20, // Number of PCA components
            initialization: 'pca', // Initialization method ("pca" or "spectral")
            distance_metric: 'euclidean', // Distance metric
            perplexity: 30, // Perplexity value
            preserve_global_structure: false, // Preserve global structure
            exaggeration: 1.0, // Exaggeration factor
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'transformed_data',
                label: 'Transformed Data',
                type: 'data',
            },
        ],
    },

    // 📊 Correlations Node (Unsupervised Analysis)
    'node-unsupervised-correlations': {
        name: 'Correlations',
        description: 'Correlations node for finding relationships between variables',
        icon: <HeatMapOutlined />,
        type: 'node-unsupervised-correlations',
        group: 'node-unsupervised',
        color: GroupColorMap['node-unsupervised'],
        parameters: {
            features: [],
            method: 'pearson', // Correlation method ("pearson" or "spearman")
            target_column: '', // Target variable for correlation (or "all combinations")
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'correlation_results',
                label: 'Correlation Results',
                type: 'dict', // Correlation values and feature pairs
            },
        ],
    },

    'node-explain-feature-importance': {
        name: 'Feature Importance',
        description: 'Feature Importance node for model interpretation',
        icon: <InfoCircleOutlined />,
        type: 'node-explain-feature-importance',
        group: 'node-explain',
        color: GroupColorMap['node-explain'],
        parameters: {
            score: 'roc_auc', // Scoring function for feature importance
            n_permutations: 5, // Number of permutations for feature importance
        },
        inputs: [
            {
                name: 'model',
                label: 'Model',
                type: ['model'],
                multi: false,
            },
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'feature_importance',
                label: 'Feature Importance',
                type: 'dict', // Feature importance scores
            },
        ],
    },
    'node-unsupervised-distance': {
        name: 'Distance',
        description: 'Computes pairwise distances between rows or columns using selected metric.',
        icon: <AppstoreOutlined />, // istediğin bir ikonla değiştirebilirsin
        type: 'distance',
        group: 'node-unsupervised',
        color: GroupColorMap['node-unsupervised'],
        parameters: {
          compare: 'rows', // or 'columns'
          metric: 'euclidean_normalized', // veya cosine, pearson, etc.
        },
        inputs: [
          {
            name: 'data',
            label: 'Data',
            type: ['data'],
            multi: false,
          },
        ],
        outputs: [
          {
            name: 'distance_matrix',
            label: 'Distance Matrix',
            type: 'distance',
          },
        ],
      },
    'node-visualization-venn-diagram': {
        name: 'Venn Diagram',
        description: 'Venn Diagram node to visualize set relationships (columns) or row-level overlaps between datasets',
        icon: <AppstoreOutlined />,
        type: 'node-visualization-venn-diagram',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
    
        // Yeni parametreler ekleniyor
        parameters: {
            comparisonMode: 'columns',   // "columns" veya "rows"
            intersection: "auto",       // Kesişim modu (auto, exact, partial vs.)
            normalize: false,           // Boyutları normalize et
            rowsMatching: 'instance_identity', // Satır bazlı eşleşme (ör. ID sütunu)
            outputDuplicates: false,    // Satır bazlı eşleşmede kopya kayıtlar gösterilsin mi
        },
    
        inputs: [
            {
                name: 'data1',
                label: 'Dataset A',
                type: ['data'],
                multi: false,
            },
            {
                name: 'data2',
                label: 'Dataset B',
                type: ['data'],
                multi: false,
            },
            {
                name: 'data3',
                label: 'Dataset C (Optional)',
                type: ['data'],
                multi: false,
                optional: true,
            },
        ],
    
        outputs: [
            {
                name: 'venn_visualization',
                label: 'Venn Diagram',
                type: 'visualization',
            },
        ],
    },
    "node-prediction-adaboost": {
        name: "AdaBoost",
        description: "AdaBoost model for classification or regression using decision trees as base learners.",
        icon: <HeatMapOutlined />,
        type: "node-prediction-adaboost",
        group: "node-prediction",
        color: "#FF8C00",
        parameters: {
          n_estimators: 50,
          learning_rate: 1.0,
          loss: "Linear",         // Regression loss type
          fixed_seed: false,
          random_state: 0
        },
        inputs: [
          {
            name: "data",
            label: "Data",
            type: 'data',
            multi: false
          }
        ],
        outputs: [
          {
            name: "learner",
            label: "Learner",
            type: 'dict',
            multi: false
          },
          {
            name: "model",
            label: "Model",
            type: 'model',
            multi: false
          }
        ]
      },
      'node-prediction-stacking': {
        name: 'Stacking',
        description: 'Ensemble learning using stacking with multiple base models and an optional meta learner.',
        icon: <ApartmentOutlined />,
        type: 'node-prediction-stacking',
        group: 'node-prediction',
        color: GroupColorMap['node-prediction'],
        parameters: {},
        inputs: [
            {
                name: 'models',
                label: 'Base Models',
                type: ['model'],
                multi: true,
            },
            {
                name: 'data',
                label: 'Training Data',
                type: ['data'],
                multi: false,
            },
            {
                name: 'meta_model',
                label: 'Meta Model (Optional)',
                type: ['model'],
                multi: false,
                optional: true,
            },
        ],
        outputs: [
            {
                name: 'model',
                label: 'Stacked Model',
                type: 'model',
            },
            {
                name: 'learner',
                label: 'Learner',
                type: 'dict',
            },
        ],
    },
    'node-visualization-tree-viewer': {
        name: 'Tree Viewer',
        description: 'Visualize decision tree models',
        icon: <ApartmentOutlined />,
        type: 'node-visualization-tree-viewer',
        group: 'node-visualization',
        color: GroupColorMap['node-visualization'],
        parameters: {},
        inputs: [
            {
                name: 'model',
                label: 'Model',
                type: ['model'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'tree',
                label: 'Tree',
                type: 'dict',
            },
        ],
    },
    'node-explain-explain-model': {
        name: 'Explain Model',
        description: 'Explain Model node for model interpretation',
        icon: <InfoCircleOutlined />,
        type: 'node-explain-explain-model',
        group: 'node-explain',
        color: GroupColorMap['node-explain'],
        parameters: {
            explanation_type: 'shap',
            n_samples: 100,
            background_samples: 100,
        },
        inputs: [
            {
                name: 'model',
                label: 'Model',
                type: ['model'],
                multi: false,
            },
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'explanation',
                label: 'Explanation',
                type: 'dict',
            },
        ],
    },
      
    'node-unsupervised-hierarchical-clustering': {
      name: 'Hierarchical Clustering',
      description: 'Cluster data hierarchically using linkage-based methods.',
      icon: <ApartmentOutlined />,
      type: 'node-unsupervised-hierarchical-clustering',
      group: 'node-unsupervised',
      color: GroupColorMap['node-unsupervised'],
      parameters: {
          linkage: 'ward',               // 'ward', 'single', 'complete', 'average'
          annotation_column: '',         // Which column to annotate leaves with
          show_labels_subset: false,     // Whether to show labels only for subset
          pruning: 'none',               // 'none' or 'max_depth'
          max_depth: null,               // Only used if pruning === 'max_depth'
          selection_mode: 'manual',      // 'manual', 'height_ratio', 'top_n'
          height_ratio: 0.75,            // Used if selection_mode === 'height_ratio'
          top_n: null,                   // Used if selection_mode === 'top_n'
        },
      inputs: [
        {
          name: 'distance_matrix',
          label: 'Distance Matrix',
          type: 'distance',
          multi: false,
        },
      ],
      outputs: [
        {
          name: 'visualization',
          label: 'Dendrogram',
          type: 'visualization',
        },
      ],
    },
    'node-transform-impute': {
        name: 'Impute',
        description: 'Impute node to replace missing values in the data using various methods',
        icon: <DeleteRowOutlined />,
        type: 'node-transform-impute',
        group: 'node-transform',
        color: GroupColorMap['node-transform'],
        parameters: {
            method: 'model_based',
            remove_missing_class: false,
        },
        inputs: [
            {
                name: 'data',
                label: 'Data',
                type: ['data'],
                multi: false,
            },
        ],
        outputs: [
            {
                name: 'data',
                label: 'Imputed Data',
                type: 'data',
            },
        ],
    },
};
