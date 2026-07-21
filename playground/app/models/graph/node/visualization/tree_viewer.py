from typing import Dict, Literal
import numpy as np
from app.models.graph.input.model_input import ModelInput
from app.models.graph.node.node import BaseNode
from app.models.graph.output.output import BaseOutput
from app.models.graph.output.dict_output import DictOutput
from app.utils.data_validator import Check


"""
Visualize a decision tree model.
"""


class TreeViewerNode(BaseNode):
    """
    Node that takes a tree model as input and returns its structure for visualization.
    """
    name: str = "Tree Viewer"
    type: Literal["node-visualization-tree-viewer"] = "node-visualization-tree-viewer"
    inputs: Dict[str, ModelInput] = {
        "model": ModelInput(name="Model")
    }
    outputs: Dict[str, BaseOutput] = {
        "tree": DictOutput(name="Tree")
    }

    def build(self):
        """
        Build the tree viewer node.
        """
        print(f"Building {self.name} node")

        # Get model input
        model_input_json = self.inputs["model"]._value
        Check(model_input_json, "Model").is_provided().is_(dict)

        # Get raw model
        raw_model = model_input_json.get("raw_model", None)
        Check(raw_model, "Raw Model").is_provided()

        # Check if model is a tree-based model
        if not self._is_tree_model(raw_model):
            raise ValueError("The provided model is not a tree-based model.")

        # Extract tree structure
        tree_data = self._extract_tree_structure(raw_model, model_input_json)

        # Build output
        self.outputs["tree"].build(tree_data)
        return

    def _is_tree_model(self, model):
        """
        Check if the model is a tree-based model.
        """
        # Check for common tree model attributes
        has_tree_attr = hasattr(model, "tree_")
        has_feature_importances = hasattr(model, "feature_importances_")
        
        # Check for specific model types
        from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
        is_decision_tree = isinstance(model, (DecisionTreeClassifier, DecisionTreeRegressor))
        
        return has_tree_attr or has_feature_importances or is_decision_tree

    def _extract_tree_structure(self, model, model_input_json):
        """
        Extract the tree structure from the model.
        """
        from sklearn.tree import _tree
        
        # Get feature names and target name
        features = model_input_json.get("features", [])
        target = model_input_json.get("target", "target")
        
        # Get tree structure
        tree = model.tree_
        
        # Initialize nodes and edges lists for React Flow
        nodes = []
        edges = []
        
        # Function to recursively extract tree structure
        def recurse(node_id, parent_id=None, edge_label=""):
            if node_id == _tree.TREE_LEAF:
                return
            
            # Get node information
            if tree.feature[node_id] != _tree.TREE_UNDEFINED:
                # Internal node
                feature_idx = tree.feature[node_id]
                threshold = tree.threshold[node_id]
                
                # Get feature name
                feature_name = f"feature_{feature_idx}"
                if features and feature_idx < len(features):
                    feature_name = features[feature_idx]
                
                # Create node
                node_label = f"{feature_name} <= {threshold:.2f}"
                node_type = "decision"  # More specific type for decision nodes
            else:
                # Leaf node
                node_label = self._get_leaf_value(tree, node_id, model)
                node_type = "leaf"
            
            # Add node to nodes list
            node = {
                "id": str(node_id),
                "data": {
                    "label": node_label,
                    "type": node_type,
                    "samples": int(tree.n_node_samples[node_id]),
                    "impurity": float(tree.impurity[node_id])
                },
                "type": f"tree-node-{node_type}"  # Add specific node type for styling
            }
            nodes.append(node)
            
            # Add edge from parent to this node
            if parent_id is not None:
                # Determine edge type based on the direction (left/right)
                is_left_child = node_id == tree.children_left[parent_id]
                edge_type = "true-branch" if is_left_child else "false-branch"
                
                edge = {
                    "id": f"e{parent_id}-{node_id}",
                    "source": str(parent_id),
                    "target": str(node_id),
                    "label": edge_label,
                    "type": "default" # f"tree-edge-{edge_type}" # TODO: Add custom edge types
                }
                edges.append(edge)
            
            # Recurse on children
            left_child = tree.children_left[node_id]
            right_child = tree.children_right[node_id]
            
            if left_child != _tree.TREE_LEAF:
                recurse(left_child, node_id, "True")
            
            if right_child != _tree.TREE_LEAF:
                recurse(right_child, node_id, "False")
        
        # Start recursion from root
        recurse(0)
        
        return {
            "nodes": nodes,
            "edges": edges,
            "model_type": type(model).__name__,
            "feature_names": features,
            "target_name": target
        }
    
    def _get_leaf_value(self, tree, node_id, model):
        """
        Get the value representation for a leaf node.
        """
        # Get class probabilities or regression value
        value = tree.value[node_id]
        
        # Check if it's a classifier or regressor
        if hasattr(model, "classes_"):
            # Classification - show class probabilities
            class_probs = value[0] / np.sum(value[0])
            max_class_idx = np.argmax(class_probs)
            max_prob = class_probs[max_class_idx]
            
            # Get class name
            class_name = str(model.classes_[max_class_idx])
            
            return f"Class: {class_name} ({max_prob:.2f})"
        else:
            # Regression - show predicted value
            return f"Value: {value[0][0]:.2f}" 