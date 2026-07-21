import React, { useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Position,
    Handle,
    ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import BaseNode from './BaseNode';
import { ModalName } from '../NodeModal/NodeModalItem';
import { useTheme } from '../../context/ThemeContext';

// Custom Decision Node Component
const DecisionNode = ({ data }) => {
    const { isDarkMode } = useTheme();
    if (!data) return null;
    return (
        <div className={`px-4 py-2 shadow-lg rounded-lg border-2 ${isDarkMode ? 'border-blue-400 bg-gray-800 text-white' : 'border-blue-500 bg-white'} min-w-[200px]`}>
            <Handle type="target" position={Position.Top} className={`w-3 h-3 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
            <div className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{data.label || "Decision Node"}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                Samples: {data.samples} | Impurity: {data.impurity.toFixed(3)}
            </div>
            <Handle type="source" position={Position.Bottom} className={`w-3 h-3 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
        </div>
    );
};

// Custom Leaf Node Component
const LeafNode = ({ data }) => {
    const { isDarkMode } = useTheme();
    if (!data) return null;
    return (
        <div className={`px-4 py-2 shadow-lg rounded-lg border-2 ${isDarkMode ? 'border-green-400 bg-gray-800 text-white' : 'border-green-500 bg-white'} min-w-[200px]`}>
            <Handle type="target" position={Position.Top} className={`w-3 h-3 ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`} />
            <div className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>{data.label || "Leaf Node"}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                Samples: {data.samples} | Impurity: {data.impurity.toFixed(3)}
            </div>
        </div>
    );
};

const nodeTypes = {
    'tree-node-decision': DecisionNode,
    'tree-node-leaf': LeafNode,
};

const getLayoutedElements = (nodes, edges) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
        rankdir: 'TB',
        nodesep: 80,
        ranksep: 100,
        ranker: 'tight-tree'
    });

    // Add nodes to dagre
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            width: 250,
            height: 80,
        });
    });

    // Add edges to dagre
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Get node positions
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 125,
                y: nodeWithPosition.y - 40,
            }
        };
    });

    return { nodes: layoutedNodes, edges };
};

const TreeViewerNode = ({ id, data, selected }) => {
    const treeData = data?.outputs?.tree?.display_value;
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
        if (!treeData) return { nodes: [], edges: [] };
        return getLayoutedElements(treeData.nodes, treeData.edges);
    }, [treeData]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (treeData) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(treeData.nodes, treeData.edges);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }
    }, [treeData, setNodes, setEdges]);
    
    // Theme context
    const { isDarkMode } = useTheme();

    const modalContent = (
        <div className="w-full h-[600px]">
            <ModalName name="Tree Viewer" />
            <div className={`w-full h-[500px] border rounded-lg ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        // onNodesChange={onNodesChange}
                        // onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        colorMode={isDarkMode ? 'dark' : 'light'}
                        defaultEdgeOptions={{
                            type: 'smoothstep',
                            style: { stroke: isDarkMode ? '#888' : '#666', strokeWidth: 2 },
                            labelStyle: { fill: isDarkMode ? '#ccc' : '#666', fontSize: 12 },
                            labelBgStyle: { fill: isDarkMode ? '#333' : 'white', fillOpacity: isDarkMode ? 0.9 : 0.8 },
                        }}
                    >
                        <Background color={isDarkMode ? '#555' : '#aaa'} gap={16} size={1} />
                        <Controls className={isDarkMode ? 'bg-gray-800 text-white' : ''} />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-visualization-tree-viewer'}
            parameters={data.parameters}
            modalContent={modalContent}
        />
    );
};

export default TreeViewerNode;
