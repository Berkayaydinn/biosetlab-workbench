const NODE_CATALOG = Object.freeze([
  {
    type: "node-data-file",
    name: "File",
    category: "data",
    description: "Load an existing Playground dataset.",
    inputs: {},
    outputs: { data: "Data" },
    parameters: {
      file_name: {
        type: "string",
        required: true,
        description: "Existing dataset filename or authorized dataset identifier."
      },
      file_label: { type: "string", required: false },
      column_info: {
        type: "object",
        required: false,
        description:
          "Column metadata keyed by exact dataset column names. Each entry " +
          "must include name, type (categorical, numeric, or boolean), and " +
          "class (feature or target). Use the known target column explicitly. " +
          "Never infer a target from the first categorical column."
      }
    }
  },
  {
    type: "node-transform-impute",
    name: "Impute",
    category: "preprocessing",
    description: "Handle missing values in tabular data.",
    inputs: { data: "Data" },
    outputs: { data: "Data" },
    parameters: {
      method: {
        type: "string",
        required: false,
        default: "model_based",
        enum: [
          "dont_impute",
          "average_frequent",
          "distinct_value",
          "model_based",
          "random",
          "remove_examples",
          "fixed_value"
        ]
      },
      remove_missing_class: {
        type: "boolean",
        required: false,
        default: false
      },
      fixed_value: { required: false },
      column_params: { type: "object", required: false }
    }
  },
  {
    type: "node-data-train-test-split",
    name: "Train Test Split",
    category: "data",
    description: "Split a dataset into train and test sets.",
    inputs: { data: "Data" },
    outputs: { train: "Data", test: "Data" },
    parameters: {
      test_size: {
        type: "number",
        required: true,
        exclusiveMinimum: 0,
        exclusiveMaximum: 1
      }
    }
  },
  {
    type: "node-prediction-logistic-regression",
    name: "Logistic Regression",
    category: "prediction",
    description: "Build a logistic regression classification model.",
    inputs: { data: "Data" },
    outputs: { model: "Model" },
    parameters: {
      solver: {
        type: "string",
        required: true,
        enum: [
          "lbfgs", "liblinear", "newton-cg",
          "newton-cholesky", "sag", "saga"
        ]
      },
      penalty: {
        type: "string",
        required: true,
        enum: ["l1", "l2", "elasticnet", "none"]
      },
      C: {
        type: "number",
        required: true,
        minimum: 0.0001,
        maximum: 1000
      },
      auto_preprocess: {
        type: "boolean",
        required: false,
        default: false,
        description:
          "Set true for raw-model cross-validation with categorical " +
          "features or missing values. Imputation and one-hot encoding " +
          "are fitted separately inside each training fold."
      }
    }
  },
  {
    type: "node-evaluation-test-and-score",
    name: "Test and Score",
    category: "evaluation",
    description: "Evaluate classification or regression models.",
    inputs: { data: "Data", model: "Model" },
    outputs: {
      evaluation_results: "EvaluationResults",
      predictions: "Predictions"
    },
    parameters: {
      evaluation_type: {
        type: "string",
        required: true,
        enum: ["cross_validation", "random_sampling"]
      },
      n_splits: {
        type: "integer",
        required: false,
        default: 5,
        minimum: 2,
        description: "Number of folds for cross_validation."
      },
      stratified: {
        type: "boolean",
        required: false,
        default: true,
        description:
          "Use stratified folds for classification. Required by " +
          "the current Python Test and Score implementation."
      }
    }
  }
]);

function getNodeCatalog() {
  return NODE_CATALOG;
}

function getNodeDefinition(type) {
  return NODE_CATALOG.find(node => node.type === type) || null;
}

function getCatalogForPrompt() {
  return JSON.stringify(NODE_CATALOG, null, 2);
}

module.exports = {
  NODE_CATALOG,
  getNodeCatalog,
  getNodeDefinition,
  getCatalogForPrompt
};
