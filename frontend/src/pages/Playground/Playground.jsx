import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { toast } from 'react-toastify';
import Navbar from '../../components/header/Navbar';
import '@xyflow/react/dist/style.css';

// Store
import { usePlaygroundStore } from '../../store/playgroundStore';

// Context
import { useTheme } from '../../context/ThemeContext';

// Components
import { Toolbar } from '../../components/PlaygroundToolbar/PlaygroundToolbar';
import PlaygroundLoadingSpinner from '../../components/Playground/PlaygroundLoadingSpinner/PlaygroundLoadingSpinner';

// Context Menus
import { NodeContextMenu } from '../../components/Nodes/utils/NodeContextMenu';
import { EdgeContextMenu } from '../../components/Nodes/utils/EdgeContextMenu';

// Data Nodes
import FileNode from '../../components/Nodes/FileNode';
import TrainTestSplitNode from '../../components/Nodes/TrainTestSplitNode';
import FeatureStatisticsNode from '../../components/Nodes/FeatureStatisticsNode';
import SaveDataNode from '../../components/Nodes/SaveDataNode';
import ImputeNode from '../../components/Nodes/ImputeNode';

// Visualization Nodes
import DistributionNode from '../../components/Nodes/DistributionNode';
import BarPlotNode from '../../components/Nodes/BarPlotNode';
import BoxPlotNode from '../../components/Nodes/BoxPlotNode';
import LinePlotNode from '../../components/Nodes/LinePlotNode';
import ScatterPlotNode from '../../components/Nodes/ScatterPlotNode';
import HeatmapNode from '../../components/Nodes/HeatmapNode';
import DistanceMapNode from '../../components/Nodes/DistanceMapNode';
import TreeViewerNode from '../../components/Nodes/TreeViewerNode';
import VennDiagramNode from '../../components/Nodes/VennDiagramNode';

// Prediction Nodes
import LogisticRegressionNode from '../../components/Nodes/LogisticRegressionNode';
import LinearRegressionNode from '../../components/Nodes/LinearRegressionNode';
import SVMNode from '../../components/Nodes/SVMNode';
import RandomForestNode from '../../components/Nodes/RandomForestNode';
import GradientBoostingNode from '../../components/Nodes/GradientBoostingNode';
import NeuralNetworkNode from '../../components/Nodes/NeuralNetworkNode';
import DecisionTreeNode from '../../components/Nodes/DecisionTreeNode';
import AdaBoostNode from '../../components/Nodes/AdaBoostNode';
import StackingNode from '../../components/Nodes/StackingNode';

// Evaluation Nodes
import TestAndScoreNode from '../../components/Nodes/TestAndScoreNode';
import PredictionsNode from '../../components/Nodes/PredictionsNode';
import ConfusionMatrixNode from '../../components/Nodes/ConfusionMatrixNode';
import ROCCurveNode from '../../components/Nodes/ROCCurveNode';

// Unsupervised Nodes
import KMeansNode from '../../components/Nodes/KMeansNode';
import PCANode from '../../components/Nodes/PCANode';
import TSNENode from '../../components/Nodes/t-SNENode';
import CorrelationsNode from '../../components/Nodes/CorrelationsNode';


// Explain
import FeatureImportanceNode from '../../components/Nodes/FeatureImportanceNode';

import HierarchicalClusteringNode from '../../components/Nodes/HierarchicalClusteringNode';
import DistanceNode from '../../components/Nodes/DistanceNode';
import DistanceMatrixNode from '../../components/Nodes/DistanceMatrixNode';
import ExplainModelNode from '../../components/Nodes/ExplainModelNode';


const nodeTypes = {
  "node-data-file": FileNode,
  "node-data-feature-statistics": FeatureStatisticsNode,
  "node-data-train-test-split": TrainTestSplitNode,
  "node-data-save-data": SaveDataNode,
  "node-visualization-bar-plot": BarPlotNode,
  "node-visualization-distributions": DistributionNode,
  "node-visualization-box-plot": BoxPlotNode,
  "node-visualization-line-plot": LinePlotNode,
  "node-visualization-scatter-plot": ScatterPlotNode,
  "node-visualization-heatmap": HeatmapNode,
  "node-visualization-tree-viewer": TreeViewerNode,
  "node-visualization-venn-diagram": VennDiagramNode,
  "node-prediction-logistic-regression": LogisticRegressionNode,
  "node-prediction-linear-regression": LinearRegressionNode,
  "node-prediction-random-forest": RandomForestNode,
  "node-prediction-gradient-boosting": GradientBoostingNode,
  "node-supervised-neural-network": NeuralNetworkNode,
  "node-prediction-decision-tree": DecisionTreeNode,
  "node-prediction-svm": SVMNode,
  "node-prediction-adaboost": AdaBoostNode,
  "node-prediction-stacking": StackingNode,
  "node-evaluation-test-and-score": TestAndScoreNode,
  "node-evaluation-predictions": PredictionsNode,
  "node-evaluation-confusion-matrix": ConfusionMatrixNode,
  "node-evaluation-roc-curve": ROCCurveNode,
  "node-unsupervised-pca": PCANode,
  "node-unsupervised-kmeans": KMeansNode,
  "node-unsupervised-tsne": TSNENode,
  "node-unsupervised-hierarchical-clustering": HierarchicalClusteringNode,
  "node-unsupervised-correlations": CorrelationsNode,
  "node-unsupervised-distance": DistanceNode,
  "node-unsupervised-distance-map": DistanceMapNode,
  "node-unsupervised-distance-matrix": DistanceMatrixNode,
  "node-explain-feature-importance": FeatureImportanceNode,
  "node-explain-explain-model": ExplainModelNode,
  "node-transform-impute": ImputeNode,
};

const Playground = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getPlaygroundById } = usePlaygroundStore();
  const dataFetchedRef = React.useRef(false);

  // Theme context
  const { isDarkMode } = useTheme();

  const [contextMenu, setContextMenu] = useState(null);
  const ref = useRef(null);

  React.useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const loadPlayground = async () => {
      try {
        await getPlaygroundById(projectId);
      } catch (error) {
        console.error('Error loading playground:', error);
        navigate('/playground/projects');
        toast.error('The Playground project could not be found.');
      }
    };

    loadPlayground();
  }, [projectId, getPlaygroundById, navigate]);

  const {
    nodes,
    edges,
    viewport,
    onNodesChange,
    onEdgesChange,
    addEdge,
    onViewportChange,
    isProjectLoaded,
    removeNode,
    duplicateNode,
    removeEdge,
  } = usePlaygroundStore();

  const handleError = (error) => {
    console.error('React Flow Error:', error);
    alert('An error occurred. Please try again later.');
  };

  const handleConnect = useCallback((params) => {
      try {
        addEdge(params);
        const { source, target, sourceHandle } = params;
      // console.log('Connection made with:', { source, target, sourceHandle });
      } catch (error) {
        toast.error(error.message);
      }
  }, [addEdge]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      const pane = ref.current.getBoundingClientRect();

      // Calculate menu position
      const menuWidth = 200;
      const menuHeight = 200;

      // Horizontal positioning
      let left = event.clientX;
      if (left + menuWidth > pane.width) {
        left = pane.width - menuWidth;
      }

      // Vertical positioning
      let top = event.clientY - 70;
      if (top + menuHeight > pane.height) {
        // If near bottom, position menu above the cursor
        top = event.clientY - menuHeight + 20;
      }

      setContextMenu({
        type: 'node',
        node,
        top: top,
        left: left,
      });
    },
    [setContextMenu]
  );

  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      event.preventDefault();
      const pane = ref.current.getBoundingClientRect();

      // Calculate menu position
      const menuWidth = 70;
      const menuHeight = 70;

      // Horizontal positioning
      let left = event.clientX;
      if (left + menuWidth > pane.width) {
        left = pane.width - menuWidth;
      }

      // Vertical positioning
      let top = event.clientY - 70;
      if (top + menuHeight > pane.height) {
        // If near bottom, position menu above the cursor
        top = event.clientY - menuHeight;
      }

      setContextMenu({
        type: 'edge',
        edge,
        top: top,
        left: left,
      });
    },
    [setContextMenu]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const onPaneClick = useCallback(() => setContextMenu(null), []);

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Toolbar />
        <div style={{ flex: 1, position: 'relative' }}>
          {isProjectLoaded ? (
              <ReactFlow
                ref={ref}
                nodes={nodes}
                edges={edges}
                viewport={viewport}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onViewportChange={onViewportChange}
                onConnect={handleConnect}
                onError={handleError}
                nodeTypes={nodeTypes}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onPaneClick={onPaneClick}
              colorMode={isDarkMode ? 'dark' : 'light'}
              >
                <Background variant="dots" gap={16} size={1} />
                <Controls />

                {contextMenu && (
                  <div
                    style={{
                    position: 'absolute', 
                      top: contextMenu.top,
                      left: contextMenu.left,
                    zIndex: 1000 
                    }}
                  >
                  {contextMenu.type === 'node' ? (
                      <NodeContextMenu
                        node={contextMenu.node}
                        closeContextMenu={closeContextMenu}
                      />
                    ) : (
                      <EdgeContextMenu
                        edge={contextMenu.edge}
                        closeContextMenu={closeContextMenu}
                      />
                    )}
                  </div>
                )}
              </ReactFlow>
          ) : (
            <PlaygroundLoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
