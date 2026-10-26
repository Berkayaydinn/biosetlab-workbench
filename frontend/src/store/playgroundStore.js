import { create } from "zustand";
import { exampleCrossValidation } from "./playgroundExamples/crossValidation";
import { v4 as uuidv4 } from "uuid";
import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { NodeConfig } from "../config/NodeConfig";
import dagre from "dagre";

export const usePlaygroundStore = create((set, get) => ({
    // Project Data
    id: null,
    name: "Untitled Project",
    description: "No description",
    nodes: [],
    edges: [],
    viewport: {
        x: 0,
        y: 0,
        zoom: 1,
    },

    // Playground Settings
    compactMode: localStorage.getItem("playgroundCompactMode") === "true" || true,
    setCompactMode: (mode) => {
        localStorage.setItem("playgroundCompactMode", mode);
        set({ compactMode: mode });
    },

    // Utility
    isProjectLoaded: false,

    // Setters
    setNodes: (nodes) => {
        set({ nodes });
    },

    setEdges: (edges) => {
        set({ edges });
    },

    onNodesChange: (changes) => {
        set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
        }));
    },

    onEdgesChange: (changes) => {
        set((state) => ({
            edges: applyEdgeChanges(changes, state.edges),
        }));
    },

    onViewportChange: (viewport) => {
        set({ viewport });
    },

    fetchPlaygroundById: async (id) => {
        const response = await fetch(`http://localhost:3000/api/v1/project/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const playgroundData = await response.json();
        set({ isProjectLoaded: true });
        return playgroundData;
    },
    savePlayground: async () => {
        const { id, nodes, edges, viewport } = get();
        if (!id) return;

        try {
            const flowData = {
                nodes: nodes.map((node) => ({
                    id: node.id,
                    name: node.data.name,
                    name_count: node.data.name_count,
                    type: node.type,
                    parameters: node.data.parameters || {},
                    outputs: node.data.outputs || {},
                    position: node.position,
                })),
                edges: edges.map((edge) => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle,
                    targetHandle: edge.targetHandle,
                })),
                viewport,
            };

            await fetch(`http://localhost:3000/api/v1/project/graph/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(flowData),
            });
        } catch (error) {
            console.error('Failed to save playground:', error);
        }

        // console.log("Playground saved");
    },

    getPlaygroundById: async (id) => {
        // Remove nodes and edges from previous playground
        set({ nodes: [], edges: [] });
        
        try {
            let playgroundProjectData;
            if (!id) {
                playgroundProjectData = exampleCrossValidation;
                set({ isProjectLoaded: true });
                // console.log("Using example playground data");
            } else {
                playgroundProjectData = await get().fetchPlaygroundById(id);
                // console.log("Using playground data from backend");
            }
            
            if (!playgroundProjectData || !playgroundProjectData.graph) {
                throw new Error("Invalid playground data received");
            }

            set({ name: playgroundProjectData.name, description: playgroundProjectData.description });

            const playgroundData = playgroundProjectData.graph;

            const nodes = playgroundData.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: { x: node.position.x, y: node.position.y },
                data: {
                    name: node.name,
                    name_count: node.name_count || 0,
                    parameters: node.parameters || {},
                    outputs: node.outputs || {},
                    updated: node.updated || false,
                    success: node.success || false,
                    errors: node.errors || [],
                },
                initialWidth: 10,
                initialHeight: 10,
            }));
            const edges = playgroundData.edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
            }));
            const viewport = playgroundData.viewport;
            set({ nodes, edges, viewport, id });
            set({ isProjectLoaded: true });
        } catch (error) {
            set({ isProjectLoaded: false });
            throw error; // Re-throw the error to be caught by the component
        }
    },


    loadAIWorkflow: (workflow) => {
        if (!workflow || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
            throw new Error("The backend returned an invalid workflow.");
        }

        const inferNodeType = (node) => {
            if (node.type && NodeConfig[node.type]) {
                return node.type;
            }

            const label = String(
                node?.data?.label ||
                node?.data?.name ||
                node?.label ||
                ""
            ).toLowerCase();

            if (
                label.includes("dataset") ||
                label.includes("load data") ||
                label.includes("upload")
            ) {
                return "node-data-file";
            }

            if (
                label.includes("preprocess") ||
                label.includes("clean") ||
                label.includes("impute") ||
                label.includes("missing")
            ) {
                return "node-transform-impute";
            }

            if (
                label.includes("split") ||
                label.includes("train test")
            ) {
                return "node-data-train-test-split";
            }

            if (
                label.includes("classifier") ||
                label.includes("classification") ||
                label.includes("random forest") ||
                label.includes("train model")
            ) {
                return "node-prediction-random-forest";
            }

            if (
                label.includes("evaluate") ||
                label.includes("evaluation") ||
                label.includes("test and score")
            ) {
                return "node-evaluation-test-and-score";
            }

            if (label.includes("pca")) {
                return "node-unsupervised-pca";
            }

            if (
                label.includes("cluster") ||
                label.includes("k-means") ||
                label.includes("kmeans")
            ) {
                return "node-unsupervised-kmeans";
            }

            if (
                label.includes("heatmap") ||
                label.includes("volcano")
            ) {
                return "node-visualization-heatmap";
            }

            if (
                label.includes("plot") ||
                label.includes("chart") ||
                label.includes("visual")
            ) {
                return "node-visualization-scatter-plot";
            }

            if (
                label.includes("statistics") ||
                label.includes("summary")
            ) {
                return "node-data-feature-statistics";
            }

            return "node-data-feature-statistics";
        };

        const cloneParameters = (parameters) => {
            try {
                return JSON.parse(JSON.stringify(parameters || {}));
            } catch {
                return {};
            }
        };

        const normalizedNodes = workflow.nodes.map((node, index) => {
            const type = inferNodeType(node);
            const config = NodeConfig[type];

            return {
                id: String(node.id || `${type}-${uuidv4()}`),
                type,
                position: {
                    x: Number.isFinite(node?.position?.x)
                        ? node.position.x
                        : 120 + index * 280,
                    y: Number.isFinite(node?.position?.y)
                        ? node.position.y
                        : 180,
                },
                data: {
                    name: config.name,
                    name_count: index,
                    parameters: {
                        ...cloneParameters(config.parameters),
                        ...cloneParameters(node.parameters),
                    },
                    updated: false,
                    success: false,
                    errors: [],
                    aiGenerated: true,
                    aiLabel:
                        node?.data?.label ||
                        node?.data?.name ||
                        config.name,
                    aiDescription:
                        node?.data?.description ||
                        "",
                },
                initialWidth: 10,
                initialHeight: 10,
            };
        });

        const nodeMap = new Map(
            normalizedNodes.map((node) => [node.id, node])
        );

        const findCompatibleHandles = (sourceId, targetId) => {
            const sourceNode = nodeMap.get(String(sourceId));
            const targetNode = nodeMap.get(String(targetId));

            if (!sourceNode || !targetNode) {
                return {
                    sourceHandle: undefined,
                    targetHandle: undefined,
                };
            }

            const sourceConfig = NodeConfig[sourceNode.type];
            const targetConfig = NodeConfig[targetNode.type];

            const outputs = sourceConfig?.outputs || [];
            const inputs = targetConfig?.inputs || [];

            for (const output of outputs) {
                for (const input of inputs) {
                    const acceptedTypes = Array.isArray(input.type)
                        ? input.type
                        : [input.type];

                    if (acceptedTypes.includes(output.type)) {
                        return {
                            sourceHandle: output.name,
                            targetHandle: input.name,
                        };
                    }
                }
            }

            return {
                sourceHandle: outputs[0]?.name,
                targetHandle: inputs[0]?.name,
            };
        };

        const normalizedEdges = workflow.edges
            .filter((edge) => {
                return (
                    edge?.source &&
                    edge?.target &&
                    nodeMap.has(String(edge.source)) &&
                    nodeMap.has(String(edge.target))
                );
            })
            .map((edge, index) => {
                const handles = findCompatibleHandles(
                    edge.source,
                    edge.target
                );

                return {
                    id: String(
                        edge.id ||
                        `ai-edge-${index}-${uuidv4()}`
                    ),
                    source: String(edge.source),
                    target: String(edge.target),
                    sourceHandle:
                        edge.sourceHandle ||
                        handles.sourceHandle,
                    targetHandle:
                        edge.targetHandle ||
                        handles.targetHandle,
                };
            });

        // Arrange AI-generated workflow nodes by graph dependencies.
        // Preserve original IDs, parameters, and edge handles.
        const layoutGraph = new dagre.graphlib.Graph();
        layoutGraph.setGraph({
            rankdir: "LR",
            nodesep: 100,
            ranksep: 160,
            marginx: 40,
            marginy: 40,
        });
        layoutGraph.setDefaultEdgeLabel(() => ({}));

        const NODE_WIDTH = 340;
        const NODE_HEIGHT = 180;

        normalizedNodes.forEach((node) => {
            layoutGraph.setNode(node.id, {
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
            });
        });

        normalizedEdges.forEach((edge) => {
            layoutGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(layoutGraph);

        const layoutedNodes = normalizedNodes.map((node) => {
            const position = layoutGraph.node(node.id);

            return {
                ...node,
                position: {
                    x: position.x - NODE_WIDTH / 2,
                    y: position.y - NODE_HEIGHT / 2,
                },
            };
        });

        set({
            nodes: layoutedNodes,
            edges: normalizedEdges,
            viewport: {
                x: 0,
                y: 0,
                zoom: 0.85,
            },
        });

        setTimeout(() => {
            if (get().id) {
                get().savePlayground();
            }
        }, 0);
    },

    generateAIWorkflow: async (prompt, datasetId, targetColumn) => {
        const normalizedPrompt = String(prompt || "").trim();
        const normalizedDatasetId = String(datasetId || "").trim();
        const normalizedTarget = String(targetColumn || "").trim();

        if (!normalizedPrompt) {
            throw new Error("Please describe the workflow.");
        }

        if (!normalizedDatasetId) {
            throw new Error("Please select a dataset.");
        }

        if (!normalizedTarget) {
            throw new Error("Please select a target column.");
        }

        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Please sign in to generate a workflow.");
        }

        const apiBaseUrl = "http://localhost:3838";

        const response = await fetch(
            `${apiBaseUrl}/api/llm/workflow/generate-authorized`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prompt: normalizedPrompt,
                    datasetId: normalizedDatasetId,
                    targetColumn: normalizedTarget,
                }),
            }
        );

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error(
                "The backend returned an unreadable response."
            );
        }

        if (!response.ok || !result?.success) {
            throw new Error(
                result?.message ||
                result?.detail ||
                "Workflow generation failed."
            );
        }

        if (!result.workflow) {
            throw new Error(
                "The response does not contain a workflow."
            );
        }

        get().loadAIWorkflow(result.workflow);

        return result;
    },

    countName: (name) => {
        return get().nodes.filter((node) => node.data.name === name).length;
    },

    addNode: (type) => {
        const node = {
            id: type + "-" + uuidv4(),
            type,
            position: { x: Math.random() * 250, y: Math.random() * 250 },
            data: {
                name: NodeConfig[type].name,
                name_count: get().countName(NodeConfig[type].name),
                parameters: NodeConfig[type].parameters || {},
            },
            initialWidth: 10,
            initialHeight: 10,
        };
        
        set((state) => ({
            nodes: [...state.nodes, node],
        }));
        get().savePlayground();
    },

    addEdge: (params) => {
        const sourceNode = get().getNodeById(params.source);
        const targetNode = get().getNodeById(params.target);
        if (!sourceNode || !targetNode) {
            throw new Error("Source or target node not found.");
        }

        // Check if the edge already exists
        const existingEdge = get().edges.find(
            (edge) =>
                edge.source === params.source &&
                edge.target === params.target &&
                edge.sourceHandle === params.sourceHandle &&
                edge.targetHandle === params.targetHandle
        );
        if (existingEdge) {
            throw new Error("Edge already exists.");
        }

        // Check if the handle types match
        const sourceOutput = NodeConfig[sourceNode.type].outputs.find(
            (output) => output.name === params.sourceHandle
        );
        const targetInput = NodeConfig[targetNode.type].inputs.find(
            (input) => input.name === params.targetHandle
        );
        
        if (!targetInput.type.includes(sourceOutput.type)) {
            throw new Error("Handle types do not match: " + sourceOutput.type + " - " + targetInput.type);
        }

        // Check multi input
        if (!targetInput.multi) {
            const targetEdges = get().edges.filter(
                (edge) => edge.target === params.target && edge.targetHandle === params.targetHandle
            );

            if (targetEdges.length > 0) {
                throw new Error("Multiple input is not allowed for this handle.");
            }
        }

        const edge = {
            id: params.source + "-" + params.target + "-" + uuidv4(),
            source: params.source,
            target: params.target,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle,
        };
        set((state) => ({
            edges: [...state.edges, edge],
        }));
        get().savePlayground();
    },

    getNodeById: (id) => {
        return get().nodes.find((node) => node.id === id);
    },

    getEdgeById: (id) => {
        return get().edges.find((edge) => edge.id === id);
    },

    getEdgeByTarget: (targetNodeId, targetHandle) => {
        return get().edges.find(
            (edge) => edge.target === targetNodeId && edge.targetHandle === targetHandle
        );
    },

    // To get input parameters of a node
    getInputParameters: (targetNodeId, targetHandle) => {
        const edge = get().getEdgeByTarget(targetNodeId, targetHandle);
        if (!edge) {
            return {};
        }
        const sourceNode = get().getNodeById(edge.source);
        if (!sourceNode) {
            return {};
        }
        if (!sourceNode.data.outputs) {
            return {};
        }
        const sourceHandle = edge.sourceHandle;
        return sourceNode.data.outputs[sourceHandle].display_value;
    },

    removeNode: (id) => {
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            edges: state.edges.filter(
                (edge) => edge.source !== id && edge.target !== id
            ),
        }));
        get().savePlayground();
    },

    removeEdge: (id) => {
        set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== id),
        }));
        get().savePlayground();
    },

    updateNode: (id, data) => {
        set((state) => {
            // Only update the specific node's data
            const nodeIndex = state.nodes.findIndex(node => node.id === id);
            if (nodeIndex === -1) return state;

            const newNodes = [...state.nodes];
            newNodes[nodeIndex] = { ...newNodes[nodeIndex], ...data };

            // Update nodeStates for the specific node
            const newNodeStates = {
                ...state.nodeStates,
                [id]: { ...state.nodeStates[id], ...data }
            };

            return {
                nodes: newNodes,
                nodeStates: newNodeStates
            };
        });

        // Debounce save operation
        if (get().debouncedSave) clearTimeout(get().debouncedSave);
        const debouncedSave = setTimeout(() => {
            get().savePlayground();
        }, 1000);
        set({ debouncedSave });
    },

    setNodeState: (nodeId, state) => {
        set((currentState) => ({
            nodeStates: {
                ...currentState.nodeStates,
                [nodeId]: { 
                    ...currentState.nodeStates[nodeId], 
                    state: state 
                }
            }
        }));
    },

    getNodeState: (nodeId) => {
        return get().nodeStates[nodeId]?.state || 'idle';
    },

    updateNodeParameters: (id, parameters) => {
        set((state) => ({
            nodes: state.nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            parameters: {
                                ...node.data.parameters,
                                ...Object.keys(parameters).reduce((acc, key) => {
                                    acc[key] = parameters[key];
                                    return acc;
                                }, {}),
                            },
                        },
                    };
                }
                return node;
            }
            ),
        }));
        get().savePlayground();
    },

    updateEdge: (id, data) => {
        set((state) => ({
            edges: state.edges.map((edge) =>
                edge.id === id ? { ...edge, ...data } : edge
            ),
        }));
        get().savePlayground();
    },

    clearPlayground: () => {
        set({
            nodes: [],
            edges: [],
        });
        get().savePlayground();
    },

    // Run playground graph with end_node_id
    runPlaygroundGraph: async (endNodeId) => {
        // Get nodes and edges
        const { nodes, edges } = get();
      
        // Prepare data to send to backend
        const flowData = {
          nodes: nodes.map((node) => ({
            id: node.id,
            name: node.data.name,
            name_count: node.data.name_count,
            type: node.type,
            parameters: node.data.parameters || {},
            position: node.position,
          })),
          edges: edges.map((edge) => ({
            id: edge.id || "",
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
          })),
            viewport: get().viewport,
        };
      
        const response = await fetch('http://localhost:3000/api/v1/graph/run?end_node_id=' + endNodeId, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(flowData),
          });
      
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to run graph');
        }
      
        const { task_id, status, nodes_to_run } = await response.json();

        // Update nodes to run
        for (const nodeId of nodes_to_run) {
            get().setNodeState(nodeId, 'running');
        }
      
        const result = await new Promise((resolve, reject) => {
          const socket = new WebSocket('ws://localhost:3000/api/v1/graph/ws');
      
          socket.onopen = () => {
            socket.send(JSON.stringify({ task_id }));
          };
      
          socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
      
            // Handle real-time node updates from Redis pub/sub
            if (message.type === 'node_complete') {
                const nodeId = message.result.id;
                get().setNodeState(nodeId, 'idle');
                
                // Update the node data with the result
                get().updateNode(nodeId, {
                  data: {
                    ...get().getNodeById(nodeId)?.data,
                    parameters: message.result.parameters,
                    outputs: message.result.outputs,
                    updated: message.result.updated,
                    success: message.result.success,
                    errors: message.result.errors,
                  }
                });
            } 
            // Handle final task completion
            else if (message.status === 'completed' && message.result) {
              resolve(message.result);
            } else if (message.status === 'failed') {
              // Set all running nodes to error state
              for (const nodeId of nodes_to_run) {
                get().setNodeState(nodeId, 'error');
              }
              reject(new Error(message.error || 'Task failed'));
            }
          };
      
          socket.onerror = (err) => {
            // Set all running nodes to error state
            for (const nodeId of nodes_to_run) {
              get().setNodeState(nodeId, 'error');
            }
            reject(err);
          };
        });
      
        const resultNodes = result.nodes.map((node) => ({
          id: node.id,
          type: node.type,
          position: { x: node.position.x, y: node.position.y },
          data: {
            name: node.name,
            name_count: node.name_count,
            parameters: node.parameters,
            outputs: node.outputs,
            updated: node.updated,
            success: node.success,
            errors: node.errors,
          },
          initialWidth: 10,
          initialHeight: 10,
        }));
        const resultEdges = result.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        }));
        const resultViewport = result.viewport;

        const resultErrors = result.errors;
      
        set({ nodes: resultNodes, edges: resultEdges, viewport: resultViewport });
        
        // Reset all nodes to idle state after completion
        for (const nodeId of nodes_to_run) {
            get().setNodeState(nodeId, 'idle');
        }
        
        get().savePlayground();
      
        return { nodes: resultNodes, edges: resultEdges, viewport: resultViewport, errors: resultErrors };
      },

    duplicateNode: (nodeId) => {
        const nodeToDuplicate = get().getNodeById(nodeId);
        if (!nodeToDuplicate) {
            console.error('Node to duplicate not found');
            return;
        }

        const newNode = {
            ...nodeToDuplicate,
            id: `${nodeToDuplicate.type}-${uuidv4()}`,
            position: {
                x: nodeToDuplicate.position.x + 50,
                y: nodeToDuplicate.position.y + 50
            },
            data: {
                ...nodeToDuplicate.data,
                name: `${nodeToDuplicate.data.name} (Copy)`,
                name_count: get().countName(nodeToDuplicate.data.name)
            }
        };

        set((state) => ({
            nodes: [...state.nodes, newNode]
        }));
        get().savePlayground();
    },

    nodeStates: {} // New state slice for individual node states
}));