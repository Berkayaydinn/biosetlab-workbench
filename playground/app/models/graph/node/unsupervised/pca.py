from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.data_output import DataOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data

import pandas as pd
import numpy as np


class PCANode(BaseNode):
    """
    Node that takes data as input and applies Principal Component Analysis (PCA).
    """
    name: str = "PCA"
    type: Literal["node-unsupervised-pca"] = "node-unsupervised-pca"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DataOutput] = {
        "transformed_data": DataOutput(name="Transformed Data"),
        "components": DataOutput(name="Components"),
        "variance_info": DataOutput(name="Variance Information")
    }

    def build(self):
        """
        Build the PCA node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]
        features = data_dict["features"]

        # Validate features if provided
        if "features" in self.parameters:
            features = self.parameters["features"]
            Check(features, "Features").is_(list).length(0, "greater")
            
            for feature in features:
                Check(feature, "Feature").is_(str).equals("", not_=True)
                Check(feature, f"Feature '{feature}'").in_(data.columns)
            
            # Select only specified features
            feature_data = data[features]
        else:
            # Use the features identified by get_file_data
            feature_data = data[features]

        # Validate and get parameters
        n_components = self.parameters.get('components', None)
        explained_variance = self.parameters.get('explainedVariance', None)

        # Validate number of components
        if n_components is not None:
            Check(n_components, "Number of Components").is_(int).in_between(1, float('inf'), 
                                                                             lower_label="a positive integer")

        # Validate explained variance
        if explained_variance is not None:
            Check(explained_variance, "Explained Variance").is_one_of([int, float]).in_between(0, 1)

        # Apply PCA
        transformed_data, pca = MLOps.pca(
            feature_data.to_numpy(), 
            n_components=n_components, 
            explained_variance=explained_variance
        )

        # Create DataFrame with original features and PCA components
        pca_components_df = pd.DataFrame(
            transformed_data, 
            columns=[f'PC{i+1}' for i in range(transformed_data.shape[1])]
        )

        # Create transformed data with original features and PCA components
        transformed_df = pd.concat([
            data,  # Original data
            pca_components_df  # PCA components
        ], axis=1)

        # Build outputs
        self.outputs["transformed_data"].build(value=transformed_df, skip_column_info=True)
        self.outputs["components"].build(value=pca_components_df, skip_column_info=True)

        # Create variance info DataFrame
        variance_df = pd.DataFrame({
            'Component': list(range(1, len(pca.explained_variance_ratio_) + 1)),
            'Individual Variance': pca.explained_variance_ratio_.tolist(),
            'Cumulative Variance': np.cumsum(pca.explained_variance_ratio_).tolist()
        })

        # Build variance info output
        self.outputs["variance_info"].build(value=variance_df, full=True, skip_column_info=True)
        
        return
