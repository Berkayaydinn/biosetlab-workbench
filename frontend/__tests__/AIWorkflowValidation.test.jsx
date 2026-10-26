import { usePlaygroundStore } from "../src/store/playgroundStore";
import { NodeConfig } from "../src/config/NodeConfig";

// Use real node definitions so the tests follow the application's catalog.
const nodeTypes = Object.keys(NodeConfig).filter((type) => {
    const config = NodeConfig[type];
    return config && typeof config === "object" && typeof config.name === "string";
});

const validType = nodeTypes[0];

const compatiblePair = (() => {
    for (const sourceType of nodeTypes) {
        for (const targetType of nodeTypes) {
            const outputs = NodeConfig[sourceType].outputs || [];
            const inputs = NodeConfig[targetType].inputs || [];
            for (const output of outputs) {
                for (const input of inputs) {
                    const accepted = Array.isArray(input.type) ? input.type : [input.type];
                    if (accepted.includes(output.type)) {
                        return { sourceType, targetType, output, input };
                    }
                }
            }
        }
    }
    return null;
})();

const node = (id, type = validType) => ({ id, type, parameters: {} });
const workflow = (nodes, edges = []) => ({ nodes, edges });

const validConnection = () => {
    if (!compatiblePair) {
        throw new Error("No compatible handle pair found in NodeConfig.");
    }
    return workflow(
        [node("source", compatiblePair.sourceType), node("target", compatiblePair.targetType)],
        [{
            id: "edge-1",
            source: "source",
            target: "target",
            sourceHandle: compatiblePair.output.name,
            targetHandle: compatiblePair.input.name,
        }]
    );
};

const load = (value) => usePlaygroundStore.getState().loadAIWorkflow(value);

describe("AI workflow loading and validation", () => {
    let timerSpy;

    beforeEach(() => {
        // loadAIWorkflow schedules autosave; keep this suite entirely offline.
        timerSpy = jest.spyOn(global, "setTimeout").mockImplementation(() => 0);
        usePlaygroundStore.setState({
            id: null,
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 },
        });
    });

    afterEach(() => {
        timerSpy.mockRestore();
    });

    test("accepts a valid node and preserves its ID and parameters", () => {
        expect(validType).toBeDefined();
        load(workflow([{ ...node("n1"), parameters: { sample: 3 } }]));
        const result = usePlaygroundStore.getState();
        expect(result.nodes).toHaveLength(1);
        expect(result.nodes[0].id).toBe("n1");
        expect(result.nodes[0].type).toBe(validType);
        expect(result.nodes[0].data.parameters.sample).toBe(3);
        expect(result.edges).toHaveLength(0);
    });

    test("rejects an unknown node type", () => {
        expect(() => load(workflow([node("n1", "not-a-real-node")]))).toThrow(
            /Unsupported AI workflow node type/
        );
    });

    test("rejects a missing node ID", () => {
        expect(() => load(workflow([{ type: validType }]))).toThrow(/invalid ID/);
    });

    test("rejects duplicate node IDs", () => {
        expect(() => load(workflow([node("same"), node("same")]))).toThrow(/Duplicate/);
    });

    test("rejects an edge that refers to a missing node", () => {
        const edge = { source: "n1", target: "missing", sourceHandle: "out", targetHandle: "in" };
        expect(() => load(workflow([node("n1")], [edge]))).toThrow(/unknown node/);
    });

    test("rejects an invalid edge handle", () => {
        const valid = validConnection();
        valid.edges[0].sourceHandle = "not-a-real-output-handle";
        expect(() => load(valid)).toThrow(/Invalid AI workflow connection/);
    });

    test("accepts a compatible connection and preserves its handles", () => {
        const valid = validConnection();
        load(valid);
        const result = usePlaygroundStore.getState();
        expect(result.nodes).toHaveLength(2);
        expect(result.edges).toHaveLength(1);
        expect(result.edges[0]).toMatchObject(valid.edges[0]);
    });

    test("an invalid workflow leaves the existing graph untouched", () => {
        const existingNode = { id: "original", type: validType, data: { name: "Existing" } };
        const existingEdge = { id: "original-edge", source: "a", target: "b" };
        usePlaygroundStore.setState({ nodes: [existingNode], edges: [existingEdge] });

        expect(() => load(workflow([node("n1", "unknown-node-type")]))).toThrow();
        expect(usePlaygroundStore.getState().nodes).toEqual([existingNode]);
        expect(usePlaygroundStore.getState().edges).toEqual([existingEdge]);
    });
});
