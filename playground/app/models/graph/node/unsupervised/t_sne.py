from typing import Dict, Literal
from app.services.ml_ops import MLOps
from app.models.graph.input.data_input import DataInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.data_output import DataOutput
from app.utils.data_validator import Check
from app.utils.file import get_file_data

"""
Apply t-SNE for dimensionality reduction and visualization.
"""

class TSNENode(BaseNode):
    """
    Node that takes data as input and applies t-SNE for visualization.
    """
    name: str = "t-SNE"
    type: Literal["node-unsupervised-tsne"] = "node-unsupervised-tsne"
    inputs: Dict[str, DataInput] = {
        "data": DataInput(name="Data")
    }
    outputs: Dict[str, DataOutput] = {
        "transformed_data": DataOutput(name="Transformed Data")
    }

    def build(self):
        """
        Build the t-SNE node.
        """
        print(f"Building {self.name} node")

        # Get data
        data_input_json = self.inputs["data"]._value
        data_dict = get_file_data(data_input_json)
        data = data_dict["data_used"]

        # Get feature columns
        Check(self.parameters["features"], "Features").is_provided().is_(list).length(0, "greater")
        for feature in self.parameters["features"]:
            Check(feature, "Feature").is_(str).in_(data.columns)
        features = self.parameters["features"]

        # Get optional color column
        color_column = self.parameters.get("color", None)
        if color_column:
            Check(color_column, "Color Column").is_(str).in_(data.columns)

        # Extract feature data
        feature_data = data[features]

        # t-SNE Parameters
        normalize = self.parameters.get("normalize", False)
        apply_pca = self.parameters.get("applyPCA", False)
        pca_components = self.parameters.get("pcaComponents", 20)
        initialization = self.parameters.get("init", "pca").lower()
        distance_metric = self.parameters.get("metric", "euclidean").lower()
        perplexity = self.parameters.get("perplexity", 30)
        preserve_global_structure = self.parameters.get("globalStructure", False)
        exaggeration = self.parameters.get("exaggeration", 1.0)

        # Apply t-SNE using MLOps.apply_tsne
        transformed_data = MLOps.apply_tsne(
            data=feature_data,
            features=features,
            normalize=normalize,
            apply_pca=apply_pca,
            pca_components=pca_components,
            initialization=initialization,
            distance_metric=distance_metric,
            perplexity=perplexity,
            preserve_global_structure=preserve_global_structure,
            exaggeration=exaggeration
        )

        # Eğer bir renk sütunu seçildiyse, onu ekleyelim
        if color_column:
            transformed_data["Label"] = data[color_column]

        # Build outputs
        self.outputs["transformed_data"].build(value=transformed_data, full=True, name="Transformed Data")

        return
