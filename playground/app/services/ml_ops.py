import numpy as np
import pandas as pd
from typing import Tuple
from typing import List, Tuple, Optional
import pandas as pd
from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import AdaBoostRegressor


class MLOps:
    """
    An interface for interacting with SciKit Learn models.
    In case of changing the library, only this class needs to be updated
    instead of the whole codebase.
    """

    def train_test_split(data, test_size):
        """
        Split data into training and testing sets based on a given ratio.
        """
        # Import the necessary libraries
        from sklearn.model_selection import train_test_split

        # Split the data
        train_data, test_data = train_test_split(data, test_size=test_size)

        return train_data, test_data


    def label_encode(target_data):
        """
        Convert string target data to integer.
        """
        # Import the necessary libraries
        from sklearn.preprocessing import LabelEncoder

        # Convert the target data
        label_encoder = LabelEncoder()
        target_data = label_encoder.fit_transform(target_data)

        return target_data


    def logistic_regression(feature_data, target_data, solver="lbfgs", penalty="l2", C=1.0, class_weight=None):
        """
        Apply logistic regression to the data.
        """
        # Import the necessary libraries
        from sklearn.linear_model import LogisticRegression

        # Create the model
        raw_model = LogisticRegression(penalty=penalty, dual=False, tol=0.0001, C=C,
                 fit_intercept=True, intercept_scaling=1, class_weight=class_weight,
                 random_state=None, max_iter=100, solver=solver,
                 multi_class="auto", verbose=0, n_jobs=1)
        model = LogisticRegression(penalty=penalty, dual=False, tol=0.0001, C=C,
                 fit_intercept=True, intercept_scaling=1, class_weight=class_weight,
                 random_state=None, max_iter=100, solver=solver,
                 multi_class="auto", verbose=0, n_jobs=1)
        
        # Check if target and feature data are provided
        if feature_data is None or target_data is None:
            return raw_model, model

        # Fit the model
        model.fit(feature_data, target_data)

        return raw_model, model

    
    def linear_regression(feature_data, target_data, fit_intercept=True, regularization="none", alpha=1.0, l1_ratio=None):
        """
        Apply linear regression to the data with optional regularization.
        """
        from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet

        # Select the appropriate model based on regularization
        if regularization == "ridge":
            model = Ridge(alpha=alpha, fit_intercept=fit_intercept)
            raw_model = Ridge(alpha=alpha, fit_intercept=fit_intercept)
        elif regularization in ["lasso", "l1"]:
            model = Lasso(alpha=alpha, fit_intercept=fit_intercept)
            raw_model = Lasso(alpha=alpha, fit_intercept=fit_intercept)
        elif regularization == "elasticnet":
            if l1_ratio is None:
                raise ValueError("ElasticNet requires 'l1_ratio' parameter.")
            model = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, fit_intercept=fit_intercept)
            raw_model = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, fit_intercept=fit_intercept)
        else:  # No regularization
            model = LinearRegression(fit_intercept=fit_intercept)
            raw_model = LinearRegression(fit_intercept=fit_intercept)
        
        # Check if target and feature data are provided
        if feature_data is None or target_data is None:
            return raw_model, model

        # Label encode the target data if it is not numeric
        encoded = False
        if target_data.dtypes == "object":
            encoded = True
            target_data = MLOps.label_encode(target_data)

        # Fit the model
        model.fit(feature_data, target_data)

        return raw_model, model

    def svm( feature_data, target_data, svm_type="SVM", kernel="rbf", C=1.0, degree=3, gamma=0.04, coef0=0.0, v=0.5, tol=0.001, max_iter=100):
        """
        Apply SVM to the data.

        Parameters:
        - feature_data: Features of the dataset.
        - target_data: Target labels of the dataset.
        - svm_type: "SVM" for C-Support Vector Classification, "v-SVM" for Nu-Support Vector Classification.
        - kernel: Kernel type (e.g., "linear", "poly", "rbf", "sigmoid").
        - C: Regularization parameter (for "SVM").
        - degree: Degree of the polynomial kernel (used only for "poly").
        - gamma: Kernel coefficient for "rbf", "poly", and "sigmoid" kernels ("scale", "auto", or float).
        - coef0: Independent term in kernel function (used for "poly" and "sigmoid").
        - v: Complexity bound for "v-SVM".
        - tol: Numerical tolerance for stopping criteria.
        - max_iter: Maximum number of iterations (-1 for unlimited).

        Returns:
        - raw_model: Unfitted SVM model.
        - model: Fitted SVM model.
        """

        # Validate kernel type
        if kernel not in ["linear", "poly", "rbf", "sigmoid"]:
            raise ValueError("Unsupported kernel type. Choose from ['linear', 'poly', 'rbf', 'sigmoid'].")

        # Validate SVM type
        if svm_type not in ["SVM", "v-SVM"]:
            raise ValueError("Unsupported SVM type. Choose either 'SVM' or 'v-SVM'.")

        # Validate gamma
        if isinstance(gamma, str) and gamma not in ["scale", "auto"]:
            raise ValueError("Invalid gamma value. Use a float, 'scale', or 'auto'.")

        # Prepare kernel-specific parameters
        kernel_params = {"kernel": kernel, "tol": tol}
        if max_iter is not None:
            kernel_params["max_iter"] = max_iter if max_iter > 0 else -1

        if kernel == "poly":
            kernel_params["degree"] = degree
            kernel_params["coef0"] = coef0

        if kernel in ["rbf", "poly", "sigmoid"]:
            kernel_params["gamma"] = gamma

        if kernel == "sigmoid":
            kernel_params["coef0"] = coef0
        
        from sklearn.svm import SVC, NuSVC
         
        # Initialize the appropriate model
        if svm_type == "SVM":
            raw_model = SVC(C=C, **kernel_params)
        elif svm_type == "v-SVM":
            raw_model = NuSVC(nu=v, **kernel_params)

        print(f"Raw model:\n{raw_model}")

        # Check if target and feature data are provided
        if feature_data is None or target_data is None:
            return raw_model, None

        # Fit the model
        model = raw_model.fit(feature_data, target_data)
        print(f"Fitted model:\n{model}")

        return raw_model, model


    


    
   

    def kmeans(feature_data, n_clusters=3, normalize=False, init="k-means++", 
            n_init=10, max_iter=300, tol=0.0001, random_state=42):
        """
        Apply K-Means Clustering to the data.

        Parameters:
        - feature_data: Features of the dataset (DataFrame).
        - n_clusters: Number of clusters (fixed).
        - normalize: Whether to normalize the input data.
        - init: Initialization method ("k-means++" or "random").
        - n_init: Number of re-runs for KMeans clustering.
        - max_iter: Maximum number of iterations for convergence.
        - tol: Stopping criteria tolerance.
        - random_state: Random seed for reproducibility.

        Returns:
        - clustered_data: DataFrame with cluster labels as a meta attribute.
        - centroids: DataFrame containing initial centroid coordinates.
        - model: Fitted KMeans model.
        """
        from sklearn.cluster import KMeans
        from sklearn.preprocessing import StandardScaler
        # Validate initialization method
        if init not in ["k-means++", "random"]:
            raise ValueError("Unsupported init method. Choose either 'k-means++' or 'random'.")

        # Normalize feature data if required
        if normalize:
            scaler = StandardScaler()
            feature_data = scaler.fit_transform(feature_data)
        else:
            feature_data = feature_data.to_numpy()  # Convert to NumPy array

        # Apply K-Means
        kmeans = KMeans(
            n_clusters=n_clusters,
            init=init,
            n_init=n_init,
            max_iter=max_iter,
            tol=tol,
            random_state=random_state
        )

        model = kmeans.fit(feature_data)
        labels = model.labels_

        # Add cluster labels as a meta attribute to the dataset
        clustered_data = pd.DataFrame(feature_data, columns=[f"feature_{i}" for i in range(feature_data.shape[1])])
        clustered_data["Cluster"] = labels  # Add cluster labels

        # Create a DataFrame for the centroids
        centroids = pd.DataFrame(model.cluster_centers_, columns=[f"feature_{i}" for i in range(feature_data.shape[1])])
        
        return kmeans, clustered_data, centroids, model



    def get_predictions(model, feature_data, target_data):
        """
        Get the predictions from the model.
        Returns the predictions and the data with the predictions.
        """
        # Get the predictions
        predictions = model.predict(feature_data)

         # Concatenate the feature data and the predictions
        predictions_data = feature_data.copy()
        predictions_data["target"] = target_data
        predictions_data["predicted_target"] = predictions

        return predictions, predictions_data


    def get_scores(model, target_data, predictions: [dict, None] = None, feature_data=None):
        """
        Get the scores from the model.
        args:
        model: Model object
        feature_data: Feature data
        target_data: Target data
        returns:
        scores: Scores from the model, dict of:
            Classification:
            - accuracy: Accuracy score
            - precision: Precision score
            - recall: Recall score
            - f1: F1 score
            Regression:
            - nmse: Negative mean squared error
            - r2: R^2 score
        """
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        from sklearn.metrics import mean_squared_error, r2_score

        # Check if the model is a regression model
        is_model_regression = MLOps.is_regression(model)

        # Get the predictions
        if predictions is None:
            predictions, _ = MLOps.get_predictions(model, feature_data, target_data)

        # Initialize the scores
        scores = {
            "accuracy": np.array([]),
            "precision": np.array([]),
            "recall": np.array([]),
            "f1": np.array([]),
            "nmse": np.array([]),
            "r2": np.array([]),
        }

        # Calculate scores
        if is_model_regression:
            nmse = mean_squared_error(target_data, predictions)
            r2 = r2_score(target_data, predictions)
            scores["nmse"] = np.append(scores["nmse"], nmse)
            scores["r2"] = np.append(scores["r2"], r2)
        else:
            scores["accuracy"] = np.append(scores["accuracy"], accuracy_score(target_data, predictions))
            scores["precision"] = np.append(scores["precision"], precision_score(target_data, predictions, average="weighted"))
            scores["recall"] = np.append(scores["recall"], recall_score(target_data, predictions, average="weighted"))
            scores["f1"] = np.append(scores["f1"], f1_score(target_data, predictions, average="weighted"))
        
        # Get mean scores, handling empty arrays
        scores = {k: v.mean() if len(v) > 0 else np.nan for k, v in scores.items()}
        
        # Handle NaN values by converting them to None (null in JSON)
        for key, value in scores.items():
            if np.isnan(value):
                scores[key] = None
        
        return scores
        


    def is_regression(model):
        """
        Check if the model is a regression model.
        """
        # Import the necessary libraries
        from sklearn.base import is_regressor

        return is_regressor(model)
    

    def is_classification(model):
        """
        Check if the model is a classification model.
        """
        # Import the necessary libraries
        from sklearn.base import is_classifier

        return is_classifier(model)


    def get_confusion_matrix(model, feature_data, target_data):
        """
        Get the confusion matrix from the model.
        """
        # Import the necessary libraries
        from sklearn.metrics import confusion_matrix

        # Get the predictions
        predictions = model.predict(feature_data)

        # Get the confusion matrix
        confusion_matrix_data = confusion_matrix(target_data, predictions).tolist()
        return confusion_matrix_data

    @staticmethod
    def random_forest(X, y, n_estimators=100, max_depth=None, min_samples_split=2, 
                     min_samples_leaf=1, task_type="classification"):
        """
        Apply random forest model
        """
        from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
        
        # Choose model based on task type
        if task_type == "classification":
            raw_model = RandomForestClassifier(
                n_estimators=n_estimators,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf
            )
            model = RandomForestClassifier(
                n_estimators=n_estimators,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf
            )
        else:
            raw_model = RandomForestRegressor(
                n_estimators=n_estimators,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf
            )
            model = RandomForestRegressor(
                n_estimators=n_estimators,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                min_samples_leaf=min_samples_leaf
            )
        
        # Check if target and feature data are provided
        if X is None or y is None:
            return raw_model, model
        
        if task_type == "classification":
            # Encode the target data
            y = MLOps.label_encode(y)


        # Fit model
        model.fit(X, y)
        
        return raw_model, model

    @staticmethod
    def get_roc_curve(model, feature_data, target_data):
        """
        Get the ROC curve data from the model.
        """
        from sklearn.metrics import roc_curve, auc
        from sklearn.preprocessing import label_binarize
        import numpy as np

        # Get predictions probabilities
        if hasattr(model, "predict_proba"):
            y_pred_proba = model.predict_proba(feature_data)
        else:
            return None  # Model doesn't support probability predictions

        # Handle binary and multiclass cases
        classes = model.classes_
        n_classes = len(classes)
        
        if n_classes == 2:
            # Binary classification
            fpr, tpr, _ = roc_curve(target_data, y_pred_proba[:, 1])
            roc_auc = auc(fpr, tpr)
            
            return {
                "type": "binary",
                "data": [{
                    "fpr": fpr.tolist(),
                    "tpr": tpr.tolist(),
                    "auc": float(roc_auc) if not np.isnan(roc_auc) else None,
                    "class": str(classes[1])
                }]
            }
        else:
            # Multiclass classification
            y_test_bin = label_binarize(target_data, classes=classes)
            roc_data = []
            
            for i in range(n_classes):
                fpr, tpr, _ = roc_curve(y_test_bin[:, i], y_pred_proba[:, i])
                roc_auc = auc(fpr, tpr)
                roc_data.append({
                    "fpr": fpr.tolist(),
                    "tpr": tpr.tolist(),
                    "auc": float(roc_auc) if not np.isnan(roc_auc) else None,
                    "class": str(classes[i])
                })
            
            return {
                "type": "multiclass",
                "data": roc_data
            }

    @staticmethod
    def pca(feature_data, n_components=None, explained_variance=None):
        """
        Apply Principal Component Analysis (PCA) to the data.
        
        :param feature_data: Input feature data
        :param n_components: Number of components to keep
        :param explained_variance: Percentage of variance to explain
        :return: Transformed data and PCA object
        """
        # Import the necessary libraries
        from sklearn.preprocessing import StandardScaler
        from sklearn.decomposition import PCA
        
        # Standardize the data
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(feature_data)
        
        # Determine number of components
        if explained_variance is not None:
            pca = PCA(n_components=explained_variance, svd_solver='full')
        else:
            pca = PCA(n_components=n_components)
        
        # Fit and transform the data
        transformed_data = pca.fit_transform(scaled_data)
        
        return transformed_data, pca
    
    @staticmethod
    def compute_correlations(data: pd.DataFrame, correlation_type: str = "pearson", target: str = "all") -> Tuple[pd.DataFrame, list]:
        """
        Compute correlation coefficients for selected features.

        Parameters:
        - data: (pd.DataFrame) Input dataset with numeric features.
        - correlation_type: (str) "pearson" or "spearman".
        - target: (str) "all" for all pairs, or a specific feature to compare against others.

        Returns:
        - correlations_df: DataFrame with correlation values.
        - correlation_results: List of dictionaries containing formatted correlation pairs.
        """
        from scipy.stats import pearsonr, spearmanr

        # Validate correlation type
        if correlation_type not in ["pearson", "spearman"]:
            raise ValueError("Invalid correlation type. Choose 'pearson' or 'spearman'.")

        features = data.select_dtypes(include=["number"]).columns  # Only numerical features

        # Compute correlation matrix
        if target == "all":
            if correlation_type == "pearson":
                corr_matrix = data[features].corr(method="pearson")
            else:
                corr_matrix = data[features].corr(method="spearman")

            # Convert correlation matrix to list format
            correlation_results = []
            for i, feature1 in enumerate(features):
                for j, feature2 in enumerate(features):
                    if i < j:  # Avoid duplicate pairs
                        correlation_results.append({
                            "feature1": feature1,
                            "feature2": feature2,
                            "value": round(corr_matrix.loc[feature1, feature2], 3)  # Format to 3 decimals
                        })
        
        else:  # Target-based correlation (Single feature vs. all others)
            if target not in features:
                raise ValueError(f"Target feature '{target}' is not a numerical column.")

            correlation_results = []
            for feature in features:
                if feature == target:
                    continue
                if correlation_type == "pearson":
                    corr_value, _ = pearsonr(data[target], data[feature])
                else:
                    corr_value, _ = spearmanr(data[target], data[feature])

                correlation_results.append({
                    "feature1": feature,
                    "feature2": target,
                    "value": round(corr_value, 3)
                })

        # Convert to DataFrame for output
        correlations_df = pd.DataFrame(correlation_results)

        return correlations_df, correlation_results

    @staticmethod
    def train_neural_network(data, features, target, hidden_layers, activation, solver, regularization, max_iterations, replicable):
        """
        Train a Neural Network using MLPClassifier or MLPRegressor.

        Parameters:
        - data: DataFrame with dataset.
        - features: List of feature column names.
        - target: Target column name.
        - hidden_layers: Tuple representing the structure of hidden layers.
        - activation: Activation function ("relu", "tanh", "logistic", "identity").
        - solver: Optimization algorithm ("adam", "sgd", "lbfgs").
        - regularization: Alpha (L2 regularization) value.
        - max_iterations: Maximum number of iterations.
        - replicable: Whether to use a fixed random state for reproducibility.

        Returns:
        - model: Trained neural network model.
        - training_loss: List of loss values during training.
        """
        from sklearn.neural_network import MLPClassifier, MLPRegressor
        from sklearn.preprocessing import StandardScaler, LabelEncoder

        # Set random state if replicable training is enabled
        random_state = 42 if replicable else None

        classification_task = False
        # Choose model type (classification or regression)
        if classification_task:
            model = MLPClassifier(
                hidden_layer_sizes=tuple(hidden_layers),
                activation=activation,
                solver=solver,
                alpha=regularization,
                max_iter=max_iterations,
                random_state=random_state,
                verbose=True  # Enable logging for loss tracking
            )
            raw_model = MLPClassifier(
                hidden_layer_sizes=tuple(hidden_layers),
                activation=activation,
                solver=solver,
                alpha=regularization,
                max_iter=max_iterations,
                random_state=random_state,
                verbose=True
            )
        else:
            model = MLPRegressor(
                hidden_layer_sizes=tuple(hidden_layers),
                activation=activation,
                solver=solver,
                alpha=regularization,
                max_iter=max_iterations,
                random_state=random_state,
                verbose=True
            )
            raw_model = MLPRegressor(
                hidden_layer_sizes=tuple(hidden_layers),
                activation=activation,
                solver=solver,
                alpha=regularization,
                max_iter=max_iterations,
                random_state=random_state,
                verbose=True
            )
        
        # Check if target and feature data are provided
        if data is None or features is None or target is None:
            return raw_model, model, []

        # Extract features and target
        X = data[features].values
        y = data[target].values

        # Normalize features
        scaler = StandardScaler()
        X = scaler.fit_transform(X)

        # Encode target if categorical (classification task)
        if data[target].dtype == 'object' or len(set(y)) <= 10:  
            classification_task = True
            encoder = LabelEncoder()
            y = encoder.fit_transform(y)

        # Train model
        model.fit(X, y)

        # Extract loss history (if available)
        training_loss = getattr(model, "loss_curve_", [])

        return raw_model, model, training_loss
    
        
    @staticmethod
    def apply_tsne(data, features, normalize, apply_pca, pca_components, initialization, distance_metric, perplexity, preserve_global_structure, exaggeration, color_column=None):
        """
        Apply t-SNE for dimensionality reduction and visualization.

        Parameters:
        - data: DataFrame containing the dataset.
        - features: List of feature column names.
        - normalize: Whether to normalize data before applying t-SNE.
        - apply_pca: Whether to apply PCA preprocessing.
        - pca_components: Number of PCA components if PCA is applied.
        - initialization: t-SNE initialization method ("pca" or "spectral").
        - distance_metric: Distance metric for t-SNE ("euclidean", "manhattan", "cosine").
        - perplexity: Perplexity parameter for t-SNE.
        - preserve_global_structure: If True, modifies t-SNE settings to retain global structure.
        - exaggeration: Exaggeration factor for early optimization.
        - color_column: Optional, column name to use for coloring clusters.

        Returns:
        - transformed_data: DataFrame with transformed t-SNE coordinates and labels (if selected).
        """
        from sklearn.manifold import TSNE
        from sklearn.preprocessing import StandardScaler
        from sklearn.decomposition import PCA

        # Extract feature data
        X = data[features].values

        # Normalize features if requested
        if normalize:
            scaler = StandardScaler()
            X = scaler.fit_transform(X)

        # Apply PCA for preprocessing if enabled
        if apply_pca:
            pca = PCA(n_components=pca_components)
            X = pca.fit_transform(X)

        # Define t-SNE parameters
        tsne_params = {
            "n_components": 2,  # Always 2D output for visualization
            "perplexity": perplexity,
            "metric": distance_metric,
            "early_exaggeration": exaggeration,
            "init": initialization.lower(),  # "pca" or "spectral"
            "random_state": 42,  # Ensures reproducibility
        }

        # Adjust learning rate if preserving global structure
        if preserve_global_structure:
            tsne_params["learning_rate"] = 10  # A lower learning rate can help preserve structure

        # Apply t-SNE transformation
        tsne = TSNE(**tsne_params)
        transformed_X = tsne.fit_transform(X)

        # Store results in a DataFrame
        transformed_data = pd.DataFrame(transformed_X, columns=["t-SNE 1", "t-SNE 2"])

        # Eğer bir renk sütunu seçildiyse, onu ekleyelim
        if color_column and color_column in data.columns:
            transformed_data["Label"] = data[color_column]
        else:
            transformed_data["Label"] = "Unknown"

        return transformed_data


    @staticmethod
    def gradient_boosting(feature_data, target_data,
                            n_estimators=100, learning_rate=0.1, replicable_training=True,
                            max_depth=3, min_samples_split=2, subsample=1.0,
                            task_type="classification"):
        """
        Apply gradient boosting to the data.
        """
        from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor

        # Is replicable
        if replicable_training:
            random_state = 42
        else:
            random_state = None

        # Choose model based on task type
        if task_type == "classification":
            raw_model = GradientBoostingClassifier(
                n_estimators=n_estimators,
                learning_rate=learning_rate,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                subsample=subsample,
                random_state=random_state
            )
            model = GradientBoostingClassifier(
                n_estimators=n_estimators,
                learning_rate=learning_rate,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                subsample=subsample,
                random_state=random_state
            )
        else:
            raw_model = GradientBoostingRegressor(
                n_estimators=n_estimators,
                learning_rate=learning_rate,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                subsample=subsample,
                random_state=random_state
            )
            model = GradientBoostingRegressor(
                n_estimators=n_estimators,
                learning_rate=learning_rate,
                max_depth=max_depth,
                min_samples_split=min_samples_split,
                subsample=subsample,
                random_state=random_state
            )

        # Check if target and feature data are provided
        if feature_data is None or target_data is None:
            return raw_model, model

        if task_type == "regression":
            # Encode the target data
            target_data = MLOps.label_encode(target_data)

        # Fit model
        model.fit(feature_data, target_data)

        return raw_model, model


    @staticmethod
    def get_scoring_function(scorer: str):
        """
        Get a scoring function based on the provided scorer.
        Handles both classification and regression metrics.
        """
        from sklearn.metrics import (
            accuracy_score, precision_score, recall_score, f1_score, matthews_corrcoef,
            log_loss, roc_auc_score, mean_absolute_error, mean_squared_error, r2_score
        )

        # Define classification and regression scoring functions
        classification_metrics = {
            "roc_auc": roc_auc_score,
            "accuracy": accuracy_score,
            "precision": precision_score,
            "recall": recall_score,
            "recall_spec": recall_score,
            "f1": f1_score,
            "matthews_corrcoef": matthews_corrcoef,
            "log_loss": log_loss,
        }

        regression_metrics = {
            "r2": r2_score,
            "mae": mean_absolute_error,
            "mse": mean_squared_error
        }

        # Check if scorer is in classification or regression metrics
        if scorer in classification_metrics:
            return classification_metrics[scorer]
        elif scorer in regression_metrics:
            return regression_metrics[scorer]
        else:
            raise ValueError(f"Scorer '{scorer}' is not supported. Choose from: {list(classification_metrics.keys()) + list(regression_metrics.keys())}")
    

    @staticmethod
    def make_scorer(scorer: str, y_true=None, average="__UNDEFINED__"):
        """
        Make a scorer function based on the provided metric.
        """
        from sklearn.metrics import make_scorer

        # Set default average parameter
        if average == "__UNDEFINED__":
            if scorer in ["accuracy", "f1", "precision", "recall", "matthews_corrcoef", "log_loss"]:
                average = "weighted"
            else:
                average = None

        # Get the scoring function
        scoring_fn = MLOps.get_scoring_function(scorer)

        # Create the scorer function
        # AUC is a multi-class metric
        if scorer == "auc":
            return make_scorer(scoring_fn, average=average, multi_class="ovr")
        
        # Accuracy, R2, MSE, MAE are simple metrics
        if scorer in ["accuracy", "matthews_corrcoef", "r2", "mse", "mae"]:
            return make_scorer(scoring_fn)
        
        # Log loss needs unique labels
        if scorer == "log_loss":
            return make_scorer(scoring_fn, labels=np.unique(y_true))
        
        # Recall Specifity needs pos_label
        if scorer == "recall_spec":
            return make_scorer(scoring_fn, average=average, pos_label=0)
        
        return make_scorer(scoring_fn, average=average)


    @staticmethod
    def feature_importance(model, features, target, score="roc_auc", n_permutations=5):
        """
        Calculate feature importance using permutation importance.
        Supports both classification and regression models.
        
        Args:
            model: scikit-learn model (Classifier or Regressor)
            features: DataFrame (Feature data)
            target: Series (Target data)
            score: str (Scoring method)
            n_permutations: int (Number of permutations)
        
        Returns:
            dict: Feature importances
        """
        from sklearn.inspection import permutation_importance

        # Encode target if it contains strings
        if target.dtype == 'object':
            target = MLOps.label_encode(target)

        # Validate scoring method
        if score in ["roc_auc", "accuracy", "f1", "precision", "recall", "matthews_corrcoef", "recall_spec", "log_loss"]:
            if MLOps.is_regression(model):
                raise ValueError(f"Scoring method '{score}' is for classification, but the model is a regressor.")
            scoring = MLOps.make_scorer(score, y_true=target)

        elif score in ["r2", "mae", "mse"]:
            if MLOps.is_classification(model):
                raise ValueError(f"Scoring method '{score}' is for regression, but the model is a classifier.")
            scoring = MLOps.make_scorer(score)
        
        else:
            raise ValueError(f"Unknown scoring method: {score}")

        # Calculate permutation importance
        result = permutation_importance(
            model, features, target,
            n_repeats=n_permutations,
            random_state=42,
            scoring=scoring
        )

        return result

    @staticmethod
    def decision_tree(X, y, criterion="gini", max_depth=None, min_samples_split=2, min_samples_leaf=1, min_impurity_decrease=0.0):
        """
        Apply decision tree classification to the data.
        
        Parameters:
        -----------
        X : array-like
            Feature data
        y : array-like
            Target data
        criterion : str, default="gini"
            The function to measure the quality of a split
        max_depth : int, default=None
            Maximum depth of the tree
        min_samples_split : int, default=2
            Minimum samples required to split a node
        min_samples_leaf : int, default=1
            Minimum samples required in a leaf node
        min_impurity_decrease : float, default=0.0
            Minimum decrease in impurity required for split (derived from sufficient_majority)
        """
        from sklearn.tree import DecisionTreeClassifier
        
        # Create model
        model = DecisionTreeClassifier(
            criterion=criterion,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            min_samples_leaf=min_samples_leaf,
            min_impurity_decrease=min_impurity_decrease,
            random_state=42
        )

        # Fit model if data is provided
        if X is not None and y is not None:
            model.fit(X, y)
            return model, model
        return model, None

    @staticmethod
    def compute_venn_for_three_sets(A: set, B: set, C: set = None):
        """
        A, B, C küme bilgilerini alıp, Venn diyagram bölgelerini hesaplar.
        C opsiyonel olabilir (tek, çift, üçlü set).
        """
        # Sadece A, sadece B, sadece C
        # A∩B, A∩C, B∩C
        # A∩B∩C
        # Boş olmayan her bölgeyi ve değerini döndürür.

        if C is None:
            # Sadece iki kümeyle işlem
            region_counts = {
                frozenset(['A']): len(A - B),
                frozenset(['B']): len(B - A),
                frozenset(['A','B']): len(A & B),
            }
        else:
            # Üç kümeli durum
            region_counts = {
                frozenset(['A']): len(A - B - C),
                frozenset(['B']): len(B - A - C),
                frozenset(['C']): len(C - A - B),
                frozenset(['A','B']): len((A & B) - C),
                frozenset(['A','C']): len((A & C) - B),
                frozenset(['B','C']): len((B & C) - A),
                frozenset(['A','B','C']): len(A & B & C),
            }

        venn_sets = []
        for region, count in region_counts.items():
            if count > 0:
                venn_sets.append({
                    "sets": sorted(list(region)),
                    "value": count
                })
        return venn_sets

    @staticmethod
    def normalize_venn(venn_sets):
        """
        Normalize the 'value' of each region relative to the maximum value.
        
        Args:
            venn_sets: List of dictionaries with keys 'sets' and 'value'
        
        Returns:
            Aynı yapı, ancak 'value' normalize edilmiş (0-1 arası oran).
        """
        if not venn_sets:
            return venn_sets
        
        max_val = max(item["value"] for item in venn_sets)
        if max_val == 0:
            return venn_sets
        
        normalized = []
        for item in venn_sets:
            normalized.append({
                "sets": item["sets"],
                "value": item["value"] / max_val
            })
        return normalized
    
    @staticmethod
    def adaboost(
        X: Optional[pd.DataFrame],
        y: Optional[pd.Series],
        n_estimators: int = 50,
        learning_rate: float = 1.0,
        loss: str = "linear",
        random_state: int = None
    ) -> Tuple[AdaBoostRegressor, dict]:
        """
        Trains an AdaBoost regressor model and returns the raw model and a summary dict.
        """
        from sklearn.ensemble import AdaBoostRegressor
        from sklearn.tree import DecisionTreeRegressor
        # Map loss to lowercase as sklearn expects lowercase
        loss = loss.lower()

        # Base estimator: shallow decision tree
        base_estimator = DecisionTreeRegressor(max_depth=1)

        # Build the model
        raw_model = AdaBoostRegressor(
            base_estimator=base_estimator,
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            loss=loss,
            random_state=random_state
        )

        # Check if target and feature data are provided
        if X is None or y is None:
            return raw_model, None
        
        # Encode the target data
        y = MLOps.label_encode(y)

        # Fit model
        model = raw_model.fit(X, y)

        return raw_model, model

    @staticmethod
    def stacking_classifier(
        models: List[Tuple[str, object]],
        X: Optional[pd.DataFrame],
        y: Optional[pd.Series],
        meta_model: Optional[str] = None,
        cv: int = 5
    ) -> Tuple[object, object]:
        """
        Apply stacking ensemble using scikit-learn's StackingClassifier.

        Parameters:
        - models: list of (name, model) tuples to use as base learners.
        - X: training features
        - y: training labels
        - meta_model: final estimator to use, default is LogisticRegression
        - cv: cross-validation folds (default 5)

        Returns:
        - raw_model: unfitted StackingClassifier
        - model: fitted StackingClassifier (or None if X or y is None)
        """

        # Determine meta learner
        if meta_model == "svm":
            from sklearn.svm import SVC
            final_estimator = SVC(probability=True)
        elif meta_model == "random_forest":
            from sklearn.ensemble import RandomForestClassifier
            final_estimator = RandomForestClassifier()
        else:
            # Default: logistic regression
            final_estimator = LogisticRegression()

        raw_model = StackingClassifier(
            estimators=models,
            final_estimator=final_estimator,
            cv=cv,
            passthrough=False
        )

        # If data is not provided, return only the raw model
        if X is None or y is None:
            return raw_model, None

        model = raw_model.fit(X, y)
        return raw_model, model
    def compute_distance_matrix(data_input, parameters,labels):
        from sklearn.metrics import pairwise_distances
        from sklearn.preprocessing import StandardScaler
        from scipy.stats import rankdata
        
        X = np.array(data_input)
        compare = parameters.get('compare', 'rows')
        metric_key = parameters.get('metric', 'euclidean_normalized')

        # Satır mı sütun mu karşılaştırılacak
        if compare == 'columns':
            X = X.T
            
        else:
            labels = [f"Row {i+1}" for i in range(X.shape[0])]

        # Ekstra özellikleri tanıma
        normalize_required = 'normalized' in metric_key
        absolute_required = 'absolute' in metric_key

        # Temel metriği çıkar (örneğin: "spearman_absolute" → "spearman")
        base_metric = metric_key.replace('_normalized', '').replace('_absolute', '')

        # Normalize gerekiyorsa
        if normalize_required:
            X = StandardScaler().fit_transform(X)

        # Özel metriklere göre işlemler
        if base_metric == 'spearman':
            # Spearman için satırları sıralama (ranking)
            X = np.apply_along_axis(rankdata, axis=1, arr=X)
            dist_matrix = pairwise_distances(X, metric='correlation')
        elif base_metric == 'pearson':
            dist_matrix = pairwise_distances(X, metric='correlation')
        elif base_metric == 'mahalanobis':
            try:
                VI = np.linalg.inv(np.cov(X.T))
                dist_matrix = pairwise_distances(X, metric='mahalanobis', VI=VI)
            except np.linalg.LinAlgError:
                raise ValueError("Mahalanobis metric failed: covariance matrix is singular.")
        else:
            dist_matrix = pairwise_distances(X, metric=base_metric)

        # Mutlak değer gerekiyorsa
        if absolute_required:
            dist_matrix = np.abs(dist_matrix)

        return {
            "type": "distance_matrix",
            "compare": compare,
            "metric": metric_key,
            "labels": labels,
            "values": dist_matrix.tolist()
        }
