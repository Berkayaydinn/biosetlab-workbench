from typing import List, Union
from app.models.graph.error import Error
from app.models.graph.edge.edge import BaseEdge
from pydantic import BaseModel

# Data Nodes
from app.models.graph.node.data.file import FileNode
from app.models.graph.node.data.feature_statistics import FeatureStatisticsNode
from app.models.graph.node.data.train_test_split import TrainTestSplitNode
from app.models.graph.node.data.save_data import SaveDataNode

# Transform Nodes
from app.models.graph.node.transform.impute import ImputeNode

# Visualization Nodes
from app.models.graph.node.visualization.bar_plot import BarPlotNode
from app.models.graph.node.visualization.box_plot import BoxPlotNode
from app.models.graph.node.visualization.line_plot import LinePlotNode
from app.models.graph.node.visualization.scatter_plot import ScatterPlotNode
from app.models.graph.node.visualization.distributions import DistributionsNode
from app.models.graph.node.visualization.heatmap import HeatmapNode
from app.models.graph.node.visualization.tree_viewer import TreeViewerNode
from app.models.graph.node.visualization.venn_diagram import VennDiagramNode

# Prediction Nodes
from app.models.graph.node.prediction.logistic_regression import LogisticRegression
from app.models.graph.node.prediction.linear_regression import LinearRegression
from app.models.graph.node.prediction.random_forest import RandomForest
from app.models.graph.node.prediction.svm import SVMNode
from app.models.graph.node.prediction.gradient_boosting import GradientBoosting
from app.models.graph.node.prediction.decision_tree import DecisionTree
from app.models.graph.node.prediction.adaboost import AdaBoostNode
from app.models.graph.node.prediction.stacking import StackingNode

# Evaluation Nodes
from app.models.graph.node.evaluation.test_and_score import TestAndScoreNode
from app.models.graph.node.evaluation.predictions import PredictionsNode
from app.models.graph.node.evaluation.confusion_matrix import ConfusionMatrixNode
from app.models.graph.node.evaluation.roc_curve import ROCCurveNode
from app.models.graph.node.unsupervised.pca import PCANode

# Unsupervised Nodes
from app.models.graph.node.unsupervised.k_means import KMeansNode
from app.models.graph.node.unsupervised.correlations import CorrelationsNode
from app.models.graph.node.unsupervised.t_sne import TSNENode
from app.models.graph.node.prediction.neural_networks import NeuralNetworkNode
from app.models.graph.node.unsupervised.distance import DistanceNode
from app.models.graph.node.unsupervised.hierarchical_clustering import HierarchicalClusteringNode
from app.models.graph.node.unsupervised.distance_map import DistanceMapNode
from app.models.graph.node.unsupervised.distance_matrix import DistanceMatrixNode

# Explain Nodes
from app.models.graph.node.explain.feature_importance import FeatureImportanceNode
from app.models.graph.node.explain.explain_model import ExplainModelNode




class Viewport(BaseModel):
    """
    - Represents the viewport of the playground project.
    """

    x: float = 0
    y: float = 0
    zoom: float = 1



class Graph(BaseModel):
    """
    - Represents a graph in the playground project.
    """

    nodes: List[Union[
        # Data Nodes
        FileNode, TrainTestSplitNode, FeatureStatisticsNode, SaveDataNode,

        # Transform Nodes
        ImputeNode,

        # Visualization Nodes
        BarPlotNode, BoxPlotNode, LinePlotNode, ScatterPlotNode, DistributionsNode, HeatmapNode, TreeViewerNode, VennDiagramNode,

        # Prediction Nodes
        LogisticRegression, LinearRegression, RandomForest, SVMNode, GradientBoosting, NeuralNetworkNode, DecisionTree, AdaBoostNode, StackingNode,

        # Evaluation Nodes
        TestAndScoreNode, PredictionsNode, ConfusionMatrixNode, ROCCurveNode,

        # Unsupervised Nodes
        PCANode, KMeansNode , CorrelationsNode, TSNENode, HierarchicalClusteringNode, DistanceNode, DistanceMapNode, DistanceMatrixNode,
        # Explain Nodes
        FeatureImportanceNode, ExplainModelNode
        ]] = []

    edges: List[BaseEdge] = []
    viewport: Viewport = Viewport()
    errors: List[Error] = []

    def __init__(self, **data):
        """
        Method to initialize the class.

        The code below is used to ensure that the nodes in the self.edges
        are the same as the nodes in the self.nodes. This is like pass
        by reference in C++. The nodes in self.edges point to the same
        node object in self.nodes.
        """ 
        
        super().__init__(**data)
        nodes = []
        nodes_map = {}
        for node in self.nodes:
            nodes.append(node)
            nodes_map[node.id] = node

        self.nodes = nodes

        for edge in self.edges:
            edge_source = edge.source
            edge_target = edge.target

            if (edge_source not in nodes_map) or (edge_target not in nodes_map):
                raise ValueError("Source edge or target edge not in nodes")
            
            edge._source = nodes_map[edge_source]
            edge._target = nodes_map[edge_target]